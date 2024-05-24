<script lang="ts" setup>
import { trpc } from '@/trpc'
import { FwbButton, FwbCard } from 'flowbite-vue'
import { ref } from 'vue'

const taleId = ref()
const tale = ref()
const name = ref('')

const url = 'https://i.etsystatic.com/41164611/r/il/6c98b9/5189679858/il_570xN.5189679858_6b19.jpg'
const downloadImage = async (url: string) => {
  const image = await trpc.illustration.download.query({ taleId: taleId.value, url })
  name.value = image
}

const createTale = async () => {
  const createdTale = await trpc.tale.create.mutate({
    title: 'My First Tale',
    body: 'Once upon a time ...',
    keywords: ['foo', 'bar', 'baz'],
    isFavorite: false,
  })
  tale.value = createdTale
  taleId.value = createdTale.id
}

const deleteImage = async (name: string) => {
  await trpc.illustration.remove.query({ taleId: taleId.value, name })
}
</script>

<template>
  <div class="DashboardView">
    <div class="mt-4 flex flex-col">
      <p>
        Demonstrates the creation of a tale record. Data is hardcoded for demonstration purposes.
      </p>
      <!-- prettier-ignore -->
      <FwbButton
        color="default"
        size="xl"
        @click=createTale
        class="w-80 mb-20"
      >
        Create a tale record in database
      </FwbButton>
      <FwbCard v-if="tale" class="mb-20 mt-6 max-w-sm rounded-lg border bg-white p-4 shadow-md">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{ tale.title }}
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{ tale.body }}
        </p>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Your provided keywords were {{ tale.keywords }}
        </p>
      </FwbCard>
      <div class="mt-4">
        <p>
          Downloads an image to your folder. URL is hard coded. Delete image, deletes the same image
          from your folder.
        </p>
        <FwbButton
          color="default"
          size="xl"
          @click="downloadImage(url)"
          class="mr-10 w-80"
          :disabled="taleId === undefined ? true : false"
        >
          Download image
        </FwbButton>
        <FwbButton
          color="default"
          size="xl"
          @click="deleteImage(name)"
          class="w-80"
          :disabled="name.length === 0 ? true : false"
        >
          Delete image
        </FwbButton>
      </div>
    </div>
  </div>
</template>
