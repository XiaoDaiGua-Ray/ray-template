# commit 规范

## commit message 格式

在提交代码时，`commit message` 遵循以下格式：

- feat: 新功能`（feature）`
- fix: 修补 `bug`
- update: 更新代码
- docs: 文档（documentation）
- style: 格式（不影响代码运行的变动）
- refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
- test: 增加测试
- chore: 构建过程或辅助工具的变动
- revert: 撤销
- merge: 合并分支
- perf: 优化相关，比如提升性能、体验
- build: 构建
- plugin: 插件更新
- publish: 发布

当你需要定制化自己的`commit message`格式时，可以在`commitlint.config.cjs`文件中进行配置。
