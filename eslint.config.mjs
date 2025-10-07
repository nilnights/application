import { defineConfig, presetSolid } from 'witheslint'

export default defineConfig({
  presets: [
    presetSolid(),
  ],
  extends: [
    {
      files: ['apps/api/**/*.ts'],
      rules: {
        'no-console': 'off',
        'unicorn/no-process-exit': 'off',
      },
    },
    {
      rules: {
        'unicorn/no-null': 'off',
      },
    },
  ],
})
