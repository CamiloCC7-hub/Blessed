<script setup>
import { ref } from 'vue'
import { questions } from '../data/historia'
const key = 'cecilia-quiz-complete-v1'
let previous
try { previous = JSON.parse(sessionStorage.getItem(key)) } catch {}
const result = ref(previous?.percent ?? null)
const step = ref(0)
const score = ref(0)
const answer = ref('')
function next() {
  if (!answer.value || result.value !== null) return
  if (answer.value === questions[step.value].correct) score.value++
  step.value++
  answer.value = ''
  if (step.value === questions.length) {
    result.value = [0, 5, 10, 12][score.value]
    try { sessionStorage.setItem(key, JSON.stringify({ score: score.value, percent: result.value })) } catch {}
  }
}
</script>
<template><section class="paper"><h2>El reto Cecilia</h2><p v-if="result !== null" role="status">Resultado de esta visita: {{ result }} % de descuento. El equipo de Cecilia debe confirmarlo.</p><form v-else @submit.prevent="next"><fieldset><legend>{{ step + 1 }} de {{ questions.length }} · {{ questions[step].prompt }}</legend><label class="choice" v-for="item in questions[step].answers" :key="item.id"><input type="radio" v-model="answer" :value="item.id" required> {{ item.text }}</label></fieldset><button class="pill" :disabled="!answer">{{ step === 2 ? 'Ver resultado' : 'Siguiente' }}</button></form></section></template>