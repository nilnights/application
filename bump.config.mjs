import { defineConfig } from 'bumpp'

export default defineConfig({
  files: [
    'apps/**/*/package.json',
    'pkgs/**/*/package.json',
  ],
  commit: true,
  tag: true,
  push: true,
})
