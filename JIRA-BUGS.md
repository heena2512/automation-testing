# Jira Bug Notes

## Candidate module / Trackivo

- Summary: Candidate creation module should be added to Cypress regression coverage.
- Test file: `cypress/e2e/candidate-module.cy.js`
- Support module: `cypress/support/candidate.js`
- Details: reusable `cy.createCandidate(candidate)` command handles candidate form completion across steps.

## Suggested Jira issue
- Project: JIA or your Jira project key
- Issue type: Bug or Task
- Description:
  1. Log in to `https://dev.trackivo.net/login`
  2. Navigate to `/candidate/add`
  3. Complete candidate personal and professional details
  4. Observe any failure or unexpected validation on submit
- Attach screenshot files from Cypress run, especially `candidate-module-created`.
