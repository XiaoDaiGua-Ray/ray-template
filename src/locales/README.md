## 国际化入口

### 说明

- 该文件入口为整个项目的入口文件
- 二次封装 useI18n 方法、国际化文件入口、辅助方法等
- 国际化配置文件格式都应该按照当前已约定格式进行拓展与使用

### lang 文件入口说明

> 项目默认包含英文包与中文包，如果需要拓展应该按照当前格式进行拓展。每个文件识别为一个国际包语言包（会自动导入所有 json 文件作为语言包）。

#### 注意

> 该项目语言包使用 json 格式作为语言包管理格式，为了配合 `@intlify/unplugin-vue-i18n/vite` 插件，故而采用 json。

#### 拓展方法

- 配置语言包文件（文件名为语言包名称）
- 配置文件入口（使用 `combineI18nMessages` 方法进行自动合并处理）
- 语言包名称应该全局唯一

### helper 文件说明

- `getAppLocalMessages` 获取系统所有语言包（该方法强制依赖 LOCAL_OPTIONS key 配置，意味着你在配置语言包的时候，key 必须与 `src/locales/lang/xxx.ts` 一一对应匹配）
- `naiveLocales` 获取 `naive-ui` 组件库对应语言包文件
- `getAppDefaultLanguage` 获取系统当前默认语言包

### useI18n 文件说明

> 二次封装 `i18n`，应该避免使用自带 `useI18n` 方法，使用系统提供方法。

- 支持 setup 环境外使用 `t`、`value` 方法
- 其行为与官方方法一致
