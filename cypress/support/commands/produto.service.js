

Cypress.Commands.add('produto_get',(metodo, endpoint)=>{
    cy.request({
        method: metodo,
        url: endpoint
    })
})




Cypress.Commands.add('cadastrar_produto_token_autorizado', (metodo, endpoint, massa, token)=>{
    cy.request({
        method: metodo,
        url: endpoint,
        body: massa,
        headers: {authorization: token}
    })
})