# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static landing page for Nova, a digital marketing agency. Plain HTML/CSS/JS — no build tool, no package manager, no dependencies, no tests.

## Commands

There is no build/lint/test tooling. To preview the site locally:

```bash
python3 -m http.server 8000
```
then open `http://localhost:8000`.

## Architecture

- `index.html` — single-page site; all sections (services, about, process, case studies, testimonials, contact) live in this one file.
- `css/style.css` — all styling. Design tokens (colors, fonts, radii, shadows) are defined as CSS custom properties in `:root` at the top of the file; change those instead of hardcoding values elsewhere.
- `js/script.js` — vanilla JS, no framework. `DOMContentLoaded` wires up four independent features: footer year, mobile nav toggle, header shadow-on-scroll, and contact form validation. Each is a standalone `init*()` function guarded by null-checks on its DOM elements, so `index.html`'s element IDs (`navToggle`, `nav`, `header`, `contactForm`, `formStatus`, etc.) are the contract between markup and script.
- `assets/` — favicon and images.

The contact form validates client-side only (name/email/message) and does not submit anywhere — it simulates success and resets. Wiring it to a real backend (e.g. Formspree or a custom endpoint) requires changes to `initContactForm()` in `js/script.js`.

Deployment is just serving the repo root as static files (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, etc.) — no build step.
