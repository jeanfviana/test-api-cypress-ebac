/// <reference types="cypress" />

describe('Login - Teste de API ServRest', () => {
    it('Deve fazer login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'login',
            body: {
                "email": "fulano@qa.com",
                "password": "teste"
            }
        }).then((response) =>{
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)

        })
    });

    it('Deve listar usuarios', () => {
        cy.request({
            method: 'GET',
            url:'usuarios'
        }).then((response) =>{
            expect(response.status).to.equal(200)

        })
    });
});