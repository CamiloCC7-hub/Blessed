<script setup>
import { computed } from 'vue'
import dishes from '../data/platos.json'
import { favorites, toggleFavorite } from '../store'
const props = defineProps({ id: String })
const dish = computed(() => dishes.find(item => item.id === props.id))
</script>
<template><section class="page"><RouterLink to="/carta">← Volver a la carta</RouterLink><article v-if="dish" class="detail"><img :src="dish.image" :alt="dish.alt" @error="event => { if (event.target.src !== dish.fallback) event.target.src = dish.fallback }"><div><p class="eyebrow">{{ dish.category }}</p><h1>{{ dish.name }}</h1><p>{{ dish.description }}</p><strong>{{ dish.price }} COP</strong><p><button class="pill" :aria-pressed="favorites.includes(id)" @click="toggleFavorite(id)">{{ favorites.includes(id) ? 'Quitar de mis antojos' : 'Guardar mi antojo' }}</button></p><a v-if="dish.credit" :href="dish.credit" target="_blank" rel="noopener">Fotografía de referencia ↗</a></div></article><h1 v-else>Plato no encontrado</h1></section></template>