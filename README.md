# Nova — Agencia de Marketing

Sitio web institucional para Nova, agencia de marketing digital. Landing page estática (HTML/CSS/JS puro, sin dependencias ni build) con secciones de servicios, sobre nosotros, proceso, casos de éxito, testimonios y contacto.

## Estructura

```
index.html      # Contenido y estructura de la página
css/style.css   # Estilos (diseño claro y minimalista, responsive)
js/script.js    # Menú móvil, scroll del header, validación del formulario
assets/         # Favicon e imágenes
```

## Uso local

No requiere instalación. Abrí `index.html` en el navegador, o servilo con cualquier servidor estático, por ejemplo:

```bash
python3 -m http.server 8000
```

y visitá `http://localhost:8000`.

## Despliegue

Al ser un sitio 100% estático, se puede publicar directamente en cualquier hosting estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, etc.) subiendo la carpeta tal cual.

## Personalización

- **Contenido**: editar directamente `index.html` (textos, servicios, casos, testimonios, datos de contacto).
- **Colores y tipografía**: variables definidas al inicio de `css/style.css` (`:root`).
- **Formulario de contacto**: `js/script.js` valida los campos en el cliente pero no envía datos a ningún servidor todavía; hay que conectarlo a un backend o servicio de formularios (ej. Formspree, un endpoint propio, etc.) para recibir los mensajes.
