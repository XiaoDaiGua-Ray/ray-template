import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        include: ['./__test__/**/*.(spec).(ts|tsx)'],
        exclude: [
          ...configDefaults.exclude,
          '**/src/**',
          './__test__/utils/**/*',
        ],
        environment: 'happy-dom',
        globals: true,
      },
    }),
  ),
)
