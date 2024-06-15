<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { trpc } from '@/trpc'
import PageWrapper from '@/components/PageWrapper.vue'
import AlertToast from '@/components/AlertToast.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { handleError, checkUrlValidity } from '@/utils/helpers'

const title = ref('')
const prompts = ref(['', ''])

const errorMessage = ref()
const illustrations = ref()
const route = useRoute()
const id = route.params.id as string

const getIllustrations = handleError(trpc.illustration.find.query, errorMessage)
illustrations.value = await getIllustrations({ taleId: parseInt(id, 10) })

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
  <PageWrapper v-if="illustrations">
    <template v-slot="props">
      <h1>Customize your tale</h1>
      <h2>{{ props.tale.title }}</h2>
      <h3>Change title:</h3>
      <v-text-field
        v-model="title"
        theme="primary-darken-1"
        :rules="[(value: string | any[]) => value.length >= 5]"
        :label="props.tale.title"
      ></v-text-field>
      <ButtonPrimary class="btn" text="Save changes" :isDisabled="title.length < 3" />
      <v-divider></v-divider>
      <div v-if="illustrations">
        <div v-for="(illustration, i) in illustrations" :key="illustration.id">
          <h3>Change prompt for image:</h3>
          <p>
            {{ illustration.prompt }}
          </p>
          <v-textarea
            v-model="prompts[i]"
            theme="primary-darken-1"
            label="Write your own prompt (min 20 characters)"
            :rules="[(value) => value.length >= 20]"
            counter
            minlength="20"
          ></v-textarea>

          <img :src="illustration.url" width="100%" :alt="illustration.prompt" />
          <ButtonPrimary class="btn" text="Save changes" :isDisabled="title.length < 20" />
          <v-divider></v-divider>
        </div>
      </div>
    </template>
  </PageWrapper>
</template>
<style scoped>
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
