describe("Cart Scenarios", () => {
    let initialStock;
    let token;
  
    // Run before each test to get the authentication token
    // beforeEach(() => {
    //     cy.request({
    //         method: 'POST',
    //         url: `/login`,
    //         body: {
    //             username: 'test2@test.fr',
    //             password: 'testtest'
    //         },
    //     }).then((response) => {
    //         expect(response.status).to.equal(200);
    //         token = response.body.token;
    //     });
    // });
  
    // Test case 1: Verify Product Addition to Cart with Stock Check
    it('should verify product addition to cart and stock update', () => {
        cy.loginSuccess().then(() => {
      // Step 1: Navigate to the product page
      cy.intercept({
        method:"GET",
        url:'/products/*'
      })
      .as('getProduct')
      cy.get('.text-header > button').click(); // Open "Our Products" section
      cy.wait(['@getProduct']);
      cy.get(':nth-child(8) > .add-to-cart > [data-cy="product-link"]').click(); // Click to view product details
      cy.wait(['@getProduct']);
 
      // Step 2: Check initial stock
      cy.get('[data-cy="detail-product-stock"]').invoke('text').then((text) => {
        const match = text.match(/^(\d+)/); // Extract the number from stock text
        if (match) {
          initialStock = parseInt(match[0], 10); // Convert to integer
          cy.log('Initial stock: ' + initialStock);
  
          // Ensure the stock is greater than 0
          expect(initialStock).to.be.greaterThan(0);
        }
      });
  
      // Step 3: Add product to cart
      cy.get('[data-cy="detail-product-add"]').click(); // Click "Add to Cart"
      cy.get('[data-cy="nav-link-cart"]').click(); // Go to cart
      cy.wait(4000);
      
      // Step 4: Verify product in cart
      cy.get('#cart-content').should('contain', 'Aurore boréale'); // Verify product name in cart
  
      // Step 5: Return to the product page and check stock update
      cy.get('[data-cy="nav-link-products"]').click(); // Go back to "Our Products"
      cy.get(':nth-child(8) > .add-to-cart > [data-cy="product-link"]').click(); // Revisit the same product
      cy.wait(5000);
  
      cy.get('[data-cy="detail-product-stock"]').invoke('text').then((updatedText) => {
        const updatedMatch = updatedText.match(/^(\d+)/); // Extract the updated stock number
        if (updatedMatch) {
          const updatedStock = parseInt(updatedMatch[0], 10); // Convert to integer
          cy.log('Stock after adding to cart: ' + updatedStock);
  
          // Ensure stock decreased by 1
          expect(updatedStock).to.equal(initialStock - 1);
        }
      });
    });
});
    // Test case 2: Add item to cart and verify via API
    it('should add an item to cart and verify via API', () => {

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
      // Step 1: Visit product page
      cy.visit('/products/10'); // Product page
  
      // Step 2: Add product to cart
      cy.get('[data-cy="detail-product-add"]').click(); // Click "Add to Cart"
  
      // Step 3: Verify cart content via API
      cy.request({
        method: 'GET',
        url: '/orders', // API route to get cart
        headers: {
          Authorization: `Bearer ${token}` // Use the retrieved token
        }
      }).then((response) => {
        // Check response status
        expect(response.status).to.equal(200);
  
        // Check cart content
        const cart = response.body;
        expect(cart.items).to.have.length(1); // Ensure 1 item in cart
        expect(cart.items[0].id).to.eq(10); // Ensure the correct product is added
      });
    });
  
    // Test case 3: Verify that quantity greater than 20 is not allowed
    it('should not allow adding a quantity greater than 20', () => {
      // Step 1: Visit product page
      cy.visit('/#/products/10'); // Product page
  
      // Step 2: Enter an invalid quantity (greater than 20)
      cy.get('[data-cy="detail-product-quantity"]').clear().type('90');
  
      // Step 3: Verify that the "Add to Cart" button is disabled
      cy.get('[data-cy="detail-product-add"]').should('be.disabled');
    });
  
    // Test case 4: Verify that negative quantity is not allowed
    it('should not allow adding a negative quantity', () => {
      // Step 1: Visit product page
      cy.visit('/#/products/10'); // Product page
  
      // Step 2: Enter a negative quantity
      cy.get('[data-cy="detail-product-quantity"]').clear().type('-1');
  
      // Step 3: Verify that the "Add to Cart" button is disabled
      cy.get('[data-cy="detail-product-add"]').should('be.disabled');
    });
  });
  