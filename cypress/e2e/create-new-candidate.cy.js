describe('Create a new candidate', () => {
  const candidate = {
    firstName: 'Test',
    lastName: `Candidate ${Date.now()}`,
    email: `test.candidate.${Date.now()}@example.com`,
    phone: '9876543210',
    jobTitle: 'QA Engineer',
  };

  beforeEach(() => {
    cy.visit('https://dev.trackivo.net');

    const email = Cypress.env('TRACKIVO_EMAIL');
    const password = Cypress.env('TRACKIVO_PASSWORD');

    if (!email || !password) {
      throw new Error(
        'Missing TRACKIVO_EMAIL or TRACKIVO_PASSWORD. Set them before running Cypress.'
      );
    }

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

    cy.get('input[name="email"], input[type="email"]').type(email);
    cy.get('input[name="password"], input[type="password"]').type(password, {
      log: false,
    });

    cy.contains('button, input[type="submit"]', /log in|login|sign in/i).click();

    cy.wait('@loginRequest', { timeout: 20000 })
      .then(({ response }) => {
        expect(response.statusCode).to.be.oneOf([200, 201]);
        expect(response.body, response.body.message).to.have.property('status', true);
      });

    cy.location('pathname', { timeout: 20000 }).should('not.include', 'login');
  });

  it('creates a new candidate', () => {
    cy.visit('https://dev.trackivo.net/candidate/add');
    cy.location('pathname', { timeout: 20000 }).should('include', '/candidate/add');

    // Fill candidate form. Replace selectors if Trackivo uses different field names.
    cy.get('input[name="firstName"], input[name="first_name"]').type(candidate.firstName);
    cy.get('input[name="lastName"], input[name="last_name"]').type(candidate.lastName);
    cy.get('input[name="email"], input[type="email"]').type(candidate.email);
    cy.get('input[name="phone"], input[type="tel"]').type(candidate.phone);
    cy.get('input[name="gender"][value="Male"], input[name="Gender"][value="Female"]').check();
    cy.get('input[name="Birthdate"], input[name="date"]').type('MM/DD/YYYY');
    cy.get('input[name="Visa Type"], input[name="visa_type"]').type('Citizen, Green Card, H1B, etc.');

    cy.get('input[name="jobTitle"], input[name="job_title"], input[name="position"]').
      first()
      .type(candidate.jobTitle);

    // Save candidate.
    cy.contains('button', /save|create|submit/i).click();

    // Verify candidate was created.
    cy.contains(/candidate created|successfully created|created successfully/i).should('be.visible');
    cy.contains(`${candidate.firstName} ${candidate.lastName}`).should('be.visible');
    cy.contains(candidate.email).should('be.visible');
  });
});
