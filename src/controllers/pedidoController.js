import { Pedido } from '../models/Pedidos.js';
import { ItensPedido } from '../models/ItensPedido.js';
import pedidoRepository from '../repositories/pedidoRepository.js';
import { STATUS } from '../enum/statusPedido.js';

const pedidoController = {

    criarPedido: async (req, res) => {
        try {
            let { clienteId, itens } = req.body;

            const itensPedido = itens.map(item =>
                ItensPedido.criar({ produtoId: item.produtoId, quantidade: item.quantidade, valorItem: item.valorItem }))

            const SubTotalItens = ItensPedido.calcularSubTotal(itensPedido);
            const pedido = Pedido.criar({ clienteId, subTotal: SubTotalItens, status: STATUS.ABERTO });

            const result = await pedidoRepository.criar(pedido, itensPedido);

            res.status(201).json({ sucesso: true, mensagem: 'Pedido criado com sucesso', dados: result });

        } catch (error) {
            console.log(error);

            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    async adicionarItem(req, res) {
        try {
            const item = req.body;

            if (!item.pedidoId || !item.produtoId || !item.quantidade || !item.valorItem) {
                return res.status(400).json({sucesso: false, mensagem: "Dados do item inválidos"
                });
            }

            const resultado = await pedidoRepository.adicionarItem(item);

            return res.status(201).json({sucesso: true, mensagem: "Item adicionado com sucesso", total: resultado.total});

        } catch (erro) {
            return res.status(500).json({sucesso: false, mensagem: "Erro ao adicionar item", error: erro.message
});
        }
    },

    listarTudo: async (req, res) => {
        try {
            const result = await pedidoRepository.listar();

            res.status(200).json({ sucesso: true, dados: result });

        } catch (error) {
            console.log(error);

            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    listarPorIDPedido: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await pedidoRepository.buscarPorId(id);

            res.status(200).json({ sucesso: true, dados: result });

        } catch (error) {
            console.log(error);

            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },


    async atualizarPedido(req, res) {
        try {
            const pedido = req.body;

            if (!pedido.id) {
                return res.status(400).json({ sucesso: false, mensagem: "Id do pedido é obrigatório" });
            }

            if (!pedido.itens || !Array.isArray(pedido.itens)) {
                return res.status(400).json({ sucesso: false, mensagem: "Itens do pedido são obrigatórios" });
            }

            for (const item of pedido.itens) {
                if (!item.produtoId || !item.quantidade || !item.valorItem) {
                    return res.status(400).json({ sucesso: false, mensagem: "Itens inválidos" });
                }
            }

            const resultado = await pedidoRepository.atualizarPedido(pedido);

            return res.status(200).json({
                sucesso: true, mensagem: "Pedido atualizado com sucesso", total: resultado.total
            });

        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                sucesso: false, mensagem: "Erro no servidor", error: erro.message
            });
        }
    },

    deletarPedido: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const result = await pedidoRepository.deletarItem(id);

            res.status(200).json({ sucesso: true, mensagem: 'Pedido deletado com sucesso', dados: result });

        } catch (error) {
            console.log(error);

            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    async excluirItem(req, res) {
        try {
            const { id } = req.params;

            await pedidoRepository.deletarItem(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: "Item removido com sucesso"
            });

        } catch (erro) {
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao excluir item",
                error: erro.message
            });
        }
    }

};

export default pedidoController;
