<script lang="ts" setup>
import { trpc } from '@/trpc'
import { FwbButton, FwbCard } from 'flowbite-vue'
import { ref } from 'vue'

const taleId = ref()
const tale = ref()
const title = ref('')

// const updateTitle = async() => {

// }

const createTale = async () => {
  const createdTale = await trpc.tale.create.mutate({
    title: title.value,
    body: 'Once upon a time ...',
    keywords: ['foo', 'bar', 'baz'],
    isFavorite: false,
  })
  tale.value = createdTale
  taleId.value = createdTale.id
}
</script>

<template>
  <div class="DashboardView">
    <div class="mt-4 flex flex-col">
      <p>
        Demonstrates the creation of a tale record. Data is hardcoded for demonstration purposes.
      </p>
      <div>
        <label for="title" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Title of tale</label
        >
        <input
          v-model="title"
          type="text"
          id="title"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="title"
          required
        />
      </div>
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
    </div>
  </div>
</template>
