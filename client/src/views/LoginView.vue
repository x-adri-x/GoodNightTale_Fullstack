<script lang="ts" setup>
import { login } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useErrorMessage from '@/composables/useErrorMessage'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import AlertToast from '@/components/AlertToast.vue'

const router = useRouter()

const userForm = ref({
  email: '',
  password: '',
})

const [submitLogin, errorMessage] = useErrorMessage(async () => {
  await login(userForm.value)
  router.push({ name: 'Home' })
})
</script>

<template>
  <div class="main">
    <div>
      <h1>Log in to your account</h1>
      <v-form role="form" @submit.prevent="submitLogin">
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
          text="Log in"
          :isDisabled="!userForm.password || !userForm.email"
        />
        <p>
          Not a member yet?
          {{ ' ' }}
          <RouterLink :to="{ name: 'Signup' }" class="bold">Sign up</RouterLink>
        </p>
      </v-form>
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

@media (width >= 768px) {
  .main {
    justify-content: center;
  }
}
</style>
