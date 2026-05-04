export class ItensPedido {
    #id;
    #pedidoId;
    #produtoId;
    #quantidade;
    #valorItem;

    // Construtor
    constructor (pPedidoId, pProdutoId, pQuantidade, pValorItem,pId){
        this.#pedidoId = pPedidoId;
        this.#produtoId = pProdutoId;
        this.#quantidade = pQuantidade;
        this.#valorItem = pValorItem
        this.#id = pId;
}
    // Getters

    get id() {
        return this.#id
    }

    get pedidoId() {
        return this.#pedidoId
    }

    get produtoId() {
        return this.#produtoId
    }

    get quantidade() {
        return this.#quantidade
    }

    get valorItem(){
        return this.#valorItem
    }
        
    // Setters

    set id(value){
        this.#validarId(value)
        this.#id = value
    }

    set pedidoId(value){
        this.#validarPedidoId(value)
        this.#pedidoId = value
    }

    set produtoId(value){
        this.#validarProdutoId(value)
        this.#produtoId = value
    }

    set quantidade(value){
        this.#validarQuantidade(value)
        this.#quantidade = value
    }

    set valorItem(value){
        this.#validarValorItem(value)
        this.#valorItem = value
    }

    // Métodos Auxiliares

    #validarId (value){
        if (value && value <= 0){
            throw new Error ("Verifique o Id informado");
        }
    }

    #validarPedidoId (value){
        if (value && value <= 0){
            throw new Error ("Verifique o Id do pedido informado");
        }
    }

    #validarProdutoId (value){
        if (value && value <= 0){
            throw new Error ("Verifique o Id do produto informado");
        }
    }

    #validarQuantidade (value){
        if (!value || value <= 0)
            throw new Error ("Não foi possível obter a quantidade")
    }

    #validarValorItem(value){
        if(!value || value <= 0){
            throw new Error ("Informe o valor para o item")
        }
    }

    // Design Pattern

    static calcularSubTotal(itens){
        return (itens.reduce(
            (total, item) => total + (item.valorItem * item.quantidade), 0
        ))
    }

    static criar(dados){
        return new ItensPedido(dados.pedidoId, dados.produtoId, dados.quantidade, dados.valorItem, null);
    }

    static editar(dados, id){
        return new ItensPedido(dados.pedidoId, dados.produtoId, dados.quantidade, dados.valorItem, id)
    }
}
