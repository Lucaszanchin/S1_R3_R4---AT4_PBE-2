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


    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { clienteId, status, itens } = req.body;

            if (!id) {
                return res.status(400).json({sucesso: false, mensagem: "ID do pedido é obrigatório"});
            }

            const pedido = new Pedido(clienteId, 0, status, id);

            const itensMapeados = itens.map(i =>
                new ItensPedido(
                    i.pedidoId || id,
                    i.produtoId,
                    i.quantidade,
                    i.valorItem,
                    i.id || null
                )
            );

            await pedidoRepository.atualizarPedidoComItens(pedido, itensMapeados);

            return res.json({sucesso: true, mensagem: "Pedido atualizado com sucesso"});

        } catch (error) {
            return res.status(500).json({sucesso: false, mensagem: "Erro no servidor", error: error.message
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

            return res.status(200).json({sucesso: true, mensagem: "Item removido com sucesso"});

        } catch (erro) {
            return res.status(500).json({sucesso: false, mensagem: "Erro ao excluir item", error: erro.message});
        }
    }
};

export default pedidoController;
