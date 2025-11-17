CREATE OR REPLACE FUNCTION fn_process_order(
    p_user_id INTEGER,
    p_product_id INTEGER,
    p_quantity INTEGER DEFAULT 1 
)
RETURNS TABLE(pedido_id INTEGER, producto_nombre TEXT, stock_restante INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    v_product_price INTEGER;
    v_new_stock INTEGER;
    v_product_name TEXT;
    v_current_stock INTEGER;
    v_new_pedido_id INTEGER;
BEGIN
    -- 1. CONTROL DE CONCURRENCIA: Bloquea la fila del producto (INTEGRIDAD)
    SELECT precio, stock, nombre INTO v_product_price, v_current_stock, v_product_name
    FROM "Producto" WHERE id = p_product_id FOR UPDATE; 

    -- 2. Verificar Stock (Lógica de Negocio)
    IF v_current_stock < p_quantity THEN
        RAISE EXCEPTION '409: Stock insuficiente para %', v_product_name;
    END IF;

    v_new_stock := v_current_stock - p_quantity;

    -- 3. Actualizar Stock (DML)
    UPDATE "Producto" SET stock = v_new_stock WHERE id = p_product_id;

    -- 4. Registrar el Pedido (Encabezado)
    INSERT INTO "Pedido" (usuario_id, "fecha_pedido", estado)
    VALUES (p_user_id, NOW(), 'PAGO_APROBADO') 
    RETURNING id INTO v_new_pedido_id;

    -- 5. Registrar el Item del Pedido (Detalle)
    INSERT INTO "ItemPedido" ("pedido_id", "producto_id", cantidad, "precio_unitario_al_comprar")
    VALUES (v_new_pedido_id, p_product_id, p_quantity, v_product_price);

    -- 6. Devolver resultados
    RETURN QUERY 
    SELECT v_new_pedido_id, v_product_name, v_new_stock;

END;
$$;