<script setup>
import { computed } from 'vue'
import dishes from '../data/platos.json'
import { favorites, toggleFavorite, search, category, onlyFavorites } from '../store'
import DishCard from '../components/DishCard.vue'
import SearchField from '../components/SearchField.vue'
const categories = [...new Set(dishes.map(dish => dish.category))]
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const filtered = computed(() => dishes.filter(dish =>
  normalize(dish.name).includes(normalize(search.value)) &&
  (!category.value || dish.category === category.value) &&
  (!onlyFavorites.value || favorites.value.includes(dish.id))))
</script>
<template><section class="page"><p class="eyebrow">Cecilia Restaurante</p><h1>La carta</h1>
<a href="https://menupp.co/ceciliarestaurante/venue/d3831670-eb28-410c-9e7b-83dc55ec7854/menu/rrUliMuhyq8jz6vL0diX" target="_blank" rel="noopener">Consultar la carta del restaurante ↗</a>
<div class="filters"><SearchField v-model="search"/><label>Categoría<select v-model="category"><option value="">Todas las categorías</option><option v-for="item in categories" :key="item">{{ item }}</option></select></label><label class="check"><input type="checkbox" v-model="onlyFavorites"> Mis antojos ({{ favorites.length }})</label></div>
<div v-if="filtered.length" class="menu-grid"><DishCard v-for="dish in filtered" :key="dish.id" :dish="dish" :saved="favorites.includes(dish.id)" @toggle="toggleFavorite"/></div>
<p v-else role="status">No hay platos que coincidan con estos filtros.</p></section></template>