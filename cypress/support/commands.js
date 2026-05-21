// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Custom login command for Trackivo
 * @param {string} email - User email or username
 * @param {string} password - User password
 */
Cypress.Commands.add('login', (email, password) => {
  // Get email/username input field
  cy.get('input[type="email"], input[name*="email"], input[name*="username"], input[id*="email"], input[id*="username"]')
    .should('be.visible')
    .clear()
    .type(email, { delay: 100 });
  
  // Get password input field
  cy.get('input[type="password"]')
    .should('be.visible')
    .clear()
    .type(password, { delay: 100 });
  
  // Click submit button
  cy.get('button[type="submit"]')
    .should('be.visible')
    .click();
  
  // Wait for navigation or loading to complete
  cy.wait(2000);
});

/**
 * Custom logout command for Trackivo
 */
Cypress.Commands.add('logout', () => {
  // Try multiple selectors for logout button
  cy.get('body').then(($body) => {
    if ($body.find('button[aria-label*="logout"]').length) {
      cy.get('button[aria-label*="logout"]').click();
    } else if ($body.find('a:contains("Logout")').length) {
      cy.contains('a', 'Logout').click();
    } else if ($body.find('button:contains("Logout")').length) {
      cy.contains('button', 'Logout').click();
    }
  });
  
  // Verify redirected to login
  cy.url().should('include', '/login');
});

/**
 * Custom command to fill login form with validation
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Check remember me checkbox
 */
Cypress.Commands.add('fillLoginForm', (email, password, rememberMe = false) => {
  // Fill email
  cy.get('input[type="email"], input[name*="email"], input[name*="username"]')
    .clear()
    .type(email);
  
  // Fill password
  cy.get('input[type="password"]')
    .clear()
    .type(password);
  
  // Check remember me if requested
  if (rememberMe) {
    cy.get('input[type="checkbox"]').check({ force: true });
  }
});
