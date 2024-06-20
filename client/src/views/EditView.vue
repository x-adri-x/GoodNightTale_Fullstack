<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { trpc } from '@/trpc'
import AlertToast from '@/components/AlertToast.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import {
  handleError,
  checkUrlValidity,
  generateIllustrations,
  refreshIllustrationUrls,
} from '@/utils/helpers'

const illustrationRequestErrorMessage =
  'Something went wrong when trying to generate images for your tale.'

const title = ref('')
const prompt = ref('')
const errorMessage = ref()
const illustrations = ref()
const tale = ref()
const route = useRoute()
const taleId = parseInt(route.params.id as string, 10)
const isLoading = ref(false)
const btnText = ref('')
const tempUrl = ref('')
const editedIllustrationId = ref()

const safeGet = handleError(trpc.tale.get.query, errorMessage)
tale.value = await safeGet(taleId)
if (errorMessage.value === 'Tale not found') {
  // TODO: handle when no tale is found with the id in params
  // redirect to 404 page
}

const updateTitle = async () => {
  isLoading.value = true
  const updated = await trpc.tale.update.mutate({
    taleId,
    title: title.value,
  })
  if (updated.affected === 1) {
    isLoading.value = false
    tale.value.title = title.value
    title.value = ''
  }
}

const generateNewIllustration = async (id: string) => {
  isLoading.value = true
  editedIllustrationId.value = id

  // DALL-E generates the images from the new prompts
  try {
    const response = await generateIllustrations([prompt.value])
    const generatedUrl = response.map((r: { data: { url: string }[] }) => r.data[0].url)
    tempUrl.value = generatedUrl[0]
    isLoading.value = false
  } catch (error) {
    errorMessage.value = illustrationRequestErrorMessage
  }
  isLoading.value = false
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

const updateIllustration = async (illustrationId: any, key: string) => {
  isLoading.value = true
  // upload the new images to S3 with the same key
  const safeIllustrationUpload = handleError(trpc.illustration.upload.mutate, errorMessage)
  await safeIllustrationUpload({ url: tempUrl.value, key })

  // grab the new url-s from S3
  const { urls, error } = await refreshIllustrationUrls([key], errorMessage)
  errorMessage.value = error.value

  // update the illustration with the new prompt and url in the database
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
  isLoading.value = false
  discardChanges()
}

const discardChanges = () =>
  [tempUrl, btnText, prompt, editedIllustrationId].forEach((ref) => (ref.value = ''))
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
    <v-skeleton-loader v-if="isLoading && title" type="button" width="100%"></v-skeleton-loader>
    <ButtonPrimary
      v-else
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
        <v-skeleton-loader
          v-if="isLoading && illustration.id === editedIllustrationId"
          type="card"
          width="100%"
        ></v-skeleton-loader>
        <div v-else>
          <img
            :src="tempUrl && illustration.id === editedIllustrationId ? tempUrl : illustration.url"
            width="100%"
            :alt="illustration.prompt"
          />
          <ButtonPrimary
            v-if="tempUrl"
            class="btn"
            text="Save illustration"
            :isDisabled="prompt.length < 20"
            @click="() => updateIllustration(illustration.id, illustration.key)"
          />
          <ButtonPrimary
            v-else
            class="btn"
            text="Generate new image"
            :isDisabled="prompt.length < 20"
            @click="() => generateNewIllustration(illustration.id)"
          />

          <ButtonPrimary
            v-if="tempUrl"
            class="btn"
            text="Discard changes"
            :isDisabled="prompt.length < 20"
            @click="discardChanges"
          />
          <div></div>
        </div>

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

@media (width >= 768px) {
  .main {
    width: 80%;
  }
}
</style>
