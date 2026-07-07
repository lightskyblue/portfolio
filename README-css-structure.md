# CSS / SCSS Structure Notes

This project now uses SCSS as the source structure and `css/main.css` as the compiled stylesheet used by the HTML files.

## Current HTML stylesheet reference

Both `index.html` and `ux-ui.html` should keep using:

```html
<link rel="stylesheet" href="./css/main.css" />
```

The browser does not read the SCSS files directly. The SCSS files are for development and organisation.

## Folder structure

```txt
scss/
├─ main.scss
├─ abstracts/
│  └─ _variables.scss
├─ base/
│  ├─ _reset.scss
│  └─ _base.scss
├─ layout/
│  └─ _header.scss
├─ components/
│  ├─ _contact-button.scss
│  └─ _page-transition.scss
└─ pages/
   ├─ _home.scss
   └─ _category.scss
```

## What goes where

### `abstracts/_variables.scss`
Global design tokens: colours, fonts, grid size, font sizes, transition timing.

### `base/_reset.scss`
Very basic browser reset, such as `box-sizing` and html defaults.

### `base/_base.scss`
Global base styles, including `body`, links, selection colour, and reduced-motion behaviour.

### `layout/_header.scss`
Shared page layout for the fixed header and logo.

### `components/_contact-button.scss`
Reusable contact button styles.

### `components/_page-transition.scss`
Reusable page transition block animation styles.

### `pages/_home.scss`
Only for `index.html`: the homepage free-positioned portfolio entries.

### `pages/_uxui.scss`
For category/project index pages such as `ux-ui.html`. It can also be reused later for `photography.html` and `graphic-design.html` if those pages use a similar title + list layout.

## Recommended Sass command

If Sass is installed, run this from the project root:

```bash
sass scss/main.scss css/main.css --watch
```

For a one-time compile:

```bash
sass scss/main.scss css/main.css
```

## Removed old files

The old root-level `main.css` and `index.css` files were removed because they were not being used by the HTML files and could cause confusion. The only CSS file that HTML should load is now:

```txt
css/main.css
```
