# CivilCost Website Guide

This project is a standalone Vite + React + TypeScript marketing website for CivilCost.

## Quick Start

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run a TypeScript check:

```bash
npm run typecheck
```

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Wouter
- shadcn-style UI components in `src/components/ui`

## Project Structure

```text
civilcost/
  public/                  Static assets like favicon and social image
  src/
    components/            Homepage sections and reusable UI
    components/ui/         Shared UI primitives
    hooks/                 Shared hooks
    lib/                   Small utilities
    pages/                 Route-level pages
    App.tsx                Router setup
    main.tsx               App bootstrap
    index.css              Global theme and styles
  components.json          shadcn-style component aliases/config
  index.html               HTML shell and font loading
  package.json             Scripts and dependencies
  tsconfig.json            TypeScript config
  vite.config.ts           Vite config
```

## Edit Guide

If you want to change the order of homepage sections:

- Edit `src/pages/Home.tsx`

If you want to add, remove, or reorder routes:

- Edit `src/App.tsx`
- Create route pages inside `src/pages/`

If you want to change the navbar:

- Edit `src/components/Navbar.tsx`

If you want to change the hero section:

- Edit `src/components/Hero.tsx`

If you want to change the "problem" section:

- Edit `src/components/Problem.tsx`

If you want to change the "how it works" section:

- Edit `src/components/Solution.tsx`

If you want to change the cost breakdown preview card:

- Edit `src/components/CostPreview.tsx`

If you want to change the features section:

- Edit `src/components/Features.tsx`

If you want to change pricing content or CTA:

- Edit `src/components/Pricing.tsx`

If you want to change testimonials:

- Edit `src/components/Testimonials.tsx`

If you want to change FAQs:

- Edit `src/components/FAQ.tsx`

If you want to change the final call-to-action section:

- Edit `src/components/CTA.tsx`

If you want to change footer links or copyright area:

- Edit `src/components/Footer.tsx`

If you want to change the 404 page:

- Edit `src/pages/not-found.tsx`

## Global Styling Guide

If you want to change colors, theme variables, font variables, border radius, or shared utility styles:

- Edit `src/index.css`

Important things inside `src/index.css`:

- `:root` contains the main color variables
- `@theme inline` maps theme variables into Tailwind-friendly tokens
- `.dark` contains dark theme variables if you later enable dark mode
- `@layer base` contains global base styles
- `@layer utilities` contains custom utility helpers

If you want to change the Google font import or page title:

- Edit `index.html`

## Shared UI Components

The folder `src/components/ui/` contains reusable UI building blocks.

Only edit these files if you want to change the behavior or styling everywhere they are used.

Most important shared files in this project:

- `src/components/ui/button.tsx` for global button styles
- `src/components/ui/accordion.tsx` for the FAQ accordion
- `src/components/ui/card.tsx` for shared card styling
- `src/components/ui/toast.tsx` and `src/components/ui/toaster.tsx` for toast UI
- `src/components/ui/tooltip.tsx` for tooltip behavior

Note:

- Many files in `src/components/ui/` are available but not currently used on the homepage.
- It is usually safer to edit the page section component first before changing shared UI primitives.

## Content Editing Tips

Most homepage sections keep their content directly inside arrays in the component file.

Examples:

- `Problem.tsx` has a `problems` array
- `Solution.tsx` has a `steps` array
- `Features.tsx` has a `features` array
- `Testimonials.tsx` has a `reviews` array
- `FAQ.tsx` has a `faqs` array

If you want to update text quickly, start in those arrays before changing layout markup.

## Images and Static Assets

If you want to change the favicon:

- Replace `public/favicon.svg`

If you want to change the social sharing image:

- Replace `public/opengraph.jpg`

If you add more static images:

- Put them in `public/` if they should be served directly by path
- Or import them into components if you want them bundled by Vite

## App Bootstrapping

If you want to change how the app starts:

- Edit `src/main.tsx`

If you want to change router providers or global wrappers:

- Edit `src/App.tsx`

Current global wrappers include:

- `QueryClientProvider`
- `TooltipProvider`
- `Toaster`
- `WouterRouter`

## Config Files

If you want to change npm scripts or dependency versions:

- Edit `package.json`

If you want to change dev server or build behavior:

- Edit `vite.config.ts`

If you want to change TypeScript settings or path aliases:

- Edit `tsconfig.json`

If you want to change shadcn-style aliases:

- Edit `components.json`

## Safe Workflow For Future Changes

1. Start the app with `npm run dev`
2. Edit the smallest relevant file first
3. If a style change should affect only one section, change that section component
4. If a style change should affect every similar element, update the shared UI component
5. Run `npm run typecheck`
6. Run `npm run build` before final deployment

## Common Requests and Where To Edit

Change site name:

- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `index.html`

Change pricing amount:

- `src/components/Hero.tsx`
- `src/components/Pricing.tsx`
- `src/components/CTA.tsx`
- `src/components/Testimonials.tsx` if testimonials mention price

Change section spacing or background colors:

- Edit the relevant file in `src/components/`

Change button shape or default button style site-wide:

- `src/components/ui/button.tsx`

Change FAQ questions:

- `src/components/FAQ.tsx`

Add a brand-new homepage section:

1. Create a new component in `src/components/`
2. Import it in `src/pages/Home.tsx`
3. Place it in the correct order inside `<main>`

Add a new page:

1. Create a file in `src/pages/`
2. Add a `<Route>` in `src/App.tsx`
3. Add navigation links if needed in `src/components/Navbar.tsx`

## Notes

- This project is currently a frontend-only website.
- The CTA buttons are presentational right now unless you wire them to a real upload, form, or checkout flow.
- There are many reusable UI files available from the initial scaffold, even if the homepage does not use all of them yet.
