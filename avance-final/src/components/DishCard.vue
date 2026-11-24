<script setup>
defineProps({ dish: { type: Object, required: true }, saved: Boolean })
defineEmits(['toggle'])
function useFallback(event, dish) {
  if (dish.fallback && event.target.src !== dish.fallback) event.target.src = dish.fallback
}
</script>
<template>
  <article class="menu-card">
    <RouterLink :to="'/carta/' + dish.id"><img :src="dish.image" :alt="dish.alt" loading="lazy" @error="useFallback($event, dish)"></RouterLink>
    <div><small>{{ dish.category }}</small><h2><RouterLink :to="'/carta/' + dish.id">{{ dish.name }}</RouterLink></h2>
    <p>{{ dish.price }} COP</p><button class="pill" :aria-pressed="saved" @click="$emit('toggle', dish.id)">{{ saved ? '♥ Guardado' : '♡ Guardar antojo' }}</button></div>
  </article>
</template>