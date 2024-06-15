<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import PageWrapper from '@/components/PageWrapper.vue'
import CarouselComponent from './TaleView/CarouselComponent.vue'
import CarouselSlide from './TaleView/CarouselSlide.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { mdiTooltipEdit } from '@mdi/js'

const isFavorite = ref(false)

const favorite = async (id: number) => {
  await trpc.tale.update.mutate({ taleId: id, isFavorite: true })
  isFavorite.value = true
}
</script>
<template>
  <PageWrapper>
    <template v-slot="props">
      <div class="heading">
        <h1>{{ props.tale.title }}</h1>
        <v-icon :icon="mdiTooltipEdit" :size="30"></v-icon>
      </div>

      <CarouselComponent v-slot="{ currentSlide }">
        <CarouselSlide v-for="(page, i) in props.pages" :key="i">
          <div v-show="i === currentSlide">
            <img v-if="i === 2 || i === 4" :src="page" width="100%" alt="alt" />
            <div v-else :class="{ title: i === 0 }">{{ page }}</div>
          </div>
        </CarouselSlide>
      </CarouselComponent>
      <ButtonPrimary
        v-show="!isFavorite"
        class="btn"
        text="Mark as Favorite"
        @click="() => favorite(props.tale.id)"
      />
    </template>
  </PageWrapper>
</template>
<style scoped>
.btn {
  margin-top: 40px;
  width: 100vw;
  height: 50px;
}
.heading {
  display: flex;
  justify-content: space-between;
}

h1 {
  font-size: x-large;
}

img {
  border-top-right-radius: 15%;
  border-bottom-right-radius: 15%;
}

.title {
  font-size: 1.3rem;
}
</style>
