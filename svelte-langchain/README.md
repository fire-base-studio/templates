# Svelte + LangChain Template

A Svelte app with LangChain and Google Gemini pre-installed.

<a href="https://idx.google.com/new?template=https://github.com/noshimorimoshi/svelte-sveltekit-langchain/tree/main/svelte-langchain">
  <img height="32" alt="Try in IDX" src="https://cdn.idx.dev/btn/try_dark_32.svg">
</a>

---

## How This Template Was Built

This template is a customized version of the standard `svelte-vite` template. Here's a summary of the key modifications:

*   **`dev.nix` (Template Logic):**
    *   An `npm-install` block was added to automatically install the following Node.js packages into the development environment:
        *   `langchain`
        *   `@langchain/google-genai`
        *   `@google/generative-ai`
        *   `dotenv`

*   **`idx-template.json` (Template Metadata):**
    *   `name` changed to `Svelte + LangChain`.
    *   `description` updated to reflect the new functionality.
    *   `icon` path changed from a URL to a local file (`icon.png`).
    *   Added `categories: ["Web app"]` for better discoverability.
    *   Re-instated the language selection parameter (`js`/`ts`), with `js` as the default.

*   **Added & Modified Files:**
    *   `icon.png`: A local copy of the Svelte logo was added.
    *   `.idx/airules.md`: This file was significantly modified, merging the standard Gemini API rules with Svelte-specific best practices to provide more accurate and context-aware AI assistance.
    *   `README.md`: This file was created from scratch.
