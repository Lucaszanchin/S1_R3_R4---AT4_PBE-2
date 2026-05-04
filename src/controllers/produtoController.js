import { Produto } from "../models/Produtos.js";
import produtoRepository from "../repositories/produtoRepository.js";
import axios from "axios";

const produtoController = {

    buscarTodosProdutos: async (req, res) => {
        try {
            const resultado = await produtoRepository.selecionarTodos();

            if (!resultado || resultado.length === 0) {
                return res.status(200).json({ message: 'A tabela não contém dados', data: [] });
            }

            res.status(200).json({ message: 'Dados recebidos', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    buscarProdutoPorID: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const resultado = await produtoRepository.selecionarPorId(id);

            if (!resultado) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }

            return res.status(200).json(resultado);

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar produto', errorMessage: error.message
            });
        }
    },

    incluirProduto: async (req, res) => {
        try {

            const caminhoImagem = req.file ? `uploads/image/${req.file.filename}` : null;
            const { nome, valor, idCategoria } = req.body;

            if (!nome || !valor || !idCategoria) {
                return res.status(400).json({ message: "Campos obrigatórios não informados" });
            }
            const produto = Produto.criar({ nome, valor, idCategoria, caminhoImagem });

            const resultado = await produtoRepository.inserirProduto(produto.nome, produto.valor, produto.idCategoria, produto.caminhoImagem);

            res.status(201).json({ message: 'Produto criado com sucesso', result: resultado });

        } catch (error) {

            console.error(error);
            res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });

        }
    },

    atualizarProduto: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }

            const caminhoImagem = req.file ? `uploads/image/${req.file.filename}`: undefined;
            const {nome, valor, idCategoria} = req.body;
            const produtoAtual = await produtoRepository.selecionarPorId(id);
            if (!produtoAtual) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            const produto = Produto.editar({nome, valor, idCategoria, caminhoImagem}, produtoAtual)
            const resultado = await produtoRepository.atualizarProduto(produto);

            return res.status(200).json({message: "Produto atualizado com sucesso", result: resultado});

        } catch (error) {
            console.error(error);

            return res.status(500).json({message: "Erro no servidor", errorMessage: error.message});
        }
    },

    excluirProduto: async (req, res) => {
        try {

            const id = Number(req.params.id);

            const produto = await produtoRepository.selecionarPorId(id);

            if (!produto) {
                return res.status(404).json({
                    message: 'Produto não encontrado.'
                });
            }

            const exclusao = await produtoRepository.deletarProduto(id);

            res.status(200).json({ message: 'Produto excluído com sucesso', detalhes: exclusao });

        } catch (error) {

            console.error(error);
            res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });

        }
    },

    buscarEnderecoPorCep: async(cep) =>{
    try {
        const cepLimpo = cep.replace("-", "");

        const response = await axios.get(
            `https://viacep.com.br/ws/${cepLimpo}/json/`
        );

        const data = response.data;

        if (data.erro) {
            throw new Error("CEP não encontrado");
        }

        return {
            cep: data.cep,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
        };

    } catch (error) {
        throw new Error("Erro ao buscar endereço");
    }
}

};

export default produtoController;