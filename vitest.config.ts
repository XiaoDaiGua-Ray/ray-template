import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        root: fileURLToPath(new URL('.', import.meta.url)),
        include: ['__test__/**/*.spec.{ts,tsx}'],
        exclude: [
          ...configDefaults.exclude,
          '**/src/**',
          './__test__/utils/**/*',
        ],
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['__test__/setup-api.ts'],
      },
    }),
  ),
)
