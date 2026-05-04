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

    async atualizarPedido(pedido) {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const pedidoId = pedido.id;

            const [itensAtuais] = await conn.execute("SELECT * FROM itens_pedidos WHERE PedidoId = ?", [pedidoId]);

            const itensEnviados = pedido.itens;

            const mapaAtuais = new Map();
            itensAtuais.forEach(item => {
                mapaAtuais.set(item.Id, item);
            });

            const inserir = [];
            const atualizar = [];
            const excluir = [];

            itensEnviados.forEach(item => {
                if (item.id) {
                    if (mapaAtuais.has(item.id)) {
                        atualizar.push(item);
                        mapaAtuais.delete(item.id);
                    }
                } else {
                    inserir.push(item);
                }
            });

            mapaAtuais.forEach(item => {
                excluir.push(item);
            });

            for (const item of inserir) {
                await conn.execute(`INSERT INTO itens_pedidos (PedidoId, ProdutoId, Quantidade, ValorItem) VALUES (?, ?, ?, ?)`,
                    [pedidoId, item.produtoId, item.quantidade, item.valorItem]
                );
            }

            for (const item of atualizar) {
                await conn.execute(`UPDATE itens_pedidosSET ProdutoId = ?, Quantidade = ?, ValorItem = ? WHERE Id = ?`,
                    [item.produtoId, item.quantidade, item.valorItem, item.id]);
            }


            for (const item of excluir) {
                await conn.execute("DELETE FROM itens_pedidos WHERE Id = ?", [item.Id]
                );
            }

            const [resultado] = await conn.execute(`SELECT SUM(Quantidade * ValorItem) AS total FROM itens_pedidos WHERE PedidoId = ?`,
                [pedidoId]
            );

            const total = resultado[0].total || 0;

            await conn.execute("UPDATE pedidos SET ValorTotal = ? WHERE Id = ?",
                [total, pedidoId]
            );

            await conn.commit();

            return {
                sucesso: true,
                total
            };

        } catch (erro) {
            await conn.rollback();
            throw erro;
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


    atualizarItem: async (item) => {
        const conn = await connection.getConnection();

        try {
            await conn.execute(
                "UPDATE itens_pedidos SET ProdutoId = ?, Quantidade = ?, ValorItem = ? WHERE id = ?",
                [item.produtoId, item.quantidade, item.valorItem, item.id]
            );

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
    },

    recalcularSubtotal: async (pedidoId) => {
        const conn = await connection.getConnection();

        try {
            const [rows] = await conn.execute(
                "SELECT quantidade, valorItem FROM itens_pedidos WHERE pedidoId = ?",
                [pedidoId]
            );

            const itens = rows.map(row =>
                new ItensPedido(pedidoId, null, row.quantidade, row.valorItem, null)
            );

            const subTotal = ItensPedido.calcularSubTotal(itens);
            await conn.execute(
                "UPDATE pedidos SET subTotal = ? WHERE id = ?",
                [subTotal, pedidoId]
            );

            return subTotal;

        } finally {
            conn.release();
        }
    }

};



export default pedidoRepository;
