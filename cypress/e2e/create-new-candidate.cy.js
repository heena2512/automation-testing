describe('Create a new candidate', () => {
  const uniqueId = Math.random().toString(36).substring(2, 10).replace(/[0-9]/g, 'a');
  const candidate = {
    firstName: 'Test',
    lastName: `Candidate${uniqueId}`,
    email: `test.candidate.${Date.now()}@example.com`,
    phone: '9876543210',
    jobTitle: 'QA Engineer',
  };

  beforeEach(() => {
    cy.visit('https://dev.trackivo.net/login');

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

    cy.intercept('POST', '**/api/v1/get-visa-type').as('getVisaType');
    cy.intercept('POST', '**/api/v1/get-country').as('getCountry');
    cy.intercept('POST', '**/api/v1/get-skill').as('getSkill');

    cy.wait(5000);

    cy.get('input')
      .eq(0)
      .type(email);

    cy.get('input')
      .eq(1)
      .type(password, { log: false });

    cy.contains('button', 'Sign In')
      .click();

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

    // Wait for page load and take screenshot
    cy.wait(8000);
    cy.screenshot('candidate-form-empty');

    // Fill candidate Personal form
    cy.get('input[name="first_name"]').type(candidate.firstName);
    cy.get('input[name="last_name"]').type(candidate.lastName);
    cy.get('input[name="email"]').type(candidate.email);
    cy.get('input[placeholder="1 (702) 123-4567"]').first().type(candidate.phone);

    // Select Gender
    cy.get('input[name="gender"]').parent().find('.react-select__input').type('Male', { force: true });
    cy.get('.react-select__option').contains('Male').click({ force: true });

    // Select Birthdate
    cy.get('input[placeholder="MM/DD/YYYY"]').eq(0).type('10/10/1995');

    // Select Visa Type
    cy.get('input[name="visa_type"]').parent().find('.react-select__input').type('Citizen Visa', { force: true });
    cy.wait('@getVisaType', { timeout: 10000 });
    cy.get('.react-select__option').contains('Citizen Visa').click({ force: true });

    // Fill address
    cy.get('input[name="current_add1"]').type('123 Main St');
    cy.get('input[name="current_add2"]').type('Apt 4B');
    cy.get('input[name="current_zipcode"]').type('90210');

    // Select Country
    cy.get('input[name="country"]').first().parent().find('.react-select__input').type('United States', { force: true });
    cy.wait('@getCountry', { timeout: 10000 });
    cy.get('.react-select__option').contains('United States Of America').click({ force: true });

    // Wait for State/City to load
    cy.wait(3000);

    // Take screenshot before submit
    cy.screenshot('candidate-step-1-filled');

    // Click Next button
    cy.contains('Next').click({ force: true });

    // Wait and check if we navigated/changed state
    cy.wait(5000);
    cy.screenshot('candidate-after-step-1-submit');

    // Fill Professional details (Step 2)
    cy.get('input[name="current_job_title"]').type(candidate.jobTitle);
    cy.get('input[name="highest_qualification_held"]').type('Bachelor of Science');
    cy.get('input[name="experience_in_years"]').type('5');
    cy.get('input[name="current_salary"]').type('50');
    cy.get('input[name="expected_salary"]').type('60');

    // Select Skill (async react-select)
    cy.get('input[name="skill"]').parent().find('.react-select__input').type('QA', { force: true });
    cy.wait('@getSkill', { timeout: 10000 });
    cy.get('.react-select__option').contains('QA').click({ force: true });

    // Select Workplace Type
    cy.get('input[name="desired_work_place_type"]').parent().find('.react-select__input').type('Remote', { force: true }).wait(500).type('{enter}', { force: true });

    // Select Willing to Relocate
    cy.get('input[name="willing_to_relocate"]').parent().find('.react-select__input').type('No', { force: true }).wait(500).type('{enter}', { force: true });

    // Take screenshot before submitting step 2
    cy.screenshot('candidate-step-2-filled');

    // Click Next to submit step 2
    cy.contains('Next').click({ force: true });

    // Wait and take screenshot of step 3
    cy.wait(5000);
    cy.screenshot('candidate-after-step-2-submit');
  });
});
