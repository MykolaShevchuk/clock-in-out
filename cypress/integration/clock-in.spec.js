/// <reference types="cypress" />

describe('ClockIn', () => {
  it('ClockIn', () => {
    cy.visit('https://live.timeclock365.com/login');
    cy.get('input[placeholder="Username"]').type(Cypress.env('USERNAME'));
    cy.get('.login-page__submit').click();
    cy.get('input[placeholder="Password"]').type(Cypress.env('PASSWORD'));
    cy.get('.login-page__submit').click();

    cy.contains('.dashboard-location-type__type', 'Home').click();
    cy.contains('button.dashboard-punch__punch-btn', 'Punch in').click();
    cy.get('.dashboard-select__select').select('31288');

    cy.contains('.dashboard-select__text', 'R&D').should('exist');
    cy.contains('.base-modal__button', 'Punch in and start task').click();
  });
});
