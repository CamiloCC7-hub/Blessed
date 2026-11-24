<script setup>
import { ref } from 'vue'
import { facts } from '../data/historia'
const dialog = ref(null)
const fact = ref(null)
function open(key) {
  fact.value = facts[key]
  if (fact.value) dialog.value.showModal()
}
defineExpose({ open })
</script>
<template><dialog ref="dialog" class="spa-dialog"><article v-if="fact"><p class="eyebrow">{{ fact.label }}</p><p>{{ fact.text }}</p><a v-if="fact.source" :href="fact.source" target="_blank" rel="noopener">Consultar fuente ↗</a></article><form method="dialog"><button class="pill" autofocus>Cerrar</button></form></dialog></template>