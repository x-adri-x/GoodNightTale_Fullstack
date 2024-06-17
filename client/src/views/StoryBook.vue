<script setup lang="ts">
import { trpc } from '@/trpc'
import { type Tale } from '@mono/server/src/shared/entities'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { handleError } from '@/utils/helpers'

const errorMessage = ref()
const safeGetTales = handleError(trpc.tale.find.query, errorMessage)
const tales = await safeGetTales()
const favorites = tales.filter((t: Tale) => t.isFavorite)
// const notFavorites = tales.filter((t: Tale) => !t.isFavorite)

const router = useRouter()
</script>
<template>
  <div class="main">
    <h1>Bedtime Storybook</h1>
    <div v-if="favorites.length > 0">
      <h2>Favorite stories of your little one</h2>
      <div class="favorites">
        <v-sheet
          v-for="favorite in favorites"
          :key="favorite.id"
          class="sheet"
          rounded="xl"
          @click="router.push(`/page/${favorite.id}`)"
        >
          <p>{{ favorite.title }}</p>
        </v-sheet>
      </div>
    </div>

    <v-divider></v-divider>
    <div v-if="tales.length > 0">
      <h2>All stories in your book</h2>
      <div class="tales">
        <v-sheet
          v-for="tale in tales"
          :key="tale.id"
          class="sheet"
          rounded="xl"
          @click="router.push(`/page/${tale.id}`)"
        >
          <p>{{ tale.title }}</p>
        </v-sheet>
      </div>
    </div>
  </div>
</template>
<style scoped>
.main {
  padding: 2rem;
  width: 100%;
}

.favorites,
.tales {
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
  max-width: 200px;
  max-height: 200px;
  text-align: center;
  padding: 15px;
  margin: 20px 0px;
  color: #0d0c0f;
  background: linear-gradient(70deg, rgba(130, 144, 147, 1) 0%, rgba(115, 144, 152, 1) 100%);
}

h1 {
  text-align: center;
  font-size: 1.5rem;
  color: #515151;
  margin-bottom: 60px;
}

h2 {
  font-size: 1.2rem;
  margin: 30px 0px;
}

@media (width >= 768px) {
  .favorites,
  .tales {
    grid-template-columns: repeat(4, 1fr);
  }

  .sheet {
    width: 20vw;
    height: 20vw;
  }
}

@media (width >= 1055px) {
  .favorites,
  .tales {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
