# Book App

A Vue 3 + Vite application for searching books using the [Google Books API](https://developers.google.com/books/docs/v1/getting_started). Features include search filters, card/list view toggling, pagination, and book details.

## Features

- Search books by name, author, category, and publisher
- Card and list view modes
- Pagination
- Book details view
- Responsive UI using PrimeVue and TailwindCSS

## Project Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── router/
│   ├── views/
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v20.19.0 or >=22.12.0
- npm

### Run in local environment

```sh
> git clone https://github.com/johanhezri/book-app.git
> npm i
> npm run dev
```

Go to http://localhost:5173/home

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Configuration

- See [Vite Configuration Reference](https://vite.dev/config/)
- See [PrimeVue Documentation](https://www.primefaces.org/primevue/)
- See [TailwindCSS Documentation](https://tailwindcss.com/)

## Overview of Approach

- The main search interface is built using PrimeVue components for a polished UI.
- Search filters (book name, author, category, publisher) are provided as input fields.
- Search queries are debounced for performance and sent to the Google Books API.
- Results are displayed in both card and list views, showing title, authors, publisher, and cover image.
- Clicking a book navigates to a details page with more information.
- Responsive design is achieved using TailwindCSS and PrimeVue's grid system.
- Pagination is implemented for efficient browsing of large result sets.
- Code is organized, commented, and versioned with Git.

## Assumptions Made

- The Google Books API endpoint is injected via Vue's.
- Not all books have complete metadata. Fallbacks are shown for missing authors, publishers, or images.
- The maximum number of each results shown is capped (e.g., 200) for performance.
- The app does not require authentication.

## TODOs

- Navigate to previous/next books in book detail page.
- Use component files for components such as book cards and search fields for reusability.