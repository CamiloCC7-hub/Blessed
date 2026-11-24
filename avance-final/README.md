# Cecilia Restaurante · Entrega final

[Aplicación en producción](https://camilocc7-hub.github.io/Blessed/entrega-final/) · [Repositorio](https://github.com/CamiloCC7-hub/Blessed)

SPA académica para explorar la carta de Cecilia Restaurante en Sahagún, guardar antojos y preparar una solicitud de mesa. Conserva los 31 platos, precios, fotografías de referencia, relatos y curiosidades del avance 2. El equipo del restaurante confirma las reservas por WhatsApp. Las opiniones, solicitudes y borradores se almacenan únicamente en el navegador.

## Ejecutar en local

Desde la raíz del repositorio, con Node.js 22 y npm instalados:

```sh
cd avance-final
npm install
npm run dev
```

Abrir la dirección que imprime Vite. Para revisar la compilación optimizada:

```sh
npm run build
npm run preview
```

## Arquitectura

| Ruta | Responsabilidad |
| --- | --- |
| `src/main.js` | Crea la aplicación y configura Vue Router con historial hash para abrir y recargar enlaces directos en GitHub Pages. |
| `src/views/` | Inicio, Carta, Detalle, Reserva y Experiencia. |
| `src/components/` | Navegación, tarjetas, búsqueda, diálogo de curiosidades, encuesta y reto. |
| `src/store.js` | Comparte antojos y filtros entre vistas. Guarda los antojos en localStorage. |
| `src/data/` | Carta migrada y contenido de la historia del restaurante. |
| `public/data.json` | Curiosidades que DailyFact carga con Fetch. |
| `../assets/` | Logotipo compartido con las entregas anteriores. |
| `dist/` | Resultado generado por Vite. |

## Publicación continua

El flujo `.github/workflows/cecilia-final.yml` instala las dependencias y ejecuta el build al actualizar la SPA en main. Publica los archivos compilados en `entrega-final/` de la rama que ya sirve GitHub Pages. Los avances anteriores conservan sus direcciones.

## Sustentación individual

1. Abre **La carta**, escribe «mote» y muestra `Carta.vue`. La propiedad computada filtra el catálogo. `SearchField.vue` recibe el texto por una prop y emite `update:modelValue` cuando se escribe.
2. Guarda un plato y abre su detalle. `DishCard.vue` recibe `dish` y `saved` y emite `toggle`. La vista actualiza el estado en `store.js`. Quita el antojo desde el detalle y regresa a la carta para mostrar el cambio.
3. Copia la URL del plato y recarga la página. Explica cómo el parámetro de ruta identifica el plato y cómo RouterLink cambia la vista sin descargar otro documento HTML.
4. En **Reservar mesa**, intenta continuar con el formulario vacío. Completa los campos con datos ficticios, cambia de vista y regresa. Muestra `v-model`, las restricciones y la recuperación del borrador. Prepara el enlace para revisar el mensaje.
5. En **La experiencia**, muestra la curiosidad cargada con Fetch, responde el reto y guarda una encuesta de prueba. Explica la diferencia entre el almacenamiento local y por pestaña.
6. Abre **Actions** en GitHub. Enseña el registro del build y termina abriendo el enlace de producción.
