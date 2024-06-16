<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const router = useRouter()
const mobileView = ref(window.innerWidth < 768)
</script>
<template>
  <div class="main">
    <div class="container">
      <div class="headings">
        <h1>Good Night Tale App</h1>
        <h2 v-show="!mobileView">Generate a cute tale for your little one <br />with OpenAI.</h2>
      </div>

      <nav>
        <ButtonPrimary class="btn" text="Login" @click="router.push('/login')" />
        <ButtonPrimary class="btn" text="Create account" @click="router.push('/signup')" />
      </nav>
    </div>
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

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.headings {
  margin-top: 20vh;
}

h1 {
  text-align: center;
  font-size: 4.8rem;
  color: #515151;
  margin-bottom: 60px;
}

nav {
  width: 80vw;
  text-align: center;
}
.btn {
  width: 80%;
  height: 50px;
  margin-top: auto;
  color: blanchedalmond;
  margin-bottom: 20px;
}

@media (width >= 768px) {
  .main {
    justify-content: center;
  }

  .container {
    max-width: 800px;
  }
  .btn {
    background: linear-gradient(180deg, rgba(238, 175, 165, 1) 0%, rgba(115, 144, 152, 1) 100%);
    width: 100%;
    height: 80px;
    margin: 10px 0px;
    color: var(--vt-c-black-soft);
    font-weight: 700;
  }

  h1 {
    font-size: 3rem;
    justify-self: flex-start;
    margin-bottom: 0px;
    text-align: left;
    margin-top: 2vh;
    letter-spacing: 2px;
  }

  h2 {
    font-size: 1.8rem;
  }

  nav {
    margin-top: 10vh;
    width: 100%;
  }
}

@media (width >= 1055px) {
  h1 {
    margin-top: 10vh;
  }

  nav {
    margin-bottom: 40vh;
  }
}
</style>
