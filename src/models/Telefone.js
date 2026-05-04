export class Telefone {
    #id;
    #numero;

    constructor(numero, clienteId, id = null) {
        this.numero = numero;
        this.clienteId = clienteId;
        this.id = id;
    }

    get id() { return this.#id; }
    set id(value) {
        if (value !== null && value <= 0) throw new Error("ID inválido");
        this.#id = value;
    }

    get numero() { return this.#numero; }
    set numero(value) {
        if (!value || value.length < 8) throw new Error("Telefone inválido");
        this.#numero = value;
    }

}
