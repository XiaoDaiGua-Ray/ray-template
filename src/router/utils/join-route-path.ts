export const joinRoutePath = (parent: string, path: string) =>
  path.startsWith('/') ? path : `${parent.replace(/\/$/, '')}/${path}`
