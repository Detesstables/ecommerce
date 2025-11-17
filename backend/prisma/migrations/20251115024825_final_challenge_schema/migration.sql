/*
  Warnings:

  - You are about to drop the column `estadoPago` on the `Pedido` table. All the data in the column will be lost.
  - The `estado` column on the `PedidoPersonalizado` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'PAGO_APROBADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "estadoPago",
ADD COLUMN     "estado" "EstadoPedido" NOT NULL DEFAULT 'PAGO_APROBADO';

-- AlterTable
ALTER TABLE "PedidoPersonalizado" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE';

-- DropEnum
DROP TYPE "EstadoPago";
