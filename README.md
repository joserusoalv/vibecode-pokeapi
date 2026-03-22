# VibeCode PokéAPI

Bienvenido a **VibeCode PokéAPI**, un proyecto de referencia construido con las últimas características de **Angular 21** enfocado en arquitectura empresarial, rendimiento extremo y las mejores prácticas de ingeniería de software moderno.

## 🚀 ¿Qué contiene el proyecto?

Este no es un simple Pokedex. Es una aplicación robusta diseñada bajo estándares estrictos para demostrar cómo construir software escalable en el ecosistema actual de Angular:

### 🛠️ Stack Tecnológico Base
- **Framework:** Angular 21+ (Standalone components, nueva sintaxis de control de flujo).
- **Lenguaje:** TypeScript 5.9+ con strict mode activado.
- **Estilos:** Tailwind CSS v4 para diseño fluido y utilitario.
- **Testing:** Vitest + Testing Library for Angular (Enfoque en Pruebas de Integración).

### ✨ Características Clave (Features)
- **Poke-Catálogo:** Listado inteligente con capacidades de búsqueda y filtrado.
- **Detalle de Pokémon Exhaustivo:** Vistas con estadísticas en radar (Radar Stats), información de tipos, y evoluciones.
- **Sistema de Matchups de Tipos:** Cálculo dinámico de relaciones de daño (debilidades y resistencias) para Pokémon de tipo dual/simple.
- **Navegación Accesible y por Teclado:** Control total mediante atajos de teclado (usando decoradores `@HostListener` modernos y el flujo de navegación) cumpliendo estrictamente con directrices **WCAG 2.1 AA** (Web Accessibility).
- **Soporte de Tema Dinámico:** Modo Oscuro/Claro nativo mediante `ThemeService` y variantes de Tailwind CSS.
- **Gestión de Estado Reactiva:** Uso total de **Angular Signals** (Señales atómicas en lugar de objetos de estado, uso de `computed()`, y `linkedSignal` para resetear estados locales de forma predecible).
- **Formularios Modernos:** Implementación del API experimental de **Signal Forms** garantizando contratos tipados (`hard-typed contracts`).

### 🏛️ Arquitectura y Metodología
- **Domain-Driven Design (DDD):** Arquitectura empresarial estructurada con capas bien definidas (Dominio, Aplicación, Infraestructura, Presentación).
- **Spec-Driven Development (SDD):** Desarrollo guiado por especificaciones de comportamiento antes de la implementación técnica.
- **Agentes Integrados (IA):** Configuración lista para desarrollo asistido mediante arquitectos, especialistas UI y testers, con flujos de trabajo predefinidos.

---

## 👤 Perfil Aconsejado (Target Audience)

Este proyecto está orientado a:
- **Desarrolladores Frontend Mid-Senior y Lead Angular Engineers** que buscan mantenerse a la vanguardia.
- Ingenieros que desean migrar de arquitecturas RxJS/NgRx tradicionales a los nuevos ecosistemas basados en **Signals**.
- Equipos que quieren estructurar proyectos bajo **Domain-Driven Design (DDD)** y **Spec-Driven Development**.
- Desarrolladores interesados en dominar la **Accesibilidad Web** y los **Tests de Integración Modernos (Vitest)** en Angular.

---

## 🧗 Dificultad del Proyecto

🔴 **Nivel: Avanzado / Experto (Senior Level)**

No es un proyecto introductorio. Comprender y extender la base de código requiere:
- Conocimientos sólidos en patrones arquitectónicos (DDD, abstracción de capas).
- Dominio absoluto del reactivity model de Angular (Signals, Computed, Effects).
- Familiaridad con TDD/SDD (Testing-driven y Spec-driven development).
- Entender el funcionamiento a bajo nivel de inyección de dependencias (DI) y standalone patterns.

---

## ⏱️ Tiempo Estimado de Realización

Si el objetivo es construir este proyecto desde cero siguiendo todos los lineamientos estrictos, flujos CI, testing completo y componentes a medida:

- **Desarrollo Base y Setup Arquitectónico:** 10 - 15 horas.
- **Implementación de Lógica Core (Signals, APIs, Modelos):** 15 - 20 horas.
- **UI/UX, Tailwind CSS, Tema Oscuro y Radar Stats:** 15 - 20 horas.
- **Accesibilidad, Testing de Integración y Refinamiento:** 10 - 15 horas.
- **Total Estimado (Desde Cero):** **~50 a 70 horas** de trabajo enfocado.

Si el objetivo es **estudiarlo, comprenderlo y aportar pequeños features** (ej. agregar un componente extra de estadísticas): Tomará alrededor de **1 a 2 semanas** de estudio continuo y exploración del código para asimilar la estructura y lineamientos.
