import { createDatabase } from './infrastructure/database'
import { loadServerConfig } from './platform/index'
import { seedDatabase, setPassword } from './seed'

const config = loadServerConfig()
const database = createDatabase(config.databaseUrl)
const command = process.argv[2]

try {
  if (command === 'seed') {
    const result = await seedDatabase(database, {
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    })

    console.log(
      result.created
        ? 'Administrator initialized.'
        : 'Existing administrator preserved.',
    )
  } else if (command === 'password') {
    const username = process.argv[3] ?? process.env.CREDENTIAL_USERNAME
    const password = process.env.CREDENTIAL_PASSWORD

    if (!username || !password)
      throw new Error(
        'Set CREDENTIAL_USERNAME and CREDENTIAL_PASSWORD before running credential:set.',
      )

    await setPassword(database, username, password)
    console.log('Credential updated and active sessions revoked.')
  } else if (command === 'cleanup-sessions') {
    const result = await database.session.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    })

    console.log(`Removed ${result.count} expired sessions.`)
  } else {
    throw new Error('Use seed, password, or cleanup-sessions.')
  }
} catch (error) {
  // Prisma 错误可能包含连接信息和参数；命令行只输出预期的操作错误。
  console.error(
    error instanceof Error && error.name === 'Error' && !('code' in error)
      ? error.message
      : 'Database operation failed.',
  )
  process.exitCode = 1
} finally {
  await database.$disconnect()
}
