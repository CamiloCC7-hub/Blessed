<script setup>
import { reactive, ref, watch } from 'vue'
import { readLocal, writeLocal } from '../store'
const draftKey = 'cecilia-reservation-draft-v1'
const requestsKey = 'cecilia-booking-requests-v1'
const defaults = { nombre: '', email: '', telefono: '', fecha: '', hora: '', personas: 2, mensaje: '' }
const form = reactive({ ...defaults, ...readLocal(draftKey, {}) })
const notice = ref('')
const link = ref('')
const times = ['12:00 p. m.', '1:30 p. m.', '4:00 p. m.', '6:30 p. m.', '8:00 p. m.']
function today() { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(new Date()) }
watch(form, () => {
  link.value = ''
  notice.value = writeLocal(draftKey, form) ? 'Borrador guardado en este navegador.' : 'El navegador no pudo guardar el borrador.'
}, { flush: 'sync' })
function clearDraft() { Object.assign(form, defaults); writeLocal(draftKey, {}); notice.value = 'Borrador borrado.' }
function prepare() {
  link.value = ''
  if (form.nombre.trim().length < 2 || form.fecha < today()) { notice.value = 'Revisa el nombre y la fecha.'; return }
  const now = Date.now()
  const list = readLocal(requestsKey, [])
  if (list.some(item => item?.date === form.fecha && Number(item.expiresAt) > now)) {
    notice.value = 'Ya preparaste una solicitud para este día en los últimos 15 minutos.'
    return
  }
  const entry = { name: form.nombre.trim(), email: form.email, phone: form.telefono, date: form.fecha, time: form.hora, guests: form.personas, createdAt: new Date(now).toISOString(), expiresAt: now + 900000 }
  const saved = writeLocal(requestsKey, [...list, entry])
  const message = ['Hola, Cecilia. Quiero consultar disponibilidad.', entry.name, entry.date + ' · ' + entry.time, entry.guests + ' personas', entry.phone, entry.email, form.mensaje.trim()].filter(Boolean).join('\n')
  link.value = 'https://web.whatsapp.com/send?phone=573017222769&text=' + encodeURIComponent(message)
  notice.value = saved ? 'Solicitud preparada. Envíala por WhatsApp para consultar disponibilidad.' : 'Solicitud preparada sin copia local. Puedes enviarla por WhatsApp.'
}
</script>
<template><section class="page narrow"><p class="eyebrow">Sahagún, Córdoba</p><h1>Reservar mesa</h1><p>Elige una fecha y una hora. El equipo de Cecilia confirmará la disponibilidad por WhatsApp.</p>
<form class="form-grid" @submit.prevent="prepare"><label>Nombre completo<input v-model="form.nombre" autocomplete="name" minlength="2" maxlength="60" required></label><label>Correo electrónico<input v-model.trim="form.email" type="email" autocomplete="email" required></label>
<label>Teléfono<input v-model.trim="form.telefono" type="tel" autocomplete="tel" inputmode="numeric" pattern="[0-9]{10}" placeholder="10 dígitos" maxlength="10" required></label><label>Personas<input v-model.number="form.personas" type="number" min="1" max="20" required></label>
<label>Fecha<input v-model="form.fecha" type="date" :min="today()" required></label><label>Hora<select v-model="form.hora" required><option disabled value="">Selecciona una hora</option><option v-for="time in times" :key="time">{{ time }}</option></select></label><label class="wide">Ocasión o detalle (opcional)<textarea v-model="form.mensaje" maxlength="300" rows="3"></textarea></label>
<div class="wide actions"><button class="pill" :disabled="!!link">Preparar solicitud</button><button type="button" class="secondary" @click="clearDraft">Borrar borrador</button></div></form><p role="status">{{ notice }}</p><a v-if="link" class="pill" :href="link" target="_blank" rel="noopener">Revisar en WhatsApp ↗</a></section></template>