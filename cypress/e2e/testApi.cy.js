describe("API Tests", () => {
    let productId = '';
    let notAvailableProductId = '';
    let token;

    it('should return a 403 error when trying to access the cart before logging in', () => {
        cy.request({
            method: 'GET',
            url: `/orders`,
            failOnStatusCode: false
          }).then((response) => { 
            expect(response.status).to.equal(403);
        });
    });

    it('should return a 401 error when trying to login with invalid credentials', () => {
        cy.request({
            method: 'POST',
            url: `/login`,
            body: {
                username: 'wrongtest@test.fr',
                password: 'wrongPassword'
              },
            failOnStatusCode: false
          }).then((response) => { 
            expect(response.status).to.equal(401);
        });
    });

    it('should login successfully with valid credentials', () => {
        cy.request({
            method: 'POST',
            url: `/login`,
            body: {
                username: 'test2@test.fr',
                password: 'testtest'
              },
          }).then((response) => { 
            expect(response.status).to.equal(200);
            token = response.body.token;
        });
    });

    it('should return all available products', () => {
        cy.request({
            method: 'GET',
            url: `/products`,
          }).then((response) => { 
            expect(response.status).to.equal(200);
            productId = response.body[0].id;
            notAvailableProductId = response.body[1].id;
        });
    });

    it('should return the details of a specific product', () => {
        cy.request({
            method: 'GET',
            url: `/products/${productId}`,
          }).then((response) => { 
            expect(response.status).to.equal(200);
            cy.log(response.body)
        });
    });

    it('should add an available product to the cart', () => {
        cy.request({
            method: 'PUT',
            url: `/orders/add`,
            body: {
                product: productId,
                quantity: 4
              },
            headers: {
                Authorization: `Bearer ${token}`
            }
          }).then((response) => { 
            expect(response.status).to.equal(200);
        });
    });

    it('should not add an out-of-stock product to the cart', () => { 
        cy.request({
            method: 'PUT',
            url: `/orders/add`,
            body: {
                product: notAvailableProductId,
                quantity: 7
              },
            headers: {
                Authorization: `Bearer ${token}` 
            },            
            failOnStatusCode: false
          }).then((response) => { 
            expect(response.status).to.equal(400);
        });
    });

    it('should return the list of products in the cart', () => {
        cy.request({
            method: 'GET',
            url: `/orders`,
            headers: {
                Authorization: `Bearer ${token}`
            }
          }).then((response) => { 
            expect(response.status).to.equal(200);
        });
    });

    it('should add a product review', () => {
        cy.request({
            method: 'POST',
            url: `/reviews`,
            body: {
                title: 'test review',
                comment: 'test comment',
                rating: 5
              },
            headers: {
                Authorization: `Bearer ${token}`
            }
          }).then((response) => { 
            expect(response.status).to.equal(200);
        });
    });
});
