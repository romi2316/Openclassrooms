
/// <reference types="cypress" />

describe("Smoke test", () => {
    it('vérifier la présence des champs et boutons de connexion', () => {
        cy.visit('http://localhost:8080/'); // home page
        cy.get('[data-cy="nav-link-login"]').click() //connexion navbar btn
        cy.url('http://localhost:8080/#/login').should('exist')
        cy.get('[data-cy="login-input-username"]').should('exist'); // email 
        cy.get('[data-cy="login-input-password"]').should('exist'); // password 
        cy.get('[data-cy="login-submit"]').should('exist'); // se connecter btn
        cy.get('[data-cy="nav-link-register"]').should('exist') //Inscription btn
})

it('vérifiez la présence des boutons d’ajout au panier quand je suis connecté', () => {
    cy.loginSuccess().then(() => {
    cy.get('.text-header > button').click() //Nos produit btn
    cy.url().should('include', 'http://localhost:8080/#/products');
    cy.get(':nth-child(1) > .add-to-cart > [data-cy="product-link"]').click() //consulter btn 
    cy.get('[data-cy="detail-product-add"]').should('exist') //ajouter au panier btn
})
})
it('vérifiez la présence du champ de disponibilité du produit', () => {
    cy.loginSuccess().then(() => {
    cy.get('.text-header > button').click() //Nos produit btn
    cy.get(':nth-child(1) > .add-to-cart > [data-cy="product-link"]').click() //consulter btn 
    cy.get('[data-cy="detail-product-stock"]').should('exist')// champs disponibilité
})
})
})
