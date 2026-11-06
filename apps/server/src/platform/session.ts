import type { Request, Response } from 'express'

const browserSessionHeader = 'X-Ray-Session'
const tokenPattern = /^[\w-]+\.[\w-]+\.[\w-]+$/u
const cookieName = (secure: boolean) =>
  secure ? '__Host-ray-session' : 'ray-session'

export const browserSessionRequested = (request: Request) =>
  request.get(browserSessionHeader) === 'cookie'

export function setSessionCookieMode(response: Response, secure: boolean) {
  response.locals.sessionCookie = cookieName(secure)
}

export function tokenFrom(request: Request) {
  let token: string | undefined

  if (browserSessionRequested(request)) {
    const name = request.res?.locals.sessionCookie

    if (typeof name !== 'string') return null

    const matches = request.headers.cookie
      ?.split(';')
      .map((part) => part.trim())
      .filter((part) => part.startsWith(`${name}=`))

    if (matches?.length === 1) token = matches[0].slice(name.length + 1)
  } else {
    token = /^Bearer (\S+)$/iu.exec(request.headers.authorization ?? '')?.[1]
  }

  return token && token.length <= 2048 && tokenPattern.test(token)
    ? token
    : null
}

export function writeSessionCookie(
  response: Response,
  secure: boolean,
  session?: { accessToken: string; expiresAt: string },
) {
  const name = cookieName(secure)
  const options = {
    httpOnly: true,
    sameSite: 'strict',
    secure,
    path: secure ? '/' : '/api/admin',
  } as const

  if (session)
    response.cookie(name, session.accessToken, {
      ...options,
      expires: new Date(session.expiresAt),
    })
  else response.clearCookie(name, options)
}
