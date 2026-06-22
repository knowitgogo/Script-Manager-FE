# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Chatbot embed script

Build the chatbot as an embeddable browser script:

```bash
npm run build
```

After the build, host `dist/chatbot.iife.js` from your website/CDN, then any other website can add this script tag to automatically show the chatbot:

```html
<script
  src="https://your-domain.com/chatbot.iife.js"
  data-api-url="https://your-backend.com/chat"
  crossorigin
></script>
```

If `data-api-url` is not provided, the chatbot uses:

```text
http://localhost:5000/chat
```

For local testing after `npm run build`, run:

```bash
npm run preview
```

Then include:

```html
<script
  src="http://localhost:4173/chatbot.iife.js"
  data-api-url="http://localhost:5000/chat"
></script>
```

The script automatically creates a `#chatbot-root` container in the page and mounts the chatbot there, so the host website does not need to add a root element manually.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
