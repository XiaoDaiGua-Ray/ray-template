/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-19
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 配置动态路由菜单
 *
 * 可以根据权限与白名单进行过滤, 但是 meta hidden 属性拥有最高的控制权限
 * 如果 mete hidden 设置为 false 则永远不会显示菜单选项
 */

/**
 *
 * 路由表单白名单
 *
 * 如果需要启用该功能, 则需要配置路由 name 属性, 并且需要一一对应(对大小写敏感)
 * 如果未设置, 则不会生效
 *
 * 配置该路由白名单列表后, 则不会对配置中的路由列表进行鉴权处理(配合 basic.ts 中的方法进行使用)
 */
export const whiteRoutes = ['login', 'error-page', 'doc']

/**
 *
 * 超级管理员
 *
 * 配置默认超级管理员, 默认拥有全部最高权限
 */
export const superAdmin = ['admin']
