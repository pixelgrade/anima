const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sass = require('sass');

function compileUtilityCss() {
  const entryFile = path.join(__dirname, '..', 'src', 'scss', 'utility.scss');
  const { css } = sass.compile(entryFile, {
    loadPaths: [path.join(__dirname, '..', 'src', 'scss')],
    silenceDeprecations: ['import', 'global-builtin', 'slash-div'],
  });

  return css.replace(/\s+/g, ' ');
}

test('Patch collage title tiers scale the authored card title controls with editor cascade specificity', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry [^{]*\.nb-card__title\[class\][^}]*\{[^}]*--anima-card-title-expression-scale: 1;[^}]*font-size: calc\(var\(--current-font-size\) \* var\(--anima-card-title-expression-scale\)\);/
  );
  assert.match(
    css,
    /\.editor-styles-wrapper [^{]*\.nb-card__title\[class\][^}]*\{[^}]*--anima-card-title-expression-scale: 1;[^}]*font-size: calc\(var\(--current-font-size\) \* var\(--anima-card-title-expression-scale\)\);/
  );
  assert.match(css, /--collage-title-weight: clamp\(400, calc\(\(var\(--current-font-weight\) \+ var\(--theme-body-font-weight\)\) \/ 2 \+ 100\), 700\);/);
  assert.match(css, /--collage-title-strong-weight: min\(900, var\(--collage-title-weight\) \+ 300\);/);
  assert.match(css, /--collage-title-light-weight: min\(var\(--collage-title-weight\), var\(--theme-body-font-weight\)\);/);
  assert.doesNotMatch(css, /\.nb-card__title[^}]*\{[^}]*font-size: 26px;/);
});

test('Patch excerpts and meta use connected body and meta palette roles', () => {
  const css = compileUtilityCss();
  const collageSource = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );
  const revealSource = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-hover-reveal.scss'),
    'utf8'
  );

  assert.match(css, /\.nb-card__description[^}]*\{[^}]*--current-font-family: var\(--theme-small-body-font-family\);/);
  assert.match(css, /\.nb-card__description[^}]*\{[^}]*--font-size: var\(--theme-small-body-font-size\);/);
  assert.match(css, /\.nb-supernova--card-metadata-style-accent-label [^{]*\.nb-card__meta--primary[^}]*\{[^}]*font-family: var\(--theme-body-font-family\);/);
  assert.match(revealSource, /font-size: calc\(var\(--theme-small-body-font-size\) \* 0\.785714 \* 1px\);/);
  assert.match(revealSource, /font-weight: var\(--theme-meta-font-weight\);/);
  assert.match(revealSource, /letter-spacing: calc\(var\(--theme-meta-letter-spacing\) \* 0\);/);
  assert.doesNotMatch(collageSource, /\.nb-card__meta--secondary\s*\{/);
  assert.match(revealSource, /\$accent-label-scope: '\.nb-supernova--card-metadata-style-accent-label';/);
  assert.match(revealSource, /#\{\$accent-label-scope\}\s*\{[\s\S]*?\.nb-card__meta--secondary\s*\{[^}]*font-family: var\(--theme-body-font-family\);[^}]*font-size: calc\(var\(--theme-small-body-font-size\) \* 0\.785714 \* 1px\);/);
  assert.match(css, /\.nb-supernova--card-metadata-style-accent-label \.nb-card__meta--secondary[^}]*\{[^}]*font-size: calc\(var\(--theme-small-body-font-size\) \* 0\.785714 \* 1px\);/);
  assert.match(collageSource, /\.nb-supernova-item\.nb-card--no-media\.format-standard\s*\{[\s\S]*?\.nb-card__title\s*\{[\s\S]*?background-color: var\(--sm-current-fg1-color\);/);
  assert.doesNotMatch(collageSource, /\.nb-supernova-item\.nb-card--no-media \.nb-card__title/);
});

test('Accent Label presentation is independent from Meta Reveal interaction', () => {
  const css = compileUtilityCss();

  assert.match(css, /\.nb-supernova--card-metadata-style-accent-label [^{]*\.nb-card__meta\s*\{/);
  assert.match(
    css,
    /\.nb-supernova--card-hover-reveal [^{]*> :is\(\.nb-card__meta, \.nb-card__meta-combined, \.nb-card__buttons\):nth-child\(1 of [^{]+\)\s*\{[^}]*position: absolute;/
  );
  assert.doesNotMatch(css, /\.nb-supernova--card-hover-reveal [^{]*\.nb-card__meta--primary[^}]*background-color:/);
});

test('Meta Reveal only hides metadata or buttons at visible card boundaries', () => {
  const css = compileUtilityCss();
  const revealRules = Array.from(css.matchAll(/([^{}]+)\{([^{}]+)\}/g))
    .map(([, selector, declarations]) => ({ selector: selector.trim(), declarations }))
    .filter(({ selector }) => selector.includes('.nb-supernova--card-hover-reveal'));
  const hiddenBoundaryRules = revealRules.filter(({ selector, declarations }) =>
    selector.includes(':is(.nb-card__meta, .nb-card__meta-combined, .nb-card__buttons)') &&
    declarations.includes('position: absolute;') &&
    declarations.includes('opacity: 0;') &&
    declarations.includes('pointer-events: none;')
  );

  assert.equal(hiddenBoundaryRules.length, 2);
  for (const { selector } of hiddenBoundaryRules) {
    assert.match(
      selector,
      /> :is\(\.nb-card__meta, \.nb-card__meta-combined, \.nb-card__buttons\):nth-(?:last-)?child/
    );
  }

  const leadingRule = hiddenBoundaryRules.find(({ selector }) =>
    selector.includes('.nb-supernova-item__content:first-child')
  );
  const trailingRule = hiddenBoundaryRules.find(({ selector }) =>
    selector.includes('.nb-supernova-item__content:last-child')
  );

  assert.ok(leadingRule);
  assert.match(leadingRule.declarations, /top: 0;/);
  assert.ok(trailingRule);
  assert.match(trailingRule.declarations, /bottom: 0;/);

  assert.doesNotMatch(
    css,
    /\.nb-supernova--card-hover-reveal [^{]*\.nb-supernova-item__content--before-media\s*\{[^}]*opacity: 0;/
  );
  assert.doesNotMatch(
    css,
    /\.nb-supernova--card-hover-reveal [^{]*\.nb-supernova-item__content--before-media\s*\{[^}]*position: absolute;/
  );
});

test('Meta Reveal keeps stacked details in-frame and only opens non-stacked overflow', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-hover-reveal.scss'),
    'utf8'
  );

  assert.match(
    source,
    /#\{\$outward-reveal-scope\} \.nb-collection__layout-item:has\(> \.nb-supernova-item:not\(\.nb-supernova-item--layout-stacked\)\)\s*\{[^}]*overflow: visible;[^}]*min-width: 0;/s
  );
  assert.match(
    source,
    /#\{\$outward-reveal-scope\} \.nb-supernova-item:not\(\.nb-supernova-item--layout-stacked\)\s*\{[\s\S]*?> \.nb-supernova-item__content,[\s\S]*?> \.nb-supernova-item__frame > \.nb-supernova-item__content\s*\{[^}]*overflow: visible;/
  );
  assert.match(
    source,
    /&\.nb-supernova-item--layout-stacked\s*\{[\s\S]*?#\{\$leading-boundary\}\s*\{[^}]*position: static;[^}]*inset: auto;[^}]*transform: translateY\(var\(--theme-spacing-smallest\)\);[\s\S]*?#\{\$trailing-boundary\}\s*\{[^}]*position: static;[^}]*inset: auto;[^}]*transform: translateY\(calc\(var\(--theme-spacing-smallest\) \* -1\)\);/
  );
  assert.match(
    source,
    /&\.nb-supernova-item--layout-stacked:is\(:has\(#\{\$leading-boundary\}\), :has\(#\{\$trailing-boundary\}\)\)[\s\S]*?> \.nb-supernova-item__frame:has[^}]*\{[^}]*grid-template-rows: auto minmax\(0, 1fr\) auto;[^}]*min-height: var\(--nb-block-content-min-height\);[\s\S]*?> \.nb-supernova-item__media-wrapper\s*\{[^}]*grid-area: 1 \/ 1 \/ 4 \/ 2 !important;[\s\S]*?> \.nb-supernova-item__content--before-media\s*\{[^}]*position: static !important;[^}]*grid-area: 1 \/ 1 \/ 2 \/ 2 !important;[^}]*min-height: 0 !important;[^}]*overflow: hidden !important;[\s\S]*?> \.nb-supernova-item__content--after-media\s*\{[^}]*position: static !important;[^}]*grid-area: 3 \/ 1 \/ 4 \/ 2 !important;[^}]*min-height: 0 !important;[^}]*overflow: hidden !important;/
  );
  assert.match(
    source,
    /&\.nb-supernova-item--layout-stacked:is\(:hover, :focus-within\)\s*\{[\s\S]*?transform: translateY\(0\);/
  );
  assert.doesNotMatch(
    source,
    /nb-supernova-item--layout-stacked[^{}]*\.nb-supernova-item__frame\s*\{[^}]*overflow: visible;/s
  );
});

test('Meta Reveal uses an in-frame reveal for clipped collection compositions', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-hover-reveal.scss'),
    'utf8'
  );

  assert.match(
    source,
    /\$outward-reveal-scope: '#\{\$reveal-scope\}:not\(\.nb-supernova--layout-carousel\):not\(\.nb-supernova--layout-parametric\)';/
  );
  assert.match(
    source,
    /\$in-frame-collection-scope: '#\{\$reveal-scope\}:is\(\.nb-supernova--layout-carousel, \.nb-supernova--layout-parametric\)';/
  );
  assert.match(
    source,
    /#\{\$in-frame-collection-scope\} \.nb-supernova-item:not\(\.nb-supernova-item--layout-stacked\)\s*\{[\s\S]*?#\{\$leading-boundary\}\s*\{[^}]*transform: translateY\(var\(--theme-spacing-smallest\)\);[\s\S]*?#\{\$trailing-boundary\}\s*\{[^}]*transform: translateY\(calc\(var\(--theme-spacing-smallest\) \* -1\)\);/
  );
  assert.match(
    source,
    /#\{\$in-frame-collection-scope\} \.nb-supernova-item:not\(\.nb-supernova-item--layout-stacked\):is\(:hover, :focus-within\)\s*\{[\s\S]*?transform: translateY\(0\);/
  );
  assert.doesNotMatch(source, /\.slick-list\s*\{[^}]*overflow: visible;/s);
  assert.doesNotMatch(source, /\.nb-grid__area\s*\{[^}]*overflow: visible;/s);
});

test('Patch hover typography, colors, spacing, and motion consume theme tokens', () => {
  const css = compileUtilityCss();
  const collageSource = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );
  const patchSources = [
    '_collection-collage.scss',
    '_collection-hover-reveal.scss',
  ].map((file) => fs.readFileSync(path.join(__dirname, '..', 'src', 'scss', 'utility', file), 'utf8')).join('\n');

  assert.match(
    collageSource,
    /--collage-g:\s*calc\(\s*var\(--nb-spacing\)\s*\*\s*var\(--nb-grid-spacing-modifier\)\s*\*\s*var\(--nb-grid-spacing-multiplier,\s*1\)\s*\*\s*0?\.02\s*\);/s
  );
  assert.doesNotMatch(collageSource, /--collage-g:\s*var\(--nb-grid-spacing\);/);
  assert.match(
    collageSource,
    /padding-left:\s*calc\([^;]*\+\s*3\s*\*\s*#\{\$g\}\);/
  );
  assert.match(css, /--reveal-duration: var\(--theme-transition-duration-fast\);/);
  assert.match(
    css,
    /\.nb-card__read-more[^}]*\{[^}]*--current-font-family: var\(--theme-button-font-family\);[^}]*color: var\(--sm-current-bg-color\);/
  );
  assert.match(css, /font-size: calc\(var\(--theme-button-font-size\) \* 1\.857143 \* 1px\);/);
  assert.doesNotMatch(patchSources, /#(?:ffeb00|161a03|fff)\b/i);
  assert.doesNotMatch(patchSources, /rgba\(0,\s*0,\s*0,\s*0\.35\)/);
  assert.doesNotMatch(patchSources, /content:\s*['"]Read More['"]/);
  assert.doesNotMatch(patchSources, /--anima-brand-source-color/);
  assert.match(css, /is-sticky-post[^}]*::after[^}]*\{[^}]*background-color: var\(--sm-current-accent-color\);/);
});

test('Patch hover reveal exposes boundary details for keyboard focus', () => {
  const css = compileUtilityCss();
  const focusRevealRules = Array.from(css.matchAll(/([^{}]+)\{([^{}]+)\}/g))
    .map(([, selector, declarations]) => ({ selector: selector.trim(), declarations }))
    .filter(({ selector, declarations }) =>
      selector.includes('.nb-supernova--card-hover-reveal') &&
      selector.includes(':focus-within') &&
      selector.includes(':is(.nb-card__meta, .nb-card__meta-combined, .nb-card__buttons)') &&
      declarations.includes('opacity: 1;') &&
      declarations.includes('pointer-events: auto;')
    );

  assert.equal(focusRevealRules.length, 4);
  assert.ok(focusRevealRules.some(({ declarations }) => declarations.includes('translateY(calc(-100%')));
  assert.ok(focusRevealRules.some(({ declarations }) => declarations.includes('translateY(calc(100%')));
  const stackedFocusRules = focusRevealRules.filter(({ selector, declarations }) =>
      selector.includes('.nb-supernova-item.nb-supernova-item--layout-stacked:is') &&
      declarations.includes('transform: translateY(0);')
  );
  assert.equal(stackedFocusRules.length, 1);
  assert.match(stackedFocusRules[0].selector, /:nth-child\(1 of/);
  assert.match(stackedFocusRules[0].selector, /:nth-last-child\(1 of/);
  const constrainedFocusRules = focusRevealRules.filter(({ selector, declarations }) =>
      selector.includes(':is(.nb-supernova--layout-carousel, .nb-supernova--layout-parametric)') &&
      declarations.includes('transform: translateY(0);')
  );
  assert.equal(constrainedFocusRules.length, 1);
  assert.match(constrainedFocusRules[0].selector, /:nth-child\(1 of/);
  assert.match(constrainedFocusRules[0].selector, /:nth-last-child\(1 of/);
  assert.match(css, /\.nb-supernova--card-hover-reveal \.nb-post-format-card-blueprint--quote \.nb-card__meta\s*\{[^}]*color: var\(--sm-fg1-color-1\);/);
  assert.match(
    css,
    /\.nb-supernova--card-hover-reveal \.nb-supernova-item:focus-within \.nb-supernova-item__media-wrapper/
  );
});

test('Patch collage is block-local and has no generated Header brick styling', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.match(source, /\$collage-scope: '\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry';/);
  assert.doesNotMatch(source, /u-collection-collage|c-header-brick|nb-collection__layout-item--header-brick/);
  assert.match(source, /\.anima-collection-canvas\s*\{[^}]*position: relative;/s);
  assert.match(source, /\.anima-collection-canvas #\{\$collage-scope\} \.nb-collection__layout-item--external\s*\{[^}]*display: none;/s);
  assert.match(source, /\.anima-collection-canvas\.is-anima-collage-header-bound #\{\$collage-scope\} \.nb-collection__layout-item--external:not\(\[hidden\]\)[^{]*\{[^}]*display: block;/s);
  assert.match(source, /\.anima-collection-canvas\.is-anima-collage-header-bound #\{\$collage-scope\}\s*\{[^}]*padding-top: 0 !important;/s);
  assert.match(source, /header\.wp-block-template-part\.is-anima-collage-header-integrated\s*\{[^}]*grid-template-columns: \[fs\] minmax\(0, 1fr\) \[fe\];/s);
  assert.match(source, /\.is-anima-collage-header-integrated\s*\{[^}]*margin: 0;/s);
  assert.match(source, /\.anima-collection-canvas\.is-anima-collage-header-flow #\{\$collage-scope\} \.nb-collection__layout-item--external \+ \.nb-collection__layout-item[^{]*\{[^}]*margin-top: 0;/s);
});

test('Patch collage uses the shared flat masonry contract in the editor', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.match(source, /\$collage-editor-scope:/);
  assert.match(source, /#\{\$collage-editor-scope\}\s*\{[\s\S]*?--font-size-base: 1;[\s\S]*?@include collage-card-type-system;[\s\S]*?\.nb-supernova-item\.format-quote blockquote\s*\{[\s\S]*?p,[\s\S]*?cite\s*\{[^}]*font-size: var\(--current-font-size\);/);
  assert.doesNotMatch(source, /#\{\$collage-editor-scope\}[\s\S]*?\.nb-card__title\s*\{[^}]*font-size: var\(--current-font-size\);/);
  assert.doesNotMatch(source, /nb-collection__layout-column/);
  assert.doesNotMatch(source, /approximate the collage inside the block editor/i);
  assert.match(source, /\.nb-collection__layout-item--col-even\s*\{/);
  assert.doesNotMatch(source, /\.nb-supernova-item__content:not\(\.nb-supernova-item__content--before-media\):not\(\.nb-supernova-item__content--after-media\) \.nb-card__meta/);
});

test('Patch portrait and tall cards let after-media copy wrap around floated media', () => {
  const css = compileUtilityCss();

  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry [^{]*\.nb-supernova-item\.nb-card--media-portrait [^{]*\.nb-supernova-item__content--after-media[^}]*\{[^}]*display: block;/
  );
  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry [^{]*\.nb-supernova-item\.nb-card--media-tall [^{]*\.nb-supernova-item__content--after-media[^}]*\{[^}]*display: block;/
  );
});

test('Patch collage consumes Site Container and Content Inset without changing other Collections', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry\s*\{[^}]*width: min\(100%, var\(--nb-container-width\), 1850px\);/
  );
  assert.match(
    source,
    /--collage-side-inset:\s*clamp\([^;]*var\(--nb-sidecar-sidebar-small-width\)[^;]*\.25[^;]*\);/
  );
  assert.match(
    source,
    /\.wp-block-query:has\(> #\{\$collage-scope\}\)\s*\{[^}]*padding-top:\s*max\(var\(--collage-side-inset\), calc\(var\(--theme-spacing-normal\) \* 2\)\) !important;/s
  );
  assert.match(source, /padding-left:\s*calc\(var\(--collage-side-inset\) \+ 3 \* #\{\$g\}\);/);
  assert.match(source, /padding-right:\s*var\(--collage-side-inset\);/);
});

test('Patch collage keeps masonry tracks touching while Items Gap drives the overlap gesture', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry [^{]*\.nb-collection__layout\[class\][^}]*\{[^}]*column-gap: 0 !important;/
  );
  assert.match(
    source,
    /--collage-g:\s*calc\(\s*var\(--nb-spacing\)\s*\*\s*var\(--nb-grid-spacing-modifier\)\s*\*\s*var\(--nb-grid-spacing-multiplier,\s*1\)\s*\*\s*0?\.02\s*\);/s
  );
  assert.match(
    source,
    /\.nb-collection__layout-item--col-even\s*\{[\s\S]*?\.nb-supernova-item__media-wrapper\s*\{[^}]*margin-right:\s*calc\(-2 \* #\{\$g\}\);/
  );
});

test('Patch quote blueprints do not expose their outer signal surface behind the offset card', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry [^{]*\.nb-post-format-card-blueprint[^}]*\{[^}]*background: transparent;/
  );
  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-collage\.nb-supernova--layout-masonry [^{]*\.nb-post-format-card-blueprint::before[^}]*\{[^}]*background: none;/
  );
  assert.match(
    source,
    /#\{\$collage-editor-scope\}[\s\S]*?:is\(\.nb-post-format-card-blueprint--quote, #specific\) \.nb-supernova-item__frame\s*\{[^}]*overflow: visible;/
  );
});

test('Patch quote blueprints let intrinsic quote content grow the frontend and editor surface', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.match(
    source,
    /body:not\(\.editor-styles-wrapper\) #\{\$collage-scope\}\.nb-supernova--aspect-ratio-original[\s\S]*?\.nb-post-format-card-blueprint--quote \.nb-supernova-item__content--after-media\[class\]\s*\{[^}]*position: relative;[^}]*inset: auto;/
  );
  assert.match(
    source,
    /body:not\(\.editor-styles-wrapper\) #\{\$collage-scope\}\.nb-supernova--aspect-ratio-original[\s\S]*?\.nb-post-format-card-blueprint--quote \.nb-supernova-item__media-wrapper\s*\{[^}]*margin-bottom: 0;/
  );
  assert.match(
    source,
    /:is\(\.nb-supernova-item__media-aspect-ratio, \.nb-supernova-item__media-doppler, \.novablocks-doppler__wrapper, \.blob-mix, \.blob-mix__media, \.blob-mix__mask\)\s*\{[^}]*height: 100% !important;/
  );
  assert.match(
    source,
    /\.nb-supernova-item__media\[class\]\[class\]\s*\{[^}]*height: 100% !important;[^}]*object-fit: var\(--nb-card-media-object-fit, cover\);/
  );
  assert.match(
    source,
    /#\{\$collage-editor-scope\}[\s\S]*?:is\(\.nb-post-format-card-blueprint--quote, #specific\) \.nb-supernova-item__frame[\s\S]*?> \.nb-supernova-item__content--after-media\[class\]\s*\{[^}]*position: relative !important;[^}]*inset: auto;[^}]*min-height: var\(--nb-block-content-min-height\) !important;/
  );
});

test('Patch Accent Label metadata wraps at semantic group boundaries', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'scss', 'utility', '_collection-hover-reveal.scss'),
    'utf8'
  );

  assert.match(
    source,
    /#\{\$accent-label-collage-scope\}\s*\{[\s\S]*?\.nb-card__meta\s*\{[^}]*flex-wrap: wrap;/
  );
  assert.match(
    source,
    /\.nb-card__meta--primary\s*\{[^}]*flex: 0 0 auto;/
  );
  assert.match(
    source,
    /\.nb-card__meta--secondary\s*\{[^}]*flex: 0 0 max-content;[^}]*max-width: 100%;/
  );
  assert.match(
    source,
    /\.nb-card__meta-link--date\s*\{[^}]*display: inline-block;[^}]*white-space: nowrap;/
  );
});
