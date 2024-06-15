<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { trpc } from '@/trpc'
import AlertToast from '@/components/AlertToast.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { handleError, checkUrlValidity, generateIllustrations } from '@/utils/helpers'

const title = ref('')
const prompt = ref('')

const errorMessage = ref()
const illustrations = ref()
const tale = ref()
const route = useRoute()
const taleId = parseInt(route.params.id as string, 10)

const safeGet = handleError(trpc.tale.get.query, errorMessage)
tale.value = await safeGet(taleId)

const updateTitle = async () => {
  const updated = await trpc.tale.update.mutate({
    taleId,
    title: title.value,
  })
  if (updated.affected === 1) {
    tale.value.title = title.value
    title.value = ''
  }
}

const updatePrompt = async (illustrationId: any) => {
  const safeGenerateIllustrations = handleError(generateIllustrations, errorMessage)
  const response = await safeGenerateIllustrations([prompt.value])
  const urls = response.map((r: { data: { url: string }[] }) => r.data[0].url)
  const updated = await trpc.illustration.update.mutate({
    taleId,
    id: illustrationId,
    prompt: prompt.value,
    url: urls[0],
  })

  const index = illustrations.value.findIndex((obj: { id: any }) => obj.id === illustrationId)
  if (index !== -1) {
    illustrations.value[index] = updated
  }
}

const getIllustrations = handleError(trpc.illustration.find.query, errorMessage)
illustrations.value = await getIllustrations({ taleId })

illustrations.value.forEach(async (i: { createdAt: string; url: any; key: any }) => {
  if (!checkUrlValidity(i.createdAt)) {
    const safeIllustrationDownload = handleError(trpc.illustration.download.query, errorMessage)
    i.url = await safeIllustrationDownload(i.key)
    const safeCreate = handleError(trpc.illustration.update.mutate, errorMessage)
    await safeCreate(i)
  }
})
</script>
<template>
  <div v-if="errorMessage">
    <AlertToast data-testid="errorMessage" variant="error" title="Error" :text="errorMessage" />
  </div>
  <div class="main" v-if="illustrations">
    <h1>Customize your tale</h1>
    <h2>{{ tale.title }}</h2>
    <h3>Change title:</h3>
    <v-text-field
      v-model="title"
      theme="primary-darken-1"
      :rules="[(value: string | any[]) => value.length >= 5]"
      :label="tale.title"
    ></v-text-field>
    <ButtonPrimary
      class="btn"
      text="Save changes"
      :isDisabled="title.length < 3"
      @click="updateTitle"
    />
    <v-divider></v-divider>
    <div v-if="illustrations">
      <div v-for="illustration in illustrations" :key="illustration.id">
        <h3>Change prompt for image:</h3>
        <p>
          {{ illustration.prompt }}
        </p>
        <v-textarea
          v-model="prompt"
          theme="primary-darken-1"
          label="Write your own prompt (min 20 characters)"
          :rules="[(value: string | any[]) => value.length >= 20]"
          counter
          minlength="20"
        ></v-textarea>

        <img :src="illustration.url" width="100%" :alt="illustration.prompt" />
        <ButtonPrimary
          class="btn"
          text="Save changes"
          :isDisabled="prompt.length < 20"
          @click="() => updatePrompt(illustration.id)"
        />
        <v-divider></v-divider>
      </div>
    </div>
  </div>
</template>
<style scoped>
.main {
  padding: 2rem;
  width: 100%;
}

h1,
h2 {
  margin-bottom: 20px;
}

h3,
p {
  margin: 20px 0px;
}

.btn {
  margin: 20px 0px;
  width: 100vw;
  height: 50px;
}
</style>
