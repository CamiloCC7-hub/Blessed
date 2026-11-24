<script setup>
import logo from '../../../assets/cecilia-logo.webp'
</script>
<template>
  <header class="spa-nav">
    <RouterLink to="/" class="wordmark"><img :src="logo" alt="">Cecilia</RouterLink>
    <nav aria-label="Principal">
      <RouterLink to="/">Inicio</RouterLink><RouterLink to="/carta">La carta</RouterLink>
      <RouterLink to="/experiencia">La experiencia</RouterLink><RouterLink to="/reserva" class="reserve-link">Reservar mesa</RouterLink>
    </nav>
  </header>
</template>