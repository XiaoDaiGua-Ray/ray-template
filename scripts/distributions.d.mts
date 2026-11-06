export type DistributionEdition = 'frontend' | 'fullstack'

export interface DistributionManifest {
  formatVersion: number
  generatedBy: string
  edition: DistributionEdition
  version: string
  source: { commit: string | null; dirty: boolean }
  workspaces: string[]
  fileCount: number
  contentSha256: string
}

export function pruneLockfile(content: string, importers: Set<string>): string
export function exportDistribution(
  root: string,
  edition: DistributionEdition,
  options?: { archive?: boolean },
): Promise<{
  directory: string
  archive: string | null
  manifest: DistributionManifest
}>
export function checkDistributions(root?: string): {
  edition: DistributionEdition
  files: number
  workspaces: number
}[]
