/// <reference types="cypress" />

describe('ClockOut', () => {
  it('ClockOut', () => {
    cy.visit('https://live.timeclock365.com/login');
    cy.get('input[placeholder="Username"]').type(Cypress.env('USERNAME'));
    cy.get('.login-page__submit').click();
    cy.get('input[placeholder="Password"]').type(Cypress.env('PASSWORD'));
    cy.get('.login-page__submit').click();

    cy.contains('.dashboard-punch__punch-btn', 'Punch out').click();
    cy.contains(
      '.base-modal__button',
      'Yes, pause the task and punch out'
    ).click();
  });
});
