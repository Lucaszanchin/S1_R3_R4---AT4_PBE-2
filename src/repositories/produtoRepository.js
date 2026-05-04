import { connection } from "../configs/Database.js";

const produtoRepository = {

    selecionarTodos: async () => {
        const sql = `SELECT p.id, p.nome, p.valor, p.caminhoImagem, p.idCategoria, c.nome AS categoria FROM produtos p INNER JOIN categorias c ON p.idCategoria = c.id`;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = ` SELECT p.id, p.nome, p.valor, p.caminhoImagem, p.idCategoria, c.nome AS categoria FROM produtos p INNER JOIN categorias c ON p.idCategoria = c.id WHERE p.id = ?`;
        const [rows] = await connection.execute(sql, [id]);
        return rows[0]; 
    },


    inserirProduto: async (nome, valor, idCategoria, imagem) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const sql = `INSERT INTO produtos (nome, valor, caminhoImagem, idCategoria) VALUES (?, ?, ?, ?)`;

            const values = [
                 nome,
                valor,
                imagem ?? null,
                idCategoria
            ];

            const [result] = await conn.execute(sql, values);

            await conn.commit();

            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    atualizarProduto: async (produto) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const sql = `UPDATE produtos SET nome = ?, valor = ?, caminhoImagem = ?, idCategoria = ? WHERE id = ?`;

            const values = [
                produto.nome,
                produto.valor,
                produto.caminhoImagem,
                produto.idCategoria,
                produto.id
            ];

            const [result] = await conn.execute(sql, values);

            await conn.commit();

            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },


    deletarProduto: async (id) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const sql = `DELETE FROM produtos WHERE id = ?`;

            const [result] = await conn.execute(sql, [id]);

            await conn.commit();

            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

};

export default produtoRepository;