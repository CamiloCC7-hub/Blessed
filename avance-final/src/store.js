import { ref, watch } from 'vue'

export function readLocal(key, initial) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    if (Array.isArray(initial)) return Array.isArray(value) ? value : initial
    return value && typeof value === 'object' && !Array.isArray(value) ? value : initial
  } catch { return initial }
}

export function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true }
  catch { return false }
}

export const favorites = ref(readLocal('cecilia-antojos-v1', []))
export function toggleFavorite(id) {
  favorites.value = favorites.value.includes(id)
    ? favorites.value.filter(item => item !== id)
    : [...favorites.value, id]
}
watch(favorites, value => writeLocal('cecilia-antojos-v1', value), { flush: 'sync' })
export const search = ref('')
export const category = ref('')
export const onlyFavorites = ref(false)
