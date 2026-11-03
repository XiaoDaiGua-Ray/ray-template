export const iconsRoot: string
export function iconNameFromPath(filePath: string, root?: string): string
export function scanIcons(root?: string): string[]
export function generateIcons(check?: boolean): Promise<void>
