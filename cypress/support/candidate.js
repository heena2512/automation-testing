const BASE_URL = Cypress.env('TRACKIVO_URL') || 'https://dev.trackivo.net';

const selectReactOption = (fieldName, optionText) => {
  cy.get(`input[name="${fieldName}"]`)
    .parent()
    .find('.react-select__input')
    .type(optionText, { force: true });

  cy.wait(1000);
  cy.get('.react-select__option').contains(optionText).click({ force: true });
};

Cypress.Commands.add('createCandidate', (candidate) => {
  cy.visit(`${BASE_URL}/candidate/add`);
  cy.location('pathname', { timeout: 20000 }).should('include', '/candidate/add');
  cy.wait(4000);

  cy.get('input[name="first_name"]').clear().type(candidate.firstName);
  cy.get('input[name="last_name"]').clear().type(candidate.lastName);
  cy.get('input[name="email"]').clear().type(candidate.email);
  cy.get('input[placeholder="1 (702) 123-4567"]').first().clear().type(candidate.phone);

  if (candidate.gender) {
    selectReactOption('gender', candidate.gender);
  }

  if (candidate.birthdate) {
    cy.get('input[placeholder="MM/DD/YYYY"]').eq(0).clear().type(candidate.birthdate);
  }

  if (candidate.visaType) {
    selectReactOption('visa_type', candidate.visaType);
  }

  cy.get('input[name="current_add1"]').clear().type(candidate.address1);
  cy.get('input[name="current_add2"]').clear().type(candidate.address2);
  cy.get('input[name="current_zipcode"]').clear().type(candidate.zipcode);

  if (candidate.country) {
    selectReactOption('country', candidate.country);
  }

  cy.wait(3000);
  cy.screenshot('candidate-step-1-filled');
  cy.contains('button', 'Next').click({ force: true });
  cy.wait(4000);

  cy.get('input[name="current_job_title"]').clear().type(candidate.jobTitle);
  cy.get('input[name="highest_qualification_held"]').clear().type(candidate.qualification);
  cy.get('input[name="experience_in_years"]').clear().type(candidate.experience);
  cy.get('input[name="current_salary"]').clear().type(candidate.currentSalary);
  cy.get('input[name="expected_salary"]').clear().type(candidate.expectedSalary);

  if (candidate.skill) {
    selectReactOption('skill', candidate.skill);
  }

  if (candidate.workplaceType) {
    selectReactOption('desired_work_place_type', candidate.workplaceType);
  }

  if (candidate.relocate) {
    selectReactOption('willing_to_relocate', candidate.relocate);
  }

  cy.screenshot('candidate-step-2-filled');
  cy.contains('button', 'Next').click({ force: true });
  cy.wait(5000);
  cy.screenshot('candidate-after-step-2-submit');
});
