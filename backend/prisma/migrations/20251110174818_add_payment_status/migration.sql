-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_pedido" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoPago" TEXT NOT NULL DEFAULT 'APROBADO',
    "usuario_id" INTEGER NOT NULL,
    CONSTRAINT "Pedido_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pedido" ("fecha_pedido", "id", "usuario_id") SELECT "fecha_pedido", "id", "usuario_id" FROM "Pedido";
DROP TABLE "Pedido";
ALTER TABLE "new_Pedido" RENAME TO "Pedido";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
