/* eslint-disable @typescript-eslint/no-explicit-any */

export {}

declare module '*.json' {
  const jsonContent: Record<string, any>
  export default jsonContent
}
