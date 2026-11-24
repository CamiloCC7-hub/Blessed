<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
</script>
<template><label>Buscar un plato<input type="search" placeholder="Ej. mote, ceviche…" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"></label></template>