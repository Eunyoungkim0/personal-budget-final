/// <reference types="cypress" />
import addMatchImageSnapshotCommand  from 'cypress-visual-regression';
addMatchImageSnapshotCommand();

// login e2e test and visual regression test
describe('testing login page', () => {
  beforeEach(() => {
    cy.visit('http://162.243.187.137/login')
  })

  it('displays login title', () => {
    cy.get('#login-title').should('have.text', 'Login')
    cy.matchImageSnapshot('Login_Title');
  })

  it('logs in with valid credentials', () => {
    const userId = 'eun02k';
    const password = '123';

    cy.get('#userId').type(userId)
    cy.get('#password').type(password)

    cy.get('#login').click()

    cy.url().should('include', '/')
    cy.matchImageSnapshot('Successful_Login');
  })

  it('displays alert for empty userId and password', () => {
    cy.get('#login').click()

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please enter user ID.')
    })

    cy.get('#userId').type('someUserId')
    cy.get('#login').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please enter password.')
    })
    cy.matchImageSnapshot('Empty_UserID_Password_Alert');
  })

})
