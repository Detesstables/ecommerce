-- AlterEnum
ALTER TYPE "EstadoPedido" ADD VALUE 'CONVERTIDO_A_VENTA';

-- AlterTable
ALTER TABLE "PedidoPersonalizado" ADD COLUMN     "producto_id" INTEGER;

-- AddForeignKey
ALTER TABLE "PedidoPersonalizado" ADD CONSTRAINT "PedidoPersonalizado_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
