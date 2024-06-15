<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { handleError } from '@/utils/helpers'

const errorMessage = ref()
const safeGetTales = handleError(trpc.tale.find.query, errorMessage)
const tales = await safeGetTales()
const router = useRouter()
</script>
<template>
  <div class="main">
    <h1>Bedtime Storybook</h1>
    <div class="container">
      <v-sheet
        v-for="tale in tales"
        :key="tale.id"
        class="sheet"
        rounded="xl"
        color="deep-orange-lighten-1"
        @click="router.push(`/page/${tale.id}`)"
      >
        <p>{{ tale.title }}</p>
      </v-sheet>
    </div>
  </div>
</template>
<style scoped>
.main {
  padding: 2rem;
  width: 100%;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

p {
  font-size: 1.2rem;
  font-weight: 500;
}

.sheet {
  width: 40vw;
  height: 40vw;
  text-align: center;
  padding: 15px;
}

h1 {
  text-align: center;
  font-size: 1.5rem;
  color: #515151;
  margin-bottom: 60px;
}
</style>
