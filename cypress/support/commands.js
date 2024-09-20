Cypress.Commands.add('loginSuccess', () => {
    cy.visit('http://localhost:8080/#/login'); // home page
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr'); // email 
    cy.get('[data-cy="login-input-password"]').type('testtest'); // password 
    cy.get('[data-cy="login-submit"]').click(); // se connecter btn
    cy.wait(5000)
})