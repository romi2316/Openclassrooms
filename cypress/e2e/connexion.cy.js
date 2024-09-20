
describe("Connexion scénario", () => {
    it('should successfully login and display the cart button', () => {
        cy.visit('http://localhost:8080/'); // home page
        cy.get('[data-cy="nav-link-login"]').click() //connexion navbar btn
        cy.url('http://localhost:8080/#/login').should('exist')
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr'); // email 
        cy.get('[data-cy="login-input-password"]').type('testtest'); // password 
        cy.get('[data-cy="login-submit"]').click() // se connecter btn
        .then(() => {
        cy.get('[data-cy="nav-link-cart"]').should('exist')
})
})
})