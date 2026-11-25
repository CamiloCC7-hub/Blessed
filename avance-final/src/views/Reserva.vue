<script setup>
import { computed, reactive, ref, watch, onUnmounted } from 'vue'
import Survey from '../components/Survey.vue'
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

const dialog = ref(null)
const month = ref(new Date(today() + 'T12:00:00Z'))
const clock = ref(Date.now())
let timer
onUnmounted(() => clearInterval(timer))
const heldDates = computed(() => {
  const now = clock.value
  return new Set(readLocal(requestsKey, []).filter(item => Number(item?.expiresAt) > now).map(item => item.date))
})
function openCalendar() {
  clock.value = Date.now()
  const date = form.fecha >= today() ? form.fecha : today()
  month.value = new Date(date + 'T12:00:00Z')
  if (form.fecha && (form.fecha < today() || heldDates.value.has(form.fecha))) {
    form.fecha = ''
    form.hora = ''
  }
  dialog.value.showModal()
  clearInterval(timer)
  timer = setInterval(() => { clock.value = Date.now() }, 1000)
}
const monthFormat = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const monthKey = computed(() => month.value.toISOString().slice(0, 7))
const first = computed(() => new Date(monthKey.value + '-01T12:00:00Z'))
const blanks = computed(() => (first.value.getUTCDay() + 6) % 7)
const days = computed(() => new Date(Date.UTC(first.value.getUTCFullYear(), first.value.getUTCMonth() + 1, 0)).getUTCDate())
function moveMonth(by) {
  month.value = new Date(Date.UTC(first.value.getUTCFullYear(), first.value.getUTCMonth() + by, 1, 12))
}
function dayKey(day) { return monthKey.value + '-' + String(day).padStart(2, '0') }
function selectDay(day) { form.fecha = dayKey(day); form.hora = '' }
function prepareInquiry() {
  if (form.nombre.trim().length < 2 || form.fecha < today()) {
    notice.value = 'Revisa el nombre y la fecha.'
    return
  }
  const message = ['Hola, Cecilia. Quisiera consultar una reserva.', form.nombre.trim(), form.email, form.telefono, form.fecha, form.personas + ' personas', form.mensaje.trim()].filter(Boolean).join('\n')
  link.value = 'https://web.whatsapp.com/send?phone=573017222769&text=' + encodeURIComponent(message)
  notice.value = 'Mensaje listo para revisar.'
}
function stopTimer() { clearInterval(timer) }
</script>
<template>
<section class="reservation" id="reserva" aria-labelledby="reservation-title">
<div class="reservation-copy">
<p class="eyebrow">Tu próxima historia empieza aquí</p>
<h2 id="reservation-title">Guardamos un<br>lugar para <em>ti.</em>
</h2>
<p>Tú eliges el día; nosotros vamos preparando la mesa. Haz tu reserva en el sistema de Cecilia y ven a celebrar sin afán.</p>
<button class="button button-gold surprise-button" @click="openCalendar" type="button">Reservar mesa <span aria-hidden="true">↗</span>
</button>
<details class="inquiry-details">
<summary>¿Prefieres planearlo por WhatsApp?</summary>
<form class="inquiry-form" id="inquiry-form" @submit.prevent="prepareInquiry">
<p class="inquiry-intro">Déjanos lo esencial y te dejamos el mensaje listo para revisar y enviar. La reserva se confirma en el sistema de Cecilia.</p>
<fieldset>
<legend>Cuéntanos cómo te contactamos</legend>
<div class="inquiry-grid">
<label>Nombre completo<input name="nombre" v-model="form.nombre" type="text" autocomplete="name" minlength="2" maxlength="60" pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,60}" placeholder="Tu nombre" required>
</label>
<label>Correo electrónico<input name="email" v-model="form.email" type="email" autocomplete="email" maxlength="100" placeholder="tu@correo.com" required>
</label>
<label>Teléfono<input name="telefono" v-model="form.telefono" type="tel" autocomplete="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10 dígitos, sin espacios" required>
</label>
<label>Fecha que tienes en mente<input name="fecha" v-model="form.fecha" type="date" :min="today()" required>
</label>
<label>Personas<input name="personas" v-model.number="form.personas" type="number" min="1" max="20" value="2" required>
</label>
<label class="inquiry-message">¿Qué ocasión celebramos?<textarea name="mensaje" v-model="form.mensaje" rows="3" maxlength="300" placeholder="Un cumpleaños, una cena especial…">
</textarea>
</label>
</div>
</fieldset>
<button class="button button-gold" type="submit">Preparar mensaje en WhatsApp <span aria-hidden="true">↗</span>
</button>
<p class="inquiry-status" id="inquiry-status" role="status" aria-live="polite">{{ notice || 'El equipo de Cecilia confirmará la disponibilidad por WhatsApp.' }}</p>
<a v-if="link" class="button button-gold" :href="link" target="_blank" rel="noopener">Revisar en WhatsApp ↗</a>
<button type="button" class="text-link" @click="clearDraft">Borrar borrador</button>
</form>
</details>
</div>
<Survey embedded/>
</section>
<dialog class="booking-dialog" ref="dialog" @click.self="dialog.close()" @close="stopTimer" aria-labelledby="booking-title">
<div class="booking-shell">
<button class="dialog-close" type="button" @click="dialog.close()" aria-label="Cerrar reserva">×</button>
<p class="eyebrow">TU MESA, A TU RITMO</p>
<h2 id="booking-title">Elige el día que te haga ilusión.</h2>
<p class="booking-disclaimer">Las fechas tachadas indican espacios apartados por un breve lapso. La disponibilidad cambia durante el día y una fecha puede liberarse nuevamente.</p>
<div class="calendar-toolbar">
<button type="button" :disabled="monthKey <= today().slice(0, 7)" @click="moveMonth(-1)" aria-label="Mes anterior">‹</button>
<h3 id="calendar-month" aria-live="polite">{{ monthFormat.format(month) }}</h3>
<button type="button" @click="moveMonth(1)" aria-label="Mes siguiente">›</button>
</div>
<div class="calendar-weekdays" aria-hidden="true">
<span>Lu</span>
<span>Ma</span>
<span>Mi</span>
<span>Ju</span>
<span>Vi</span>
<span>Sá</span>
<span>Do</span>
</div>
<div class="calendar-grid" id="calendar-grid" role="group" aria-label="Selecciona una fecha">
  <span v-for="i in blanks" :key="'blank-' + i" class="calendar-blank">
</span>
  <button v-for="day in days" :key="dayKey(day)" type="button" class="calendar-day"
    :class="{ 'is-booked': heldDates.has(dayKey(day)), 'is-selected': form.fecha === dayKey(day) }"
    :aria-pressed="form.fecha === dayKey(day)" :aria-label="dayKey(day)" :disabled="dayKey(day) < today() || heldDates.has(dayKey(day))"
    @click="selectDay(day)">{{ day }}</button>
</div>
<p class="calendar-status" id="calendar-status" role="status" aria-live="polite">{{ form.fecha ? 'Fecha elegida: ' + form.fecha : 'Selecciona una fecha disponible.' }}</p>
<section class="booking-step" id="booking-step" v-if="form.fecha >= today()">
<h3 id="chosen-date-label">Elige una hora</h3>
<div class="time-options" id="time-options">
<button v-for="time in times" :key="time" type="button" class="time-option" :class="{ 'is-selected': form.hora === time }" :aria-pressed="form.hora === time" @click="form.hora = time">{{ time }}</button>
</div>
<form id="booking-form" class="booking-form" v-if="form.hora && !link" @submit.prevent="prepare">
<div class="inquiry-grid">
<label>Nombre completo<input name="name" v-model="form.nombre" autocomplete="name" minlength="2" maxlength="60" required>
</label>
<label>Correo electrónico<input name="email" v-model="form.email" type="email" autocomplete="email" required>
</label>
<label>WhatsApp / teléfono<input name="phone" v-model="form.telefono" type="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10 dígitos" autocomplete="tel" required>
</label>
<label>Personas<input name="guests" v-model.number="form.personas" type="number" min="1" max="20" value="2" required>
</label>
</div>
<button class="button button-gold" type="submit">Preparar mi solicitud <span aria-hidden="true">✦</span>
</button>
</form>
<section id="booking-confirmation" class="booking-confirmation" aria-live="polite" v-if="link || notice">
<p>{{ notice }}</p>
<a v-if="link" class="button button-gold" :href="link" target="_blank" rel="noopener">Revisar en WhatsApp ↗</a>
</section>
</section>
</div>
</dialog>
</template>
<style scoped>
.calendar-day:disabled:not(.is-booked) { opacity: .4; cursor: default; }
</style>
