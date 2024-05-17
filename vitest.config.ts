import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      plugins: [tsconfigPaths()],
      test: {
        include: ['./__test__/**/*.(spec).(ts|tsx)'],
        exclude: [
          ...configDefaults.exclude,
          '**/src/**',
          './__test__/utils/**/*',
        ],
        environment: 'happy-dom',
        globals: true,
        poolOptions: {
          /**
           *
           * 如此配置是为避免: Module did not self-register... 错误；
           * 该错误是一个历史悠久遗留问题，可以查看该 issues:
           * @see https://github.com/vitest-dev/vitest/issues/740
           *
           * 目前暂时没有更好的解决方案，这么做会导致单测执行速度变慢，但是可以避免错误，后续有更好的解决方案会更新。
           *
           * 在 v4.8.5 版本中，已经修复了该问题，可以升级到该版本。
           */
        },
      },
    }),
  ),
)
