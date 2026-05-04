import { Router } from "express";
import pedidoController from "../controllers/pedidoController.js";

const pedidoRoutes = Router();

pedidoRoutes.get('/', pedidoController.listarTudo);
pedidoRoutes.get('/:id', pedidoController.listarPorIDPedido)
pedidoRoutes.post('/', pedidoController.criarPedido);
pedidoRoutes.put('/:id', pedidoController.atualizarPedido);
pedidoRoutes.delete('/:id', pedidoController.deletarPedido);
pedidoRoutes.delete("/itens-pedidos/:id", pedidoController.excluirItem);
pedidoRoutes.post("/itens-pedido", pedidoController.adicionarItem);

export default pedidoRoutes;
