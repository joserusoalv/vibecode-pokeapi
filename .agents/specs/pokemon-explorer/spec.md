# Specification: Pokemon Explorer

## Objective
Crear una aplicación web para explorar Pokémon, consumiendo la PokeAPI de forma óptima sin incurrir en problemas de peticiones paralelas en el listado (N+1). La interfaz debe ser dinámica, rica en estética (Tailwind CSS, dark mode, glassmorphism, gradientes, animaciones) y ofrecer una experiencia de usuario del más alto nivel.

## Pantalla Principal (Listado)
- **Listado (Tabla/Grid)**: Muestra el ID y el Nombre del Pokémon.
  - La PokeAPI devuelve la lista base con `{name, url}`. El ID se extraerá de la URL para evitar llamadas adicionales por cada elemento del listado.
- **Buscador (Filtro)**: Un campo de texto en la parte superior para filtrar por nombre de Pokémon.
  - Para implementar un buscador en tiempo real sin saturar la API, se descargará el índice base (solo `name` y `url`) una sola vez o se consultará por nombre exacto.
- **Paginación**: Controles intuitivos debajo de la tabla para navegar por los resultados.
- **Interacción**: Al hacer clic en un nombre de Pokémon, se navega a su Pantalla de Detalle.

## Pantalla de Detalle
- **Cabecera**: 
  - Nombre del Pokémon.
  - Tipo(s) de Pokémon.
  - Ícono del tipo: Se llamará al endpoint del tipo para obtener el ícono oficial (específicamente la imagen en `sprites -> generation-iii -> diamond-pearl -> name_icon`).
- **Sprites**: 
  - Se debe desplegar todos los sprites disponibles del Pokémon, presentados de forma visualmente atractiva.
- **Estadísticas**:
  - Stats generales: Peso, altura, experiencia base.
  - Stats de combate (Attack, Defense, etc.): Mostrando `base_stat` y `effort`, usando barras de progreso con diseño premium.
- **Audio (Cries)**:
  - Un componente de audio para reproducir el `cry` oficial del Pokémon, con un botón estilizado.
- **Ataques (Moves)**:
  - Lista de ataques del Pokémon.
  - Se hará una petición a `api/v2/move/{id}/` al interactuar o cargar el ataque para mostrar detalles adicionales: accuracy, power, pp, priority.

## Requisitos de UI / UX
- Estilizado riguroso de Tailwind con utilidades modernas.
- Uso de componentes independientes en Angular 21 (Standalone).
