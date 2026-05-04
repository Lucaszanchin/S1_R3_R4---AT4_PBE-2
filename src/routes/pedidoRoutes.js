import { Router } from "express";
import pedidoController from "../controllers/pedidoController.js";

const pedidoRoutes = Router();

pedidoRoutes.get('/', pedidoController.listarTudo);
pedidoRoutes.get('/:id', pedidoController.listarPorIDPedido)
pedidoRoutes.post('/', pedidoController.criarPedido);
pedidoRoutes.put("/itens-pedidos/:id", pedidoController.atualizar);
pedidoRoutes.delete('/:id', pedidoController.deletarPedido);
pedidoRoutes.delete("/itens-pedidos/:id", pedidoController.excluirItem);

export default pedidoRoutes;
