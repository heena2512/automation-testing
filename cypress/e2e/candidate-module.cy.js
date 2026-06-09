describe('Candidate module', () => {
  const baseUrl = Cypress.env('TRACKIVO_URL') || 'https://dev.trackivo.net';
  const uniqueId = Math.random().toString(36).substring(2, 10).replace(/[0-9]/g, 'a');

  const candidate = {
    firstName: 'Test',
    lastName: `Candidate${uniqueId}`,
    email: `test.candidate.${Date.now()}@example.com`,
    phone: '9876543210',
    gender: 'Male',
    birthdate: '10/10/1995',
    visaType: 'Citizen Visa',
    address1: '123 Main St',
    address2: 'Apt 4B',
    zipcode: '90210',
    country: 'United States Of America',
    jobTitle: 'QA Engineer',
    qualification: 'Bachelor of Science',
    experience: '5',
    currentSalary: '50',
    expectedSalary: '60',
    skill: 'QA',
    workplaceType: 'Remote',
    relocate: 'No',
  };

  beforeEach(() => {
    const email = Cypress.env('TRACKIVO_EMAIL');
    const password = Cypress.env('TRACKIVO_PASSWORD');

    if (!email || !password) {
      throw new Error(
        'Missing TRACKIVO_EMAIL or TRACKIVO_PASSWORD. Set them in cypress.env.json.'
      );
    }

    cy.visit(`${baseUrl}/login`);

    cy.get('input').eq(0).type(email);
    cy.get('input').eq(1).type(password, { log: false });
    cy.contains('button', 'Sign In').click();
    cy.location('pathname', { timeout: 20000 }).should('not.include', 'login');
  });

  it('creates a new candidate using the candidate module', () => {
    cy.intercept('POST', '**/api/v1/get-visa-type').as('getVisaType');
    cy.intercept('POST', '**/api/v1/get-country').as('getCountry');
    cy.intercept('POST', '**/api/v1/get-skill').as('getSkill');

    cy.createCandidate(candidate);

    cy.screenshot('candidate-module-created');
  });
});
