import type { Prisma } from '../../generated/prisma/client'

export async function replaceCredential(
  transaction: Prisma.TransactionClient,
  userId: string,
  passwordHash: string,
  actorId: string | null = null,
  requestId: string | null = null,
) {
  await transaction.credential.upsert({
    where: { userId },
    create: { userId, passwordHash },
    update: { passwordHash },
  })
  await transaction.session.deleteMany({ where: { userId } })
  await transaction.auditLog.create({
    data: {
      action: 'credentials.reset',
      resourceId: userId,
      actorId,
      requestId,
    },
  })
}
