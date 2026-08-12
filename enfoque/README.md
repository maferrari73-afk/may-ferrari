# Enfoque

App web instalable (PWA) para trackear tiempo de foco vs. tiempo de scroll. Pensada para uso personal en el celular.

## Qué hace

- **Scroll**: botón para marcar cuándo empezás y termine de scrollear (Instagram, TikTok, etc. — el propio iPhone no permite que una web lea esto automáticamente, así que se registra a mano).
- **Enfoque**: botones de Estudiar / Leer / Aprender / Proyecto. Tocás uno para arrancar el cronómetro, tocás "Finalizar" (o el mismo botón) para cerrarlo.
- Solo corre una sesión a la vez: si arrancás otra actividad mientras hay una activa, la anterior se cierra sola.
- **Gráfico semanal**: barras apiladas por día (lunes a domingo) con el tiempo de cada categoría de enfoque.
- **Historial de hoy**: lista de las sesiones del día, con opción de borrar una si te equivocaste.
- Frases siempre visibles: cuánto ganaste scrolleando esta semana, y "¿Cómo te ves a las 40?".
- Todo se guarda en el propio celular (`localStorage`), no hay backend ni se manda información a ningún lado.

## Instalar en el iPhone

1. Subí esta carpeta a un hosting con HTTPS (GitHub Pages, Netlify, Vercel, etc. — ver instrucciones abajo).
2. Abrí la URL en Safari (tiene que ser Safari, no Chrome, para que funcione "Agregar a inicio").
3. Tocá el botón de compartir (el cuadrado con la flecha hacia arriba) → **"Agregar a pantalla de inicio"**.
4. Listo: queda un ícono como cualquier otra app, abre a pantalla completa y funciona sin conexión (service worker).

## Publicar con GitHub Pages (gratis)

En la configuración del repo → **Pages** → Source: rama `main` (o la que corresponda), carpeta `/enfoque` (o mover estos archivos a la raíz de un repo dedicado). GitHub te da una URL `https://usuario.github.io/...` con HTTPS, necesaria para que el modo offline funcione.

## Desarrollo local

Sin build ni dependencias. Para probar:

```bash
cd enfoque
python3 -m http.server 8000
```

y abrí `http://localhost:8000`.

## Estructura

```
index.html      # Estructura de la app
css/style.css   # Estilos (tema oscuro, mobile-first)
js/app.js       # Lógica: cronómetro, guardado, gráfico, historial
manifest.json   # Metadata de la PWA
sw.js           # Service worker (cache offline)
icons/          # Íconos de la app
```
