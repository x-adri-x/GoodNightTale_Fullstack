<script lang="ts" setup>
import { trpc } from '@/trpc'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiCheckCircle } from '@mdi/js'
import { generateRandomWords, getRandomWords } from './helpers'
import constants from '@/constants/constants'
import AlertToast from '@/components/AlertToast.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import useTaleStore from '@/stores/tale'
import usePromptStore from '@/stores/prompt'

const randomWords = ref(getRandomWords())
const keyword: Ref<string> = ref('')
const keywords: Ref<string[]> = ref([])
const showWarning = ref(false)
const warning = ref('')
const taleStore = useTaleStore()
const promptStore = usePromptStore()
const router = useRouter()

const handleClick = () => {
  if (!keywords.value.includes(keyword.value)) {
    keywords.value.push(keyword.value)
    keyword.value = ''
    showWarning.value = false
  } else {
    showWarning.value = true
  }
}

const handleChipClose = (text: string) => {
  keywords.value = keywords.value.filter((k) => k !== text)
}

const selectRandomWord = (word: string) => {
  if (keywords.value.includes(word)) {
    showWarning.value = true
    warning.value = constants.duplicateWordWarning
  } else if (keywords.value.length >= 5) {
    showWarning.value = true
    warning.value = constants.maximumKeywordsReachedWarning
  } else {
    keywords.value.push(word)
    showWarning.value = false
  }
}

const [generateTale, errorMessage] = useErrorMessage(async () => {
  router.push('/tale')
  promptStore.reset()
  promptStore.updatePrompt({
    role: 'user',
    content: `The ${keywords.value.length} words are: ${keywords.value.slice(0).join(', ')}.`,
  })

  const tale = await trpc.openai.chat.mutate(promptStore.stream)
  taleStore.tale = tale
  taleStore.keywords = keywords.value
  taleStore.generationInProgress = true
})
</script>

<template>
  <div class="main">
    <h1 aria-label="Let's get started" data-testid="home-heading">Let's get started!</h1>
    <div>
      <AlertToast
        closable
        :text="constants.inputInfoMessage"
        variant="info"
        data-test="info-toast"
      />
    </div>
    <div v-if="errorMessage">
      <AlertToast data-testid="errorMessage" variant="error" title="Error" :text="errorMessage" />
    </div>

    <v-form @submit.prevent="handleClick">
      <v-text-field
        v-model="keyword"
        theme="primary-darken-1"
        :disabled="keywords.length >= 5"
        :rules="[(value) => value.length <= 9]"
        label="Keyword"
        counter
        maxlength="9"
      ></v-text-field>
    </v-form>

    <AlertToast v-if="showWarning" :text="warning" variant="warning"></AlertToast>
    <div class="random-chip-container" data-test="selected">
      <v-chip
        v-for="keyword in keywords"
        :key="keyword"
        class="chip"
        closable
        @click:close="handleChipClose(keyword)"
        >{{ keyword }}</v-chip
      >
    </div>
    <p
      class="link"
      data-test="regenerate-words"
      @click="randomWords = generateRandomWords()"
      @keyup="randomWords = generateRandomWords()"
    >
      Regenerate random list
    </p>
    <div class="random-chip-container" data-test="chip-container">
      <v-chip
        v-for="(word, index) in randomWords"
        :key="index"
        class="chip"
        :prepend-icon="keywords.includes(word) ? mdiCheckCircle : undefined"
        @click="selectRandomWord(word)"
        >{{ word }}</v-chip
      >
    </div>
    <ButtonPrimary
      text="Generate Tale"
      class="btn"
      :isDisabled="keywords.length < 5"
      @click="generateTale"
    />
  </div>
</template>
<style scoped>
.main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 2rem;
  width: 100%;
  justify-content: flex-start;
}

h1 {
  margin-bottom: 40px;
}

.random-chip-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 40px 0;
}

.btn {
  width: 80vw;
  height: 50px;
}

.link:hover {
  border-bottom: none;
}

.chip {
  justify-content: center;
}
</style>
