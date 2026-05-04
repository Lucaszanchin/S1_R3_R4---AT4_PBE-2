export class Endereco {
    #id;
    #cidade;
    #uf;
    #bairro;
    #rua;
    #numero;
    #complemento;
    #cep;

    constructor(cidade, uf, bairro, rua, numero, complemento, cep, clienteId = null, id = null) {
        this.cidade = cidade;
        this.uf = uf;
        this.bairro = bairro;
        this.rua = rua;
        this.numero = numero;
        this.complemento = complemento;
        this.cep = cep;
        this.id = id;
    }

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get cidade() { return this.#cidade; }
    set cidade(value) { this.#cidade = value; }

    get uf() { return this.#uf; }
    set uf(value) { this.#uf = value; }

    get bairro() { return this.#bairro; }
    set bairro(value) { this.#bairro = value; }

    get rua() { return this.#rua; }
    set rua(value) { this.#rua = value; }

    get numero() { return this.#numero; }
    set numero(value) { this.#numero = value; }

    get complemento() { return this.#complemento; }
    set complemento(value) { this.#complemento = value; }

    get cep() { return this.#cep; }
    set cep(value) { this.#cep = value; }

}