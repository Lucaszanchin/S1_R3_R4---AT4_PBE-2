import clienteRepository from "../repositories/clienteRepository.js";
import { Cliente } from "../models/Cliente.js";
import { validarCPF } from "../utils/validarCpf.js"
import { limparNumero } from "../utils/limparNumero.js"
import { Telefone } from "../models/Telefone.js";
import { Endereco } from "../models/Endereco.js";
import axios from "axios";

const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (data.erro) throw new Error("CEP não encontrado");

    return data;
};

const clienteController = {

    async criar(req, res) {
        try {
            const { cliente, telefone, endereco } = req.body;
            const cpfLimpo = limparNumero(cliente.cpf);

            if (!validarCPF(cpfLimpo)) {
                return res.status(400).json({ error: "CPF inválido" });
            }

            const novoCliente = new Cliente(cliente.nome, cpfLimpo);
            const cep = await buscarCep(endereco.cep);
            const telefoneLimpo = limparNumero(telefone.numero);
            const novoTelefone = new Telefone(telefoneLimpo);
            const novoEndereco = new Endereco(cep.localidade, cep.uf, cep.bairro, cep.logradouro, endereco.numero, endereco.complemento, cep.cep);
            const result = await clienteRepository.inserirCliente(novoCliente, novoTelefone, novoEndereco);

            return res.status(201).json({ message: "Cliente criado com sucesso", data: result });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async listar(req, res) {
        try {
            const data = await clienteRepository.selecionarTodos();

            return res.json(data);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async buscarPorId(req, res) {
        try {
            const id = Number(req.params.id);
            const data = await clienteRepository.selecionarPorId(id);

            return res.json(data);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async atualizar(req, res) {
        try {
            const id = Number(req.params.id);
            const { cliente, telefone, endereco } = req.body;

            const clienteObj = new Cliente(cliente.nome, cliente.cpf, id);

            let telObj = null;
            if (telefone?.numero) {
                telObj = new Telefone(telefone.numero, id);
            }

            let endObj = null;
            if (endereco?.cep) {
                const cep = await buscarCep(endereco.cep);

                endObj = new Endereco(cep.localidade, cep.uf, cep.bairro, cep.logradouro, endereco.numero, endereco.complemento, cep.cep);
            }

            await clienteRepository.atualizarCliente(clienteObj, telObj, endObj);

            return res.json({ message: "Atualizado com sucesso" });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deletar(req, res) {
        try {
            const id = Number(req.params.id);
            await clienteRepository.deletarCliente(id);

            return res.json({ message: "Deletado com sucesso" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export default clienteController;