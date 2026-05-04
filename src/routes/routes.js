import { Router } from "express";
const routes = Router();
import categoriaRoutes from "./categoriaRoutes.js";
import produtoRoutes from "./produtoRoutes.js";
import clienteRoutes from "./clienteRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";

routes.use('/produtos', produtoRoutes)
routes.use('/categorias', categoriaRoutes)
routes.use('/clientes', clienteRoutes)
routes.use('/pedidos', pedidoRoutes)

export default routes;
