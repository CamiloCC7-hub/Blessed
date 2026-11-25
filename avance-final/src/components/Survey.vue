<script setup>
import { reactive, ref } from 'vue'
import { readLocal, writeLocal } from '../store'
defineProps({ embedded: Boolean })
const dialog = ref(null)
function open() {
  status.value = ''
  dialog.value.showModal()
}
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
<template>
  <div :class="embedded ? 'survey-slot' : 'reservation survey-invite'">
<div class="booking-glass-card">
<span class="booking-mark" aria-hidden="true">✳</span>
<p class="booking-kicker">¿Ya compartiste una mesa con nosotros?</p>
<h3>Cuéntanos cómo<br>te fue.</h3>
<p>Una pregunta breve, una respuesta sincera y nos ayudas a servir mejor.</p>
<button class="text-link survey-open" @click="open" type="button">Dejar mi opinión <span aria-hidden="true">↗</span>
</button>
</div>
  </div>
  <dialog class="survey-dialog" ref="dialog" @click.self="dialog.close()" aria-labelledby="survey-title">
<form class="survey-form" @submit.prevent="submit">
<button class="dialog-close" type="button" @click="dialog.close()" aria-label="Cerrar encuesta">×</button>
<p class="eyebrow">TU VOZ MEJORA ESTA CASA</p>
<h2 id="survey-title">¿Cómo te supo la experiencia?</h2>
<fieldset>
<legend>¿Cómo fue la atención?</legend>
<div class="rating-options">
<label>
<input type="radio" v-model="form.service" name="service" value="1" required>
<span>1</span>
<small>Por mejorar</small>
</label>
<label>
<input type="radio" v-model="form.service" name="service" value="2">
<span>2</span>
</label>
<label>
<input type="radio" v-model="form.service" name="service" value="3">
<span>3</span>
</label>
<label>
<input type="radio" v-model="form.service" name="service" value="4">
<span>4</span>
</label>
<label>
<input type="radio" v-model="form.service" name="service" value="5">
<span>5</span>
<small>¡De diez!</small>
</label>
</div>
</fieldset>
<fieldset>
<legend>¿Qué tal estuvo el sabor?</legend>
<div class="rating-options">
<label>
<input type="radio" v-model="form.food" name="food" value="1" required>
<span>1</span>
<small>No era lo esperado</small>
</label>
<label>
<input type="radio" v-model="form.food" name="food" value="2">
<span>2</span>
</label>
<label>
<input type="radio" v-model="form.food" name="food" value="3">
<span>3</span>
</label>
<label>
<input type="radio" v-model="form.food" name="food" value="4">
<span>4</span>
</label>
<label>
<input type="radio" v-model="form.food" name="food" value="5">
<span>5</span>
<small>Delicioso</small>
</label>
</div>
</fieldset>
<label class="survey-select-label">¿Qué detalle disfrutaste más?<select v-model="form.highlight" name="highlight" required>
<option value="">Elige una opción</option>
<option>La atención del equipo</option>
<option>El sabor de la comida</option>
<option>El ambiente de la casa</option>
<option>La celebración y los detalles</option>
</select>
</label>
<label class="survey-select-label">¿Nos recomendarías?<select v-model="form.recommend" name="recommend" required>
<option value="">Elige una opción</option>
<option>Sí, de una</option>
<option>Tal vez, con un ajuste</option>
<option>Aún no</option>
</select>
</label>
<label class="survey-select-label">¿Qué podríamos mejorar? (opcional)<textarea v-model="form.comment" name="comment" rows="3" maxlength="240" placeholder="¿Qué te gustaría que supiéramos?">
</textarea>
</label>
<button class="button button-gold" type="submit">Enviar mi opinión <span aria-hidden="true">↗</span>
</button>
<p class="survey-status" id="survey-status" role="status" aria-live="polite">{{ status || 'Tu respuesta se guarda en este dispositivo para esta demostración.' }}</p>
</form>
</dialog>
</template>
<style scoped>
.survey-slot { display: contents; }
.survey-invite { grid-template-columns: minmax(0, 640px); justify-content: center; }
</style>
