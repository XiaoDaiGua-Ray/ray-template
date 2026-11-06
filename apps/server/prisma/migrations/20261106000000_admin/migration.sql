CREATE TABLE "Department" (
  "id" TEXT PRIMARY KEY,
  "parentId" TEXT REFERENCES "Department"("id") ON DELETE RESTRICT,
  "name" TEXT NOT NULL,
  "labelKey" TEXT
);
CREATE INDEX "Department_parentId_idx" ON "Department"("parentId");
CREATE TABLE "Role" (
  "value" TEXT PRIMARY KEY,
  "label" TEXT NOT NULL,
  "labelKey" TEXT
);
CREATE TABLE "Permission" ("code" TEXT PRIMARY KEY);
CREATE TABLE "RolePermission" (
  "roleValue" TEXT NOT NULL REFERENCES "Role"("value") ON DELETE CASCADE,
  "permissionCode" TEXT NOT NULL REFERENCES "Permission"("code") ON DELETE CASCADE,
  PRIMARY KEY ("roleValue", "permissionCode")
);
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "username" TEXT NOT NULL,
  "usernameKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailKey" TEXT NOT NULL,
  "phone" TEXT NOT NULL DEFAULT '',
  "departmentId" TEXT NOT NULL REFERENCES "Department"("id") ON DELETE RESTRICT,
  "role" TEXT NOT NULL REFERENCES "Role"("value") ON DELETE RESTRICT,
  "status" TEXT NOT NULL DEFAULT 'enabled',
  "remark" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "User_status_check" CHECK ("status" IN ('enabled', 'disabled')),
  CONSTRAINT "User_usernameKey_check" CHECK ("usernameKey" = lower("username")),
  CONSTRAINT "User_emailKey_check" CHECK ("emailKey" = lower("email"))
);
CREATE UNIQUE INDEX "User_usernameKey_key" ON "User"("usernameKey");
CREATE UNIQUE INDEX "User_emailKey_key" ON "User"("emailKey");
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");
CREATE TABLE "Credential" (
  "userId" TEXT PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE,
  "passwordHash" TEXT NOT NULL,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL
);
CREATE TABLE "Session" (
  "tokenHash" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE TABLE "RouteConfig" (
  "id" TEXT PRIMARY KEY,
  "config" JSONB NOT NULL,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL
);
CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "resourceId" TEXT,
  "requestId" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");
