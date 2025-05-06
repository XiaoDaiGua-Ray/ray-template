export const chunksCopilot = () => {
  const utilsLibOptions = ['src/utils']
  const hooksLibOptions = [
    'src/hooks/components',
    'src/hooks/template',
    'src/hooks/web',
  ]
  const nodeModulesOptions = ['node_modules']

  // 是否为 node_modules 库
  const isNodeModules = (id: string) =>
    nodeModulesOptions.some((option) => id.includes(option))
  // 是否为模板工程下的 utils 库
  const isUtils = (id: string) =>
    utilsLibOptions.some((option) => id.includes(option) && !isNodeModules(id))
  // 是否为模板工程下的 hooks 库，不包含 node_modules 库
  const isHooks = (id: string) =>
    hooksLibOptions.some((option) => id.includes(option) && !isNodeModules(id))

  return {
    isUtils,
    isHooks,
    isNodeModules,
  }
}
