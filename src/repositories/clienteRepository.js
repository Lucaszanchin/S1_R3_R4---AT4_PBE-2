import { connection } from "../configs/Database.js";

const clienteRepository = {

    async selecionarTodos() {
        const conn = await connection.getConnection();

        try {
            const sql = `SELECT c.id AS id, c.nome, c.cpf, c.dataCad, t.telefone, e.cep, e.complemento, e.bairro, e.numero, e.uf, e.cidade, e.rua FROM clientes c INNER JOIN telefones t ON c.id = t.idCliente INNER JOIN enderecos e ON c.id = e.idCliente;`;
            const [rows] = await conn.execute(sql);
            return rows;

        } finally {
            conn.release();
        }
    },

    async selecionarPorId(id) {
        const conn = await connection.getConnection();

        try {
            const sql = `SELECT c.id, c.nome, c.cpf, c.dataCad, t.telefone, e.cidade, e.uf, e.bairro, e.rua, e.numero AS numero_endereco, e.complemento, e.cep FROM clientes c LEFT JOIN telefones t ON c.id = t.idCliente LEFT JOIN enderecos e ON c.id = e.idCliente WHERE c.id = ? `;
            const [rows] = await conn.execute(sql, [id]);
            return rows[0]

        } finally {
            conn.release();
        }
    },

    async inserirCliente(cliente, telefone, endereco) {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();
            const [clienteResult] = await conn.execute("INSERT INTO clientes (nome, cpf) VALUES (?,?)", [cliente.nome, cliente.cpf]);
            const idCliente = clienteResult.insertId;
            await conn.execute("INSERT INTO telefones (telefone, idCliente) VALUES (?,?)", [telefone.numero, idCliente]);
            await conn.execute(`INSERT INTO enderecos (cidade, uf, bairro, rua, numero, complemento, cep, idCliente)VALUES (?,?,?,?,?,?,?,?)`,
                [endereco.cidade, endereco.uf, endereco.bairro, endereco.rua, endereco.numero,endereco.complemento, endereco.cep, idCliente]
            );

            await conn.commit();
            return { idCliente };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    async atualizarCliente(cliente, telefone, endereco) {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();
            const [resultCliente] = await conn.execute("UPDATE clientes SET nome=?, cpf=? WHERE id=?", [cliente.nome, cliente.cpf, cliente.id]);

            if (resultCliente.affectedRows === 0) {
                throw new Error("Cliente não encontrado para atualização");
            }

            if (telefone) {
                await conn.execute("UPDATE telefones SET numero=? WHERE idCliente=?", [telefone.numero, cliente.id]);
            }

            if (endereco) {
                await conn.execute(`UPDATE enderecos SET cidade=?, uf=?, bairro=?, rua=?, numero=?, complemento=?, cep=? WHERE idCliente=?`,
                    [endereco.cidade, endereco.uf, endereco.bairro, endereco.rua, endereco.numero, endereco.complemento, endereco.cep, cliente.id]
                );
            }

            await conn.commit();
            return { message: "Atualizado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    
    async deletarCliente(id) {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();
            await conn.execute("DELETE FROM telefones WHERE idCliente=?", [id]);
            await conn.execute("DELETE FROM enderecos WHERE idCliente=?", [id]);
            const [result] = await conn.execute("DELETE FROM clientes WHERE id=?", [id]);

            if (result.affectedRows === 0) {
                throw new Error("Cliente não encontrado");
            }

            await conn.commit();
            return { message: "Deletado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};

export default clienteRepository;