<script lang="ts" setup>
import { signup } from '@/stores/user'
import { ref } from 'vue'
import PageForm from '@/components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const userForm = ref({
  email: '',
  password: '',
})

const hasSucceeded = ref(false)

const [submitSignup, errorMessage] = useErrorMessage(async () => {
  await signup(userForm.value)

  hasSucceeded.value = true
})
</script>

<template>
  <div class="main">
    <div>
      <h1>Sign up for an account</h1>
      <v-form role="form" @submit="submitSignup">
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
        <ButtonPrimary class="btn" type="submit" text="Sign up" />
        <p>
          Already a member?
          {{ ' ' }}
          <RouterLink :to="{ name: 'Login' }" class="bold">Log in</RouterLink>
        </p>
      </v-form>
    </div>
  </div>

  <!-- <PageForm heading="Sign up for an account" formLabel="Signup" @submit="submitSignup">
    <template #default>
      <FwbInput label="Email" type="email" v-model="userForm.email" :required="true" />

      <FwbInput
        label="Password"
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        v-model="userForm.password"
        :required="true"
      />

      <FwbAlert v-if="hasSucceeded" data-testid="successMessage" type="success">
        You have successfully signed up! You can now log in.
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Go to the login page</RouterLink
        >
      </FwbAlert>
      <AlertError :message="errorMessage">
        {{ errorMessage }}
      </AlertError>

      <div class="grid">
        <FwbButton color="default" type="submit" size="xl">Sign up</FwbButton>
      </div>
    </template>

    <template #footer>
      <FwbAlert class="bg-transparent text-center">
        Already a member?
        {{ ' ' }}
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Log in</RouterLink
        >
      </FwbAlert>
    </template>
  </PageForm> -->
</template>
<style scoped>
.main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 2rem;
  width: 100%;
  justify-content: center;
}

h1 {
  margin-bottom: 60px;
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
