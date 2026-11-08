# English Carrer

Simulador de carrera individual en la Premier League. El jugador inicia a los 16 años, escoge su club y toma decisiones que afectan su temporada y su trayectoria.

## Cómo abrirlo

Abre `index.html` en un navegador. Es un archivo autocontenido; no requiere instalación ni compilación.

## Tecnologías y restricciones

- HTML semántico, CSS y JavaScript Vanilla.
- La interfaz se construye con elementos del DOM.
- No usa canvas, librerías externas, almacenamiento del navegador ni llamadas de red.
- Las decisiones y los eventos se resuelven en el navegador.

## Conceptos de JavaScript

- **Variables y tipos primitivos:** estado de carrera, edad, posición, etapa, puntaje y datos estadísticos.
- **Control y condiciones:** resultados de temporada, eventos aleatorios, ofertas y premios.
- **Arreglos:** clubes, posiciones, eventos, elecciones, historial y premios.
- **Objetos literales:** jugador, clubes, eventos, estadísticas y premios.
- **Funciones:** inicialización, selección de club, simulación, decisiones, premios y renderizado.
- **Eventos del navegador:** interacciones de botones, campos de identidad y fallos de imagen.
- **Manipulación del DOM:** creación y actualización de elementos HTML con `createElement`, `textContent` y `appendChild`.

## Evento obligatorio de ausencia

El arreglo de eventos contiene un evento especial que se aplica automáticamente durante la carrera. La temporada queda sin partidos, estadísticas ni progreso de GRL; el siguiente año de carrera también se pierde y el fondo queda rojo durante la ronda. La interfaz explica la ausencia como una lesión, un conflicto con la directiva o una decisión del entrenador.

## Estadísticas por posición

Delanteros se enfocan en goles; mediocampistas en asistencias y pases clave; defensas y porteros en vallas invictas. El historial siempre muestra goles y asistencias, incluso cuando el resultado es cero.
