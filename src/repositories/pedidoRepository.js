import { connection } from "../configs/Database.js";

const pedidoRepository = {

    criar: async (pedido, itensPedido) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const sqlPedido = "INSERT INTO pedidos (ClienteId, SubTotal, Status) VALUES (?, ?, ?)";
            const [pedidoResult] = await conn.execute(sqlPedido, [pedido.clienteId, pedido.subTotal, pedido.status]);
            const pedidoId = pedidoResult.insertId;

            for (const item of itensPedido) {
                const sqlItem = "INSERT INTO itens_pedidos (PedidoId, ProdutoId, Quantidade, ValorItem) VALUES (?, ?, ?, ?)";
                await conn.execute(sqlItem, [pedidoId, item.produtoId, item.quantidade, item.valorItem]);
            }

            await conn.commit();
            return { pedidoId };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    listar: async () => {
        const sql = `SELECT p.id, p.ClienteId, p.SubTotal, p.Status, p.DataCad, i.id AS ItemId, i.ProdutoId, i.Quantidade, i.ValorItem FROM pedidos p LEFT JOIN itens_pedidos i ON p.id = i.pedidoId ORDER BY p.id`;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    buscarPorId: async (id) => {
        const sql = `SELECT p.id, p.ClienteId, p.SubTotal, p.Status, p.DataCad, i.id AS ItemId, i.ProdutoId, i.Quantidade, i.ValorItem FROM pedidos p LEFT JOIN itens_pedidos i ON p.id = i.pedidoId WHERE p.id = ?`;
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    },

    async atualizarPedidoComItens(pedido, itens) {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const pedidoId = pedido.id;

            await conn.execute(`UPDATE pedidos SET clienteId = ?, subTotal = ?, status = ? WHERE id = ?`,
                [pedido.clienteId, pedido.subTotal, pedido.status, pedidoId]
            );

            const [itensAtuais] = await conn.execute(
                "SELECT * FROM itens_pedidos WHERE PedidoId = ?",
                [pedidoId]
            );

            const itensNovos = itens;

            const idsNovos = itensNovos.filter(i => i.id).map(i => i.id);

            for (let item of itensAtuais) {
                if (!idsNovos.includes(item.Id)) {
                    await conn.execute("DELETE FROM itens_pedidos WHERE Id = ?",
                        [item.Id]
                    );
                }
            }

            for (let item of itensNovos) {

                if (item.id) {
                    await conn.execute(`UPDATE itens_pedidos SET ProdutoId = ?, Quantidade = ?, ValorItem = ? WHERE Id = ?`,
                        [item.produtoId, item.quantidade, item.valorItem, item.id]
                    );
                } else {
                    await conn.execute(`INSERT INTO itens_pedidos (PedidoId, ProdutoId, Quantidade, ValorItem) VALUES (?, ?, ?, ?)`,
                        [pedidoId, item.produtoId, item.quantidade, item.valorItem]
                    );
                }
            }

            const [itensAtualizados] = await conn.execute("SELECT * FROM itens_pedidos WHERE PedidoId = ?",
                [pedidoId]
            );

            const subtotal = itensAtualizados.reduce(
                (total, item) => total + (item.ValorItem * item.Quantidade),
                0
            );

            await conn.execute("UPDATE pedidos SET subTotal = ? WHERE id = ?",
                [subtotal, pedidoId]
            );

            await conn.commit();

            return { sucesso: true };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            await conn.execute("DELETE FROM itens_pedidos WHERE pedidoId = ?", [id]);
            const [pedidoResult] = await conn.execute("DELETE FROM pedidos WHERE id = ?", [id]);

            if (pedidoResult.affectedRows === 0) {
                throw new Error("Pedido nao encontrado");
            }

            await conn.commit();

            return { pedidoId: id };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deletarItem: async (id) => {
        const conn = await connection.getConnection();

        try {
            await conn.execute("DELETE FROM itens_pedidos WHERE id = ?", [id]);

        } finally {
            conn.release();
        }
    }

};



export default pedidoRepository;
