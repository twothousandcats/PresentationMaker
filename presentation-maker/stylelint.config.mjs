/** @type {import('stylelint').Config} */
export default {
  rules: {
    // Только логические правила — без форматирования
    'color-no-invalid-hex': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'declaration-block-no-duplicate-properties': true,
    'no-duplicate-selectors': true,
    'font-family-no-missing-generic-family-keyword': true,
    'function-no-unknown': true,
    'media-feature-name-no-unknown': true,
  },
};
