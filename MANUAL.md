## Ray Template 使用手册

## 前言

> `Ray Template` 默认使用 `pnpm` 作为包管理器，并且默认启用严格模式的 `eslint`。在导入模块的时候除 `.ts` `.tsx` `.d.ts` 文件等不需要手动补全后缀名，其余的模块导入应该手动补全所有后缀名。

### 使用

#### 依赖安装

```sh
# yarn
yarn

# npm
npm i
```

#### 启动项目

```sh
# yarn
yarn dev

# npm
npm run dev
```

#### 构建项目

```sh
# yarn
yarn build

# npm
npm run build
```

### 国际化

#### Tip

- 每个新的语言包文件的文件名视为 path 开头（menu.json => menu.xxx）

#### 新增语言包、新增语言模块

> 项目国际化管理模块，统一放置于 `src/locales` 下。

##### 文件包

- lang
- helper.ts
- index.ts
- useI18n.ts

> 项目中使用 t locale 方法时，使用模板提供方法（useI18n.ts）

```tsx
// 引入包
import { useI18n } from '@/locales/useI18n'

const { t, locale } = useI18n()

/**
 *
 * t: 用于绑定国际化 path
 * locale: 用于切换系统语言。参数 key 必须与 lang 包中的语言包一致
 */

const demo = () => <span>{t('demo.demo')}</span>

locale('zh-CN')
locale('en-US')
```

##### 新增语言包

> 我们举例新增台湾地区语言包。

- `src/locales/lang` 文件下创建对应新语言包文件夹与语言文件
  - zh-TW 文件夹
  - zh-TW.ts 文件
- 创建与原有语言格式一样的文件夹（可以直接 cv 过去）
- 配置语言下拉项（LOCAL_OPTIONS）
- 配置 dayjs 国际化映射（DAYJS_LOCAL_MAP）

> 具体注意事项看注释。

##### 最后

> 按照上述步骤操作后，就已经给模板添加了一个新的语言包了。可以在页面的右上角国际化下拉框中看到新增的下拉选项，点击切换后，即可切换到对应的语言了。

### 路由

#### Tip

- 在该模板中，路由 path 属性视 `/` 开头的路由为根路由
- 路由会在初始化的时候将所有路由进行提升（全部提升为顶级路由），所以注意第一条 Tip
- 路由模块会影响菜单的输出显示（菜单模块与路由模块进行拆分开来的）
- 具体路由支持配置属性看 router/README.md 文件

#### 文件包

- constant 文件放置一些公共东西
- helper 文件放置 router 的一些 hook 方法
- modules 页面路由入口（modules 文件中每一个 xxx.ts 文件都会被视为是一个路由模块）
- utils router 拓展方法
- ...

##### 新增路由页面

- modules 中添加一个新的模块（log.ts）
- 配置路由的相关信息
- views 中创建 log 相关的页面信息

```ts
// 辅助函数，配合 i18n-ally 插件使用
import { t } from '@/locales/useI18n'

// 路由配置类型提示
import type { AppRouteRecordRaw } from '@/router/type'

const log: AppRouteRecordRaw = {
  path: '/log',
  name: 'Log',
  component: () => import('@/views/log/index.vue'),
  meta: {
    i18nKey: t('menu.Log'),
    icon: 'log',
    order: 3,
  },
  children: [
    {
      path: 'my-log',
      name: 'MyLog',
      component: () => import('@/views/my-log/index.vue'),
      meta: {
        i18nKey: t('menu.MyLog'),
        order: 0,
      },
    },
    {
      path: 'group-log',
      name: 'MyLog',
      component: () => import('@/views/group-log/index.vue'),
      meta: {
        i18nKey: t('menu.GroupLog'),
        order: 0,
      },
    },
  ],
}

export default log
```

##### 最后

> 打开浏览器可以看到页面菜单上已经有一个日志菜单。

#### 未完待续。。。后续慢慢更新该手册
