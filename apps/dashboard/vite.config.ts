import tailwindcss from '@tailwindcss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import iconsResolver from 'unplugin-icons/resolver'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'esnext',
  },
  plugins: [
    solid(),
    tailwindcss(),
    tsconfigPaths(),
    icons({
      compiler: 'solid',
      autoInstall: true,
      customCollections: {
        icon: FileSystemIconLoader('./src/assets/icons'),
      },
    }), // https://github.com/unplugin/unplugin-icons
    autoImport({
      dts: 'src/imports.d.ts',
      resolvers: [
        iconsResolver({ prefix: false, enabledCollections: ['icon', 'lucide'] }),
      ],
    }), // https://github.com/unplugin/unplugin-auto-import
  ],
})
