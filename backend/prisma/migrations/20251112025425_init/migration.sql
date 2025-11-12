-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contraseña_hash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'CLIENTE',
    "direccion" TEXT NOT NULL,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "descripcion" TEXT
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" DATETIME NOT NULL,
    "imagenUrl" TEXT,
    "categoria_id" INTEGER NOT NULL,
    CONSTRAINT "Producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_pedido" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoPago" TEXT NOT NULL DEFAULT 'APROBADO',
    "usuario_id" INTEGER NOT NULL,
    CONSTRAINT "Pedido_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario_al_comprar" INTEGER NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    CONSTRAINT "ItemPedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "Pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPedido_pedido_id_producto_id_key" ON "ItemPedido"("pedido_id", "producto_id");
