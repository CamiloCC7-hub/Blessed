<script setup>
import { onMounted, ref } from 'vue'
const facts = ref([])
const index = ref(0)
const error = ref('')
async function load() {
  error.value = ''
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'data.json')
    if (!response.ok) throw Error()
    const data = await response.json()
    if (!data.facts?.length) throw Error()
    facts.value = data.facts
  } catch { error.value = 'No se pudieron cargar las curiosidades.' }
}
onMounted(load)
</script>
<template><section class="paper"><h2>Un dato recién servido</h2><template v-if="facts.length"><h3>{{ facts[index].title }}</h3><p>{{ facts[index].text }}</p><a v-if="facts[index].source" :href="facts[index].source" target="_blank" rel="noopener">Consultar fuente ↗</a><button class="pill" @click="index = (index + 1) % facts.length">Otro dato</button></template><p v-else-if="error">{{ error }} <button @click="load">Reintentar</button></p><p v-else>Cargando curiosidades…</p></section></template>