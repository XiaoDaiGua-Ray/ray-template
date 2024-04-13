import path from 'node:path'
import fs from 'node:fs'

/**
 *
 * @param directory svg icons module directory
 *
 * @description
 * 解析 svg icons 模块目录。会自动递归解析目录下的所有 svg icons 模块（文件夹）；
 * 返回所有 svg icons 模块（文件夹）的绝对路径。
 *
 * 但是，不包含传递的目录。
 *
 * 默认解析 src/icons 目录。
 */
export const svgIconResolve = (directory = 'src/icons') => {
  const folders: string[] = []

  const modules = fs.readdirSync(path.resolve(process.cwd(), directory))

  for (const curr of modules) {
    const p = path.join(directory, curr)
    const stats = fs.statSync(p)

    if (stats.isDirectory()) {
      folders.push(path.resolve((process.cwd(), p)))
      folders.push(...svgIconResolve(p))
    }
  }

  return folders
}
