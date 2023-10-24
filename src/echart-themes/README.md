## Echart Theme 编辑器

官网地址: https://echarts.apache.org/zh/theme-builder.html

## 流程

1. 配置、选择主题
2. 点击下载主题
3. 选择 json 类型，然后复制
4. 在 src/echart-themes 包中创建对应的 json 文件，文件名为主题名称

## 注意

### 一份主题

如果有且仅有一份 echart theme，则会视为明暗主题色都共用一套主题色。

### 两份主题

下载好的主题应该分为：xxx 与 xxx-dark 两份。这样模板会自动根据配置主题色切换明暗主题。
