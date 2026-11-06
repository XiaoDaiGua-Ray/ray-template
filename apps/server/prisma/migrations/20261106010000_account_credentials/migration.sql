INSERT INTO "Permission" ("code") VALUES ('users:credentials') ON CONFLICT DO NOTHING;

INSERT INTO "RolePermission" ("roleValue", "permissionCode")
SELECT "value", 'users:credentials' FROM "Role" WHERE "value" = 'admin'
ON CONFLICT DO NOTHING;
