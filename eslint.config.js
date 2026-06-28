// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Feature-Sliced Design layers, ordered top → bottom.
// A layer may import ONLY from layers strictly below it.
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

// For each layer, the list of layers it is allowed to import from.
const allowedTargets = (layer) => FSD_LAYERS.slice(FSD_LAYERS.indexOf(layer) + 1);

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // --- Feature-Sliced Design boundaries -----------------------------------
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      // Resolve the `@/*` → `./src/*` alias so the plugin can classify imports.
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
      // Only the FSD layer folders participate; legacy folders (components/,
      // types/) are excluded until they are migrated, to avoid false noise.
      'boundaries/include': FSD_LAYERS.map((layer) => `src/${layer}/**/*`),
      'boundaries/elements': [
        // `app` has no slices — it is a single initialization layer.
        { type: 'app', pattern: 'src/app', mode: 'folder' },
        // The remaining layers are sliced: capture the slice name so that
        // cross-slice imports within the same layer can be reasoned about.
        { type: 'pages', pattern: 'src/pages/*', mode: 'folder', capture: ['slice'] },
        { type: 'widgets', pattern: 'src/widgets/*', mode: 'folder', capture: ['slice'] },
        { type: 'features', pattern: 'src/features/*', mode: 'folder', capture: ['slice'] },
        { type: 'entities', pattern: 'src/entities/*', mode: 'folder', capture: ['slice'] },
        // `shared` is segmented (ui, lib, ...) rather than sliced.
        { type: 'shared', pattern: 'src/shared/*', mode: 'folder', capture: ['segment'] },
      ],
    },
    rules: {
      // Rule 1: layer hierarchy. A layer imports only from layers below it.
      // `default: disallow` also forbids same-layer cross-slice imports
      // (e.g. features → features), enforcing slice isolation.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: FSD_LAYERS.map((layer) => ({
            from: { type: layer },
            allow: allowedTargets(layer).map((target) => ({ to: { type: target } })),
          })),
        },
      ],
      // Rule 2: every file inside a layer must belong to a known element.
      'boundaries/no-unknown': 'error',
      // Rule 3: forbid importing files that belong to no known element.
      'boundaries/no-unknown-files': 'error',
    },
  },
  ...storybook.configs['flat/recommended'],
  prettier,
]);


