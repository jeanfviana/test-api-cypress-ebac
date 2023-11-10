/// <reference types="cypress" />



import produtoData from '../fixtures/produto.data.json'
import contrato from '../contracts/produtos.contracts'

describe('Teste da Funcionalidade Produtos', () => {

    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response =>{
            return contrato.validateAsync(response.body)
        })
    });

    it('Listar Produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then(response => {
            //expect(response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)

        })

    });

    it('Cadastrar produto', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000)}`
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 200,
                "descricao": "Produto novo",
                "quantidade": 500
            },
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })

    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "Produto EBAC 95944", 250, "Descrição do produto novo", 150)
        
        .then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })

        
    });

    it('Deve editar um produto já cadastrado', () => {
        cy.request('produtos').then(response => {
            
            let id = response.body.produtos[1]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body:
                {
                    "nome": "Logitech MX Vertical",
                    "preco": 1251,
                    "descricao": "produto editado2",
                    "quantidade": 180
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
        
    });

    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000)}`
        cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 150)
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body:
                {
                    "nome": produto,
                    "preco": 550,
                    "descricao": "produto editado2",
                    "quantidade": 90
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })

        })
    });


    it('Deve deletar um produto previamente cadastro', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000)}`
        cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 150)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: { authorization: token }
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });

    it('Listar Produtos 2', () => {
        cy.produto_get('GET', 'produtos')
            .then(response => {
                //expect(response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
                expect(response.status).to.equal(200)
                expect(response.body).to.have.property('produtos')
                expect(response.duration).to.be.lessThan(15)

            })

    });

});