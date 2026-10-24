# Cecilia Restaurante

Prototipo front end de Cecilia Restaurante, con estructura semántica, diseño responsive, carta interactiva y una estética de vidrio translúcido.

## Abrir

Abre index.html en un navegador. No requiere instalación ni compilación.

## Contenido

- Estructura HTML5 semántica, navegación accesible y metadatos para móviles y buscadores.
- Maquetación con CSS Grid y Flexbox, enfoque mobile first y tres rangos de pantalla.
- Estética premium de vidrio esmerilado, con transparencias cálidas, acentos dorados y el emblema original de Cecilia optimizado para web.
- Navegación de cristal fija al desplazarse, microbrillos en los botones y rótulos de sección sobre fondos dorados de alto contraste.
- Textos de bienvenida y atención con un tono cercano y juguetón.
- La carta muestra inicialmente las dos entradas solicitadas y un botón despliega 29 opciones adicionales, agrupadas en platos principales, menú infantil, postres y bebidas. Cada opción incluye precio, descripción e imagen ilustrativa, con zoom y lista visual de antojos.
- Relato de Cecilia, el origen del nombre, el recorrido familiar y el equipo.
- Curiosidades en formato de pistas sobre el mote, la gallina guisada y el bocachico cordobeses, además de respuestas interactivas sobre la historia de Cecilia.
- Las imágenes de los platos abren una vista ampliada al tocarlas o enfocarlas con teclado; las tarjetas de momentos tienen fotografía, vidrio translúcido y movimiento suave.
- La celebración de cumpleaños incluye luces, destellos y una ilustración animada de torta con velas. Se respeta la preferencia de movimiento reducido.
- Reserva y carta completa conectan con Menupp. También se incluyen accesos al formulario de opinión, ubicaciones y redes sociales, más un enlace telefónico directo.
- Las fotografías y tipografías se sirven desde fuentes externas; se requiere internet para cargarlas.

## Antes de publicar

Verifica con el restaurante sus datos, ubicación, carta, precios, disponibilidad y autorización de imágenes. La URL pública depende del repositorio elegido en GitHub.

## Publicar en GitHub

1. Crea un repositorio público vacío en GitHub.
2. Conecta el remoto con la URL que GitHub te proporcione.
3. Sube la rama principal con sus commits.
4. Para publicar el sitio, activa GitHub Pages para la rama principal y la carpeta raíz.

## Reto de historia

Al final de la página hay una evaluación opcional de tres preguntas. La persona puede rechazarla y seguir navegando; si acepta, el diálogo modal mantiene la página en pausa hasta mostrar el resultado. El premio visual es de 5% por un acierto, 10% por dos y 12% por tres. Se guarda una participación en la sesión de esa pestaña para evitar repeticiones casuales.

Esta es una demostración de interfaz: el almacenamiento del navegador se puede modificar y no protege contra trampas. El resultado no crea un cupón real; el descuento debe validarlo el equipo Cecilia. Para controlar intentos y redimir beneficios de forma segura se necesita un servicio del restaurante en el servidor.

## Criterios de la primera entrega

- Documento HTML en español con metadatos de codificación, viewport, descripción y título; hojas CSS y JavaScript externas.
- Estructura de contenido con encabezado, navegación, contenido principal, secciones, artículos, dirección y pie de página; fotografías con texto alternativo y carga diferida.
- Diseño responsive con CSS Grid y Flexbox, media queries para móvil, tablet y escritorio, y preferencia de movimiento reducido.
- Tipografías de Google Fonts e iconos de marca de Font Awesome se cargan desde CDN; el emblema local se entrega como WebP.
- Formulario de consulta con validación HTML nativa para nombre, correo, teléfono, fecha y número de personas. Al enviarlo, prepara un mensaje de WhatsApp para el restaurante; el usuario lo revisa y lo envía. No registra ni confirma reservas automáticamente.
- Evaluación opcional de tres preguntas con premios visuales escalonados. La puntuación y el bloqueo de repetición solo se guardan en la sesión del navegador: no sirven para validar un cupón real ni impedir manipulación.

## Publicación

El directorio del proyecto contiene index.html en la raíz, listo para GitHub Pages. Configura Pages en la rama principal y la carpeta raíz después de subir el repositorio.

## Alcance académico

El documento de propuesta plantea el diseño y prototipado en Penpot sin programación ni despliegue. Este repositorio implementa la interfaz en HTML, CSS y JavaScript para cubrir la rúbrica adicional de primera entrega compartida en la conversación. No incluye servidor ni base de datos: las reservas se gestionan en Menupp y las consultas del formulario se envían manualmente desde WhatsApp. Si el curso solicita también el prototipo en Penpot, este código no lo reemplaza.
