<script setup>
import { reactive, ref } from 'vue'
import { readLocal, writeLocal } from '../store'
const blank = { service: '', food: '', highlight: '', recommend: '', comment: '' }
const form = reactive({ ...blank })
const status = ref('')
function submit() {
  const key = 'cecilia-satisfaction-surveys-v1'
  const saved = writeLocal(key, [...readLocal(key, []), { ...form, createdAt: new Date().toISOString() }])
  status.value = saved ? 'Gracias. Tu opinión quedó guardada en este navegador.' : 'No se pudo guardar tu respuesta.'
  if (saved) Object.assign(form, blank)
}
</script>
<template><section class="paper"><h2>¿Cómo te supo la experiencia?</h2><p>Encuesta de demostración guardada en este dispositivo.</p>
<form class="form-grid" @submit.prevent="submit"><label v-for="(label, key) in { service: 'Atención', food: 'Sabor' }" :key="key">{{ label }}<select v-model="form[key]" required><option value="">Calificar del 1 al 5</option><option v-for="n in 5" :key="n">{{ n }}</option></select></label>
<label>¿Qué disfrutaste más?<select v-model="form.highlight" required><option value="">Elige una opción</option><option v-for="item in ['La atención','El sabor','El ambiente','La celebración']" :key="item">{{ item }}</option></select></label>
<label>¿Nos recomendarías?<select v-model="form.recommend" required><option value="">Elige una opción</option><option>Sí</option><option>Tal vez</option><option>Aún no</option></select></label><label class="wide">Comentario opcional<textarea v-model="form.comment" maxlength="240"></textarea></label><button class="pill">Guardar opinión</button></form><p role="status">{{ status }}</p></section></template>