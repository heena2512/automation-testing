describe('Create a new candidate', () => {
  const candidate = {
    firstName: 'Test',
    lastName: `Candidate ${Date.now()}`,
    email: `test.candidate.${Date.now()}@example.com`,
    phone: '9876543210',
    jobTitle: 'QA Engineer',
  };

  beforeEach(() => {
    cy.visit('https://trackivo.net');

    // Update these selectors/credentials to match your Trackivo login page.
    cy.env('TRACKIVO_EMAIL').then((email) => {
      cy.get('input[name="email"], input[type="email"]').type(email);
    });

    cy.env('TRACKIVO_PASSWORD').then((password) => {
      cy.get('input[name="password"], input[type="password"]').type(password, {
        log: false,
      });
    });

    cy.contains('button, input[type="submit"]', /log in|login|sign in/i).click();

    // Update this assertion to match the page shown after successful login.
    cy.url().should('not.include', 'login');
  });

  it('creates a new candidate', () => {
    // Open Candidates page.
    cy.contains('a, button', /candidates/i).click();

    // Start create flow.
    cy.contains('button, a', /new candidate|add candidate|create candidate/i).click();

    // Fill candidate form. Replace selectors if Trackivo uses different field names.
    cy.get('input[name="firstName"], input[name="first_name"]').type(candidate.firstName);
    cy.get('input[name="lastName"], input[name="last_name"]').type(candidate.lastName);
    cy.get('input[name="email"], input[type="email"]').type(candidate.email);
    cy.get('input[name="phone"], input[type="tel"]').type(candidate.phone);

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
