<script setup lang="ts">
import { signup } from '@/stores/user'
import { ref } from 'vue'
import AlertToast from '@/components/AlertToast.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const userForm = ref({
  email: '',
  password: '',
})

const hasSucceeded = ref(false)
const [submitSignup, errorMessage] = useErrorMessage(async () => {
  await signup(userForm.value)
  userForm.value = {
    email: '',
    password: '',
  }
  hasSucceeded.value = true
})
</script>

<template>
  <div class="main">
    <div>
      <h1>Sign up for an account</h1>
      <v-form role="form" @submit.prevent="submitSignup">
        <v-text-field
          v-model="userForm.email"
          theme="primary-darken-1"
          label="email"
          type="email"
        ></v-text-field>
        <v-text-field
          v-model="userForm.password"
          theme="primary-darken-1"
          label="password"
          type="password"
        ></v-text-field>
        <ButtonPrimary
          class="btn"
          type="submit"
          text="Sign up"
          :isDisabled="!userForm.password || !userForm.email"
        />
        <p v-if="!hasSucceeded">
          Already a member?
          {{ ' ' }}
          <RouterLink :to="{ name: 'Login' }" class="bold">Log in</RouterLink>
        </p>
      </v-form>
      <div v-if="hasSucceeded">
        <p data-testid="successMessage">You have successfully signed up! You can now log in.</p>
        <RouterLink :to="{ name: 'Login' }" class="bold">Go to the login page</RouterLink>
      </div>
      <div v-if="errorMessage">
        <AlertToast data-testid="errorMessage" variant="error" title="Error" :text="errorMessage" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  width: 100%;
  justify-content: center;
}

h1 {
  margin-bottom: 60px;
}

p {
  margin-bottom: 20px;
}

.btn {
  width: 100%;
  height: 50px;
  margin-top: auto;
  color: blanchedalmond;
  margin-bottom: 20px;
}

.bold {
  color: #ed9c98;
  font-weight: 500;
  text-decoration: none;
}
</style>
