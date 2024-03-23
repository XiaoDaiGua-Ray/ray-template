import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      plugins: [tsconfigPaths()],
      test: {
        include: ['**/__test__/**/*'],
        exclude: [
          ...configDefaults.exclude,
          '**/src/**',
          '**/__test__/utils/**/*',
        ],
        environment: 'happy-dom',
        globals: true,
        poolOptions: {
          threads: {
            maxThreads: 1,
            minThreads: 0,
          },
        },
      },
    }),
  ),
)
