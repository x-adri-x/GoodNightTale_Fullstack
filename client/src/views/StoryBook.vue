<script setup lang="ts">
import { trpc } from '@/trpc'
import {ref} from 'vue'
import {handleError} from '@/utils/helpers'

const errorMessage = ref()
const safeGetTales = handleError(trpc.tale.find.query, errorMessage)
const tales = await safeGetTales()
</script>
<template>
    <div class="main">
        <v-sheet class="sheet" rounded="xl" color="deep-orange-lighten-1"></v-sheet>
    </div>
</template>
<style scoped>
.main {
  padding: 2rem;
  width: 100%;
}

.sheet {
    width: 40vw;
    height: 40vw;
}
</style>