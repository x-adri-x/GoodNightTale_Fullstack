<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { trpc } from '@/trpc'
import { useRoute, useRouter } from 'vue-router'
import { type Tale } from '@goodnighttale/server/src/shared/entities'
import AlertToast from '@/components/AlertToast.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { handleError, checkIllustrationExpiration } from '@/utils/helpers'

const illustrationRequestErrorMessage =
  'Something went wrong when trying to generate images for your tale.'

const title: Ref<string> = ref('')
const prompt: Ref<string> = ref('')
const errorMessage: Ref<string> = ref('')
const illustrations = ref()
const taleRef: Ref<Tale | undefined> = ref()
const route = useRoute()
const taleId = parseInt(route.params.id as string, 10)
const isLoading: Ref<boolean> = ref(false)
const btnText: Ref<string> = ref('')
const tempUrl: Ref<string> = ref('')
const editedIllustrationId = ref()
const router = useRouter()

let taleIllustrations
try {
  taleIllustrations = await trpc.illustration.find.query({ taleId })
} catch (error) {
  router.push({ name: 'Not Found' })
}

const illustrationsData = taleIllustrations?.map((i: { id: any; createdAt: any }) => ({
  id: i.id,
  createdAt: i.createdAt,
}))

illustrationsData?.map(async (data: { createdAt: string; id: any }) => {
  if (!checkIllustrationExpiration(data.createdAt)) {
    const safeIllustrationDownload = handleError(trpc.illustration.download.query, errorMessage)
    await safeIllustrationDownload(data.id)
  }
})

const updatedTale = await trpc.tale.get.query(taleId)
taleRef.value = updatedTale
illustrations.value = updatedTale.illustrations.filter((i) => !i.isTemp)

const updateTitle = async () => {
  isLoading.value = true
  const updated = await trpc.tale.update.mutate({
    taleId,
    title: title.value,
  })
  if (updated.affected === 1) {
    isLoading.value = false
    taleRef.value!.title = title.value
    title.value = ''
  }
}

const generateNewIllustration = async (id: string) => {
  isLoading.value = true
  editedIllustrationId.value = id

  // Save the prompts and other data to illustration
  const illustration = {
    prompt: prompt.value,
    taleId: taleId,
    createdAt: new Date(),
    isTemp: true,
  }

  const created = await trpc.illustration.create.mutate(illustration)

  // DALL-E generates the images from the new prompt
  try {
    await trpc.openai.visual.mutate({
      taleId,
      illustrationIds: [created.id],
    })

    await trpc.illustration.upload.mutate({ taleId: taleId, id: created.id })
    await trpc.illustration.download.query(created.id)
    const illustrations = await trpc.illustration.find.query({ taleId })
    const illustrationData = illustrations.filter((i) => i.id === created.id)[0]
    tempUrl.value = illustrationData.url
    isLoading.value = false
  } catch (error) {
    errorMessage.value = illustrationRequestErrorMessage
  }
  isLoading.value = false
}

const updateIllustration = async (id: any) => {
  isLoading.value = true
  const updated = await trpc.illustration.update.mutate({
    id,
    url: tempUrl.value,
    prompt: prompt.value,
  })
  const index = illustrations.value.findIndex((obj: { id: any }) => obj.id === id)
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

  <div class="main" v-if="taleRef">
    <div class="container">
      <h1>Customize your tale</h1>
      <h2>{{ taleRef.title }}</h2>
      <h3>Change title:</h3>
      <v-text-field
        v-model="title"
        theme="primary-darken-1"
        :rules="[(value: string | any[]) => value.length >= 5]"
        :label="taleRef.title"
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
              :src="
                tempUrl && illustration.id === editedIllustrationId ? tempUrl : illustration.url
              "
              width="100%"
              :alt="illustration.prompt"
            />
            <ButtonPrimary
              v-if="tempUrl"
              class="btn"
              text="Save illustration"
              :isDisabled="prompt.length < 20"
              @click="() => updateIllustration(illustration.id)"
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container {
    width: 60%;
  }
}
</style>
