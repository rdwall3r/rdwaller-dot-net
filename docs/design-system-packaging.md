# Packaging the design system

Goal: move the shared CSS and JS out of `rdwaller-dot-net` into one repo so that `rdwaller-dot-net`
and `hearing-solutions` both use it. Then a change made once shows up on both sites, and the two
stop drifting apart.

Keep it simple. Plain CSS files, plain JS files, installed from GitHub. No build step, no bundler,
no Eleventy plugin (yet).

---

## 0. Fix loose ends first

Do these in `rdwaller-dot-net` before extracting anything, so you don't copy bugs into the shared
package.

- [x] **`--weight-regular` is undefined.** `css/style.css:185` uses `var(--weight-regular)`, but
      only `--weight-light/medium/semibold/bold` are defined (lines 54–57), so body text falls back
      to the browser default weight. Add `--weight-regular: 400;` (or point line 185 at whatever
      weight you meant).
- [x] **Stale comments.** Update the font-size comments so they match the real scale.
- [x] **Leftovers.** Remove the unused `--color-black`. Give `.table-not-applicable` a dark-mode
      background.
- [x] **Bring `hearing-solutions` up to date.** Done 2026-11-08: `100vh` → `100svh` on `body`, and
      the `forced-colors` icon rule added (backed with gray-smoke).

---

## 1. Decide what's shared and what stays per site

| Shared (goes in the design system)             | Per site (stays in each repo)                  |
| ---------------------------------------------- | ---------------------------------------------- |
| Palette tokens (every named color)             | Which palette colors map to `--bg-color`, etc. |
| Type scale, font weights, font family          | Logo, favicon, profile photos                  |
| Reset, layout, nav, footer, tables             | Page content and layouts (`base.njk`) for now  |
| Theme toggle styles + `js/theme.js`            | Site-only components                           |
| `js/nav.js`                                    |                                                |
| `.visually-hidden`, `svh` layout, icon filters |                                                |
| `forced-colors` rules                          |                                                |
| Shared icons (heroicons, GitHub, LinkedIn)     |                                                |

Rule of thumb: if it's the same in both repos, or _should_ be, share it. If it exists to make the
sites look different, keep it per site.

---

## 2. Create the repo

```sh
cd ~/Documents/GitHub
mkdir design-system && cd design-system
git init
npm init -y
```

Target layout:

```
design-system/
├── package.json
├── README.md
├── CHANGELOG.md
├── css/
│   ├── tokens.css     # palette, type scale, weights, font family
│   └── base.css       # reset, layout, nav, footer, toggle, tables, utilities
├── js/
│   ├── theme.js
│   └── nav.js
└── icons/
    └── ...svg
```

---

## 3. Split `style.css` into three files

Working from `rdwaller-dot-net/css/style.css`:

1. **`design-system/css/tokens.css`**: only `:root { ... }` custom properties that are raw values
   (`--color-vellum`, `--color-flint`, `--font-size-*`, `--weight-*`, `--font-family`). No semantic
   names here.
2. **`design-system/css/base.css`**: every rule that uses only _semantic_ variables
   (`var(--bg-color)`, `var(--link-color)`, ...) and never a raw palette color directly. If a rule
   hard-codes a palette color, replace it with a semantic variable first.
3. **`<site>/css/theme.css`** (one per site): the semantic mapping for light and dark mode, plus
   anything only that site uses. For example:

   ```css
   :root {
     --bg-color: var(--color-vellum);
     --text-color: var(--color-walnut);
     --icon-backing-color: var(--color-vellum);
     /* ... */
   }

   @media (prefers-color-scheme: dark) {
     :root:not([data-theme='light']) {
       /* dark values */
     }
   }
   :root[data-theme='dark'] {
     /* same dark values */
   }
   ```

   Forced-colors icon backing: in `base.css`, swap the hard-coded color for
   `var(--icon-backing-color)`. Each site sets that value (vellum on rdwaller, gray-smoke on
   hearing).

Check: after the split, `tokens.css` + `base.css` + `theme.css` loaded in that order should look
exactly the same as the old `style.css`. Compare the two in the browser (light, dark, toggle, and
forced colors) before you go further.

_Optional, later:_ `light-dark()` can collapse the duplicated `@media` and `[data-theme='dark']`
blocks in `theme.css`. Skip it for the first release.

---

## 4. Move the JS and icons

```sh
cp ../rdwaller-dot-net/js/theme.js ../rdwaller-dot-net/js/nav.js js/
cp -R ../rdwaller-dot-net/assets/icons/heroicons icons/
cp ../rdwaller-dot-net/assets/icons/GitHub_Invertocat_Black.svg \
   ../rdwaller-dot-net/assets/icons/InBug-Black.svg icons/
```

Delete the stray `* copy.svg` files instead of copying them over.

The small inline `<script>` in `base.njk` that reads `localStorage` stays inline in each layout. It
has to run before the CSS loads to prevent a flash of the wrong theme, so it can't be a deferred
file.

---

## 5. Fill in `package.json`

```json
{
  "name": "@rdwall3r/design-system",
  "version": "1.0.0",
  "description": "Shared CSS, JS, and icons for rdwaller.net and hearing-solutions",
  "files": ["css", "js", "icons"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rdwall3r/design-system.git"
  },
  "license": "ISC"
}
```

There are no dependencies and no scripts. `files` limits what gets installed.

---

## 6. Write a short README

Cover:

- What's in the package (one line per file)
- Load order: `tokens.css` → `base.css` → site `theme.css`
- The list of semantic variables a site **must** define in `theme.css`
- How to install and update (steps 8 and 10 below)

---

## 7. Publish to GitHub and tag a version

```sh
git add .
git commit -m "Initial design system"
gh repo create rdwall3r/design-system --public --source=. --push
git tag v1.0.0
git push --tags
```

---

## 8. Install it in each site

In `rdwaller-dot-net` (and later `hearing-solutions`):

```sh
npm install github:rdwall3r/design-system#v1.0.0
```

In `eleventy.config.js`, copy the package files into the built site:

```js
eleventyConfig.addPassthroughCopy({
  assets: 'assets',
  css: 'css',
  js: 'js',
  'node_modules/@rdwall3r/design-system/css': 'ds/css',
  'node_modules/@rdwall3r/design-system/js': 'ds/js',
  'node_modules/@rdwall3r/design-system/icons': 'ds/icons',
});
```

In `_includes/layouts/base.njk`, replace the single stylesheet and the two scripts:

```html
<link rel="stylesheet" href="/ds/css/tokens.css" />
<link rel="stylesheet" href="/ds/css/base.css" />
<link rel="stylesheet" href="/css/theme.css" />
<script src="/ds/js/nav.js" defer></script>
<script src="/ds/js/theme.js" defer></script>
```

Update icon `src` paths from `/assets/icons/...` to `/ds/icons/...`. Then delete the old
`css/style.css`, `js/theme.js`, `js/nav.js`, and the shared icons from the site repo.

Run `npm run build`, check the site, then run `npm run a11y-scan`.

---

## 9. Repeat for `hearing-solutions`

Same as step 8, but its `theme.css` maps to gray-smoke / flint, uses clay `#8f5442`, and sets
`--icon-backing-color` to gray-smoke. Anything left over in its old `style.css` that isn't in
`base.css` is either site-specific (move it to `theme.css`) or drift (delete it).

---

## 10. Day-to-day workflow

**While editing the design system**, link it so the site uses your local copy:

```sh
cd ~/Documents/GitHub/design-system && npm link
cd ~/Documents/GitHub/rdwaller-dot-net && npm link @rdwall3r/design-system
npm start
```

**To release a change:**

1. Commit in `design-system` and add a line to `CHANGELOG.md`
2. Bump the version: patch for fixes, minor for new things, major if a site's `theme.css` has to
   change
3. `git tag vX.Y.Z && git push --tags`
4. In each site: `npm install github:rdwall3r/design-system#vX.Y.Z`, build, check, commit

`npm link` sticks around. When you're done developing, run `npm unlink @rdwall3r/design-system` and
reinstall the tagged version so the site isn't stuck on your local copy.

---

## Later (not part of this pass)

- Share `base.njk` and the page layouts (via `_data` or a small Eleventy plugin)
- Use `light-dark()` to shorten the theme files
- Self-host the Atkinson Hyperlegible Next font inside the package
