export class Pedido {
    #id;
    #clienteId;
    #subTotal;
    #status;
    #dataCad;

    // Construtor
    constructor (pClienteId, pSubTotal, pStatus, pId){
        this.#clienteId = pClienteId;
        this.#subTotal = pSubTotal;
        this.#status = pStatus;
        this.#id = pId;
}
    // Getters

    get id() {
        return this.#id
    }

    get clienteId() {
        return this.#clienteId
    }

    get subTotal() {
        return this.#subTotal
    }

    get status() {
        return this.#status
    }
        

    // Setters

    set id(value){
        this.#validarId(value)
        this.#id = value
    }

    set clienteId(value){
        this.#validarClienteId(value)
        this.#clienteId = value
    }

    set subTotal(value){
        this.#validarSubTotal(value)
        this.#subTotal = value
    }

    set status(value){
        this.validarStatus(value)
        this.#status = value
    }

    // Métodos Auxiliares

    #validarId (value){
        if (value && value <= 0){
            throw new Error ("Verifique o Id informado");
        }
    }

    #validarClienteId (value){
        if (value && value <= 0){
            throw new Error ("Verifique o Id do cliente informado");
        }
    }

    #validarSubTotal(value){
        if(!value || value <= 0){
            throw new Error ("Não foi possível obter o subtotal")
        }
    }

    // Design Pattern

    static criar(dados){
        return new Pedido(dados.clienteId, dados.subTotal, dados.status, null);
    }

    static editar(dados, id){
        return new Pedido(dados.clienteId, dados.subTotal, dados.status, id)
    }
}