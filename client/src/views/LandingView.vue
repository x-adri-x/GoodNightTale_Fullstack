<script setup lang="ts">
import { useRouter } from 'vue-router'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const router = useRouter()
</script>
<template>
  <div class="main">
    <h1>Good Night Tale App</h1>
    <nav>
      <ButtonPrimary class="btn" text="Login" @click="router.push('/login')" />
      <ButtonPrimary class="btn" text="Create account" @click="router.push('/signup')" />
      <!-- <RouterLink class="navlink" to="/login">Login</RouterLink>
      <RouterLink class="navlink" to="/signup">Create account</RouterLink> -->
    </nav>
  </div>
</template>
<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-image: url('../assets/kenrick-mills.png');
  background-size: cover;
  padding: 2rem;
  width: 100%;
  justify-content: flex-end;
}

h1 {
  text-align: center;
  font-size: 4.8rem;
  color: #515151;
  margin-bottom: 60px;
}

.btn {
  width: 80vw;
  height: 50px;
  margin-top: auto;
  color: blanchedalmond;
  margin-bottom: 20px;
}

/* .navlink {
  letter-spacing: 1;
  background-color: transparent;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.6);
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 50px;
  color: blanchedalmond;
} */
</style>
