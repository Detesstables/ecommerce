/*
  Warnings:

  - You are about to drop the column `direccion` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `direccion_detalle` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region_id` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPersonalizado" AS ENUM ('PENDIENTE', 'REVISION', 'APROBADO', 'RECHAZADO', 'COMPLETADO');

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "direccion",
ADD COLUMN     "direccion_detalle" TEXT NOT NULL,
ADD COLUMN     "region_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoPersonalizado" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion_cliente" TEXT NOT NULL,
    "referencia_img_url" TEXT,
    "presupuesto_estimado" INTEGER,
    "estado" "EstadoPersonalizado" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PedidoPersonalizado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_nombre_key" ON "Region"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoPersonalizado" ADD CONSTRAINT "PedidoPersonalizado_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
