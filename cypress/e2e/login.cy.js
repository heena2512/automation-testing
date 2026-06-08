describe('Trackivo Login Test', () => {

  it('Should login successfully', () => {
    const email = Cypress.env('TRACKIVO_EMAIL');
    const password = Cypress.env('TRACKIVO_PASSWORD');

    if (!email || !password) {
      throw new Error(
        'Missing TRACKIVO_EMAIL or TRACKIVO_PASSWORD. Set them in cypress.env.json.'
      );
    }

    // Open login page
    cy.visit('https://dev.trackivo.net/login');

    cy.intercept('POST', '**/api/v1/login', (req) => {
      const requestBody =
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      req.body = {
        ...requestBody,
        device_os_version: 'cypress-test-device',
        device_id: 'cypress-test-device',
        fcm_token: 'NA',
        device_model: 'Cypress',
        device_type: 'W',
        app_code: '1.0.0',
      };
    }).as('loginRequest');

    // Wait for load
    cy.wait(5000);

    // Enter Email
    cy.get('input')
      .eq(0)
      .type(email);

    // Enter Password
    cy.get('input')
      .eq(1)
      .type(password, { log: false });

    // Click Sign In
    cy.contains('button', 'Sign In')
      .click();

    cy.wait('@loginRequest', { timeout: 20000 })
      .then(({ response }) => {
        expect(response.statusCode).to.be.oneOf([200, 201]);
        expect(response.body, response.body.message).to.have.property('status', true);
      });

    cy.location('pathname', { timeout: 20000 }).should('not.include', 'login');

    // Debug current URL
    cy.url().then((url) => {

      cy.log(url);

    });

    // Check localStorage
    cy.window().then((win) => {

      console.log(win.localStorage);

    });

  });

});
