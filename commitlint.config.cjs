// update: 更新代码 | Update code
// fix: 修复 bug | Fix bug
// feat: 新功能 | New feature
// chore: 构建过程或辅助工具的变动 | Build process or auxiliary tool changes
// docs: 文档 | Documentation
// refactor: 重构（即不是新增功能，也不是修改 bug 的代码变动） | Refactor (i.e. code changes that are neither new features nor bug fixes)
// test: 增加测试 | Add test
// style: 代码格式（不影响功能，例如空格、分号等格式修正） | Code format (no functional impact, such as space, semicolon, etc.)
// version: 更新迭代 package.json 版本号 | Update the package.json version number
// build: 构建 | Build

module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'update',
        'fix',
        'feat',
        'chore',
        'docs',
        'refactor',
        'test',
        'style',
        'version',
        'build',
      ],
    ],
  },
}
