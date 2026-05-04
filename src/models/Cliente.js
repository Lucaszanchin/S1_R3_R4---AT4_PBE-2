export class Cliente {
    #id;
    #nome;


    constructor(nome, cpf, id = null) {
        this.nome = nome;
        this.cpf = cpf;
        this.id = id;
    }

    get id() { return this.#id; }
    set id(value) {
        if (value !== null && value <= 0) throw new Error("ID inválido");
        this.#id = value;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        if (!value || value.trim().length < 3) throw new Error("Nome inválido");
        this.#nome = value;
    }

}