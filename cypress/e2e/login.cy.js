describe('Trackivo Login Test', () => {

  it('Should login successfully', () => {

    // Open login page
    cy.visit('https://dev.trackivo.net/login');

    // Wait for load
    cy.wait(5000);

    // Enter Email
    cy.get('input')
      .eq(0)
      .type('heena@silverxis.com');

    // Enter Password
    cy.get('input')
      .eq(1)
      .type('Silverxis@123');

    // Click Sign In
    cy.contains('button', 'Sign In')
      .click();

    // Wait after login
    cy.wait(8000);

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