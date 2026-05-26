# Sindarin Translator

A web app for translating between English and Sindarin — the Elvish language from Tolkien's Middle-earth. Built with React 19 and Vite.

## Features

- **Bidirectional translation** — switch between English → Sindarin and Sindarin → English with a single click
- **Multi-word phrase matching** — prioritises longer dictionary entries before falling back to individual word lookups
- **Highlighted output** — translated tokens are visually distinguished from untranslated (unknown) words
- **Copy to clipboard** — one-click copy of the full translation output
- **Keyboard shortcut** — press `Enter` to trigger translation

## Tech Stack

| Layer   | Technology                  |
| ------- | --------------------------- |
| UI      | React 19, Tailwind CSS v4   |
| Build   | Vite                        |
| Icons   | Font Awesome                |
| Testing | Jest, React Testing Library |
| Linting | ESLint                      |

## Getting Started

### Prerequisites

- Node.js ≥ 18

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Testing

```bash
npm test
```

Tests are located in `src/__tests__/` and cover the translation logic (`data.test.js`) and the main component (`ElvishTranslator.test.jsx`).

## Project Structure

```
src/
├── components/
│   └── ElvishTranslator.jsx   # Main translator component
├── data.js                    # English ↔ Sindarin dictionaries
├── App.jsx
└── main.jsx
```

## How It Works

The translator flattens the dictionary on load, splitting comma-separated synonym keys into individual entries. When translating, it greedily matches the longest possible phrase first, then falls back to single words. Unrecognised words are passed through unchanged and visually flagged in the output.

## License

MIT
