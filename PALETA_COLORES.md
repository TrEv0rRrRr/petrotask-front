# Nueva Paleta de Colores - PetroTask

## Colores Principales

### Verde Petróleo (#008B64)
- **Uso**: Color principal, botones primarios, elementos de navegación
- **Significado**: Energía y vínculo con la industria petrolera, adaptabilidad y sostenibilidad
- **Variantes**:
  - Claro: #4CAF50
  - Oscuro: #006A4E

### Naranja (#ff5c11)
- **Uso**: Botones de acción (CTA), elementos dinámicos, alertas importantes
- **Significado**: Acción, movimiento, pro-actividad y eficiencia operativa
- **Variantes**:
  - Claro: #ff8a65
  - Oscuro: #e64a19

### Azul Marino (#14305b)
- **Uso**: Texto principal, elementos de navegación secundarios
- **Significado**: Seguridad, confianza y solidez corporativa
- **Variantes**:
  - Claro: #1e4a7c
  - Oscuro: #0d1f3a

## Colores de Estado

### Verde Mantis (#66BB6A)
- **Uso**: Estados positivos, tareas completadas, indicadores de éxito
- **Significado**: Energía, frescura y logro
- **Variantes**:
  - Claro: #98ee99
  - Oscuro: #338a3e

### Amarillo (#FFF176)
- **Uso**: Tareas importantes, advertencias, elementos prioritarios
- **Significado**: Importancia, advertencia, atención especial
- **Variantes**:
  - Claro: #fff59d
  - Oscuro: #f9a825

### Rojo (#FF7976)
- **Uso**: Estados urgentes, alertas críticas, errores
- **Significado**: Urgencia, peligro, acción inmediata
- **Variantes**:
  - Claro: #ffab91
  - Oscuro: #d32f2f

## Colores Neutros

### Blanco (#ffffff)
- **Uso**: Fondos principales, texto sobre colores oscuros
- **Significado**: Claridad, transparencia y simplicidad

### Gris Medio (#6b7280)
- **Uso**: Texto secundario, elementos de soporte
- **Significado**: Neutralidad y balance

### Gris Claro (#9ca3af)
- **Uso**: Fondos suaves, elementos de interfaz discretos
- **Significado**: Modernidad y limpieza visual

## Aplicación en la Interfaz

### Componentes Principales
- **Header/Navegación**: Azul Marino (#14305b)
- **Botones Primarios**: Verde Petróleo (#008B64)
- **Botones Secundarios**: Naranja (#ff5c11)
- **Enlaces**: Verde Petróleo (#008B64)
- **Texto Principal**: Azul Marino (#14305b)
- **Texto Secundario**: Gris Medio (#6b7280)

### Estados y Feedback
- **Éxito/Completado**: Verde Mantis (#66BB6A)
- **Advertencia/Importante**: Amarillo (#FFF176)
- **Error/Urgente**: Rojo (#FF7976)
- **Información**: Azul estándar (#2196f3)

### Fondos
- **Fondo Principal**: Blanco (#ffffff)
- **Fondos Secundarios**: Gris Claro (#9ca3af)
- **Superficies**: Gris Claro (#9ca3af)

## Gradientes

### Gradiente Principal
```css
background: linear-gradient(90deg, #008B64 0%, #ff5c11 100%);
```

### Gradiente de Acento
```css
background: linear-gradient(135deg, #66BB6A 0%, #ff5c11 100%);
```

## Modo Oscuro

En modo oscuro, los colores se adaptan manteniendo la jerarquía visual:
- **Fondo Principal**: #121212
- **Fondo Secundario**: #0d1f3a (Azul Marino muy oscuro)
- **Texto Principal**: Blanco (#ffffff)
- **Texto Secundario**: Gris Claro (#9ca3af)

## Implementación Técnica

Los colores están definidos en `src/styles/_variables.scss` y se aplican mediante:
- Variables CSS personalizadas
- Paletas de Material Design personalizadas
- Clases de utilidad para estados específicos

## Accesibilidad

Todos los colores han sido seleccionados para cumplir con los estándares de contraste WCAG 2.1:
- Contraste mínimo de 4.5:1 para texto normal
- Contraste mínimo de 3:1 para texto grande
- Diferenciación de color no es el único medio de transmitir información
