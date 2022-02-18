import { user_1, user_2 } from '../../../unit/mocks/mocked_user'
import { selectorify, split_percentage, sum_amount, to_currency_display, uuidgen } from '@/utils/utils'

describe('Test US Input Tx Information 1', function () {
  beforeEach(function () {
    cy.login(1)
    cy.visit('room/!HJKUpUGgHFoSoqWlCj:dsn.tm.kit.edu')
    cy.wait(5000)
  })
  it('Input Tx info', function () {
    const random_tx_name = uuidgen().substring(0, 7)
    cy.get('#createButton').click()
      .then(() => {
        cy.wait(1000)
        cy.get('#input-description').type(random_tx_name)
        cy.wait(1000)
        cy.get('#input-amount').type('20')
        cy.wait(1000)
        cy.get('#select-member').select(user_1.displayname)
        cy.wait(1000)
        cy.get('#split_button').click()
          .then(() => {
            cy.get(`#split-checkbox${selectorify(user_1.user_id)}`).click()
            cy.wait(1000)
            cy.get(`#split-checkbox${selectorify(user_2.user_id)}`).click()
            cy.wait(1000)
            cy.get('#default-split').click()
            cy.wait(1000)
            cy.get('#split_create_save').click()
              .then(() => {
                cy.wait(3000)
                cy.get('#create-confirm').click()
                  .then(() => {
                    cy.wait(3000)
                    cy.get('.mb-5').children().last().get('.card').get('.card-body')
                      .get('.row').eq(2)
                      .within(() => {
                        cy.get('p').contains(random_tx_name)
                      })
                  })
              })
          })
      })
  })
  it('Test empty error', function () {
    cy.get('#createButton').click()
      .then(() => {
        cy.wait(1000)
        cy.get('#input-amount').type('20')
        cy.wait(1000)
        cy.get('#select-member').select(user_1.displayname)
        cy.wait(1000)
        cy.get('#split_button').click()
          .then(() => {
            cy.get('.alert').contains('Description cannot be empty')
          })
      })
  })
  it('Test number error', function () {
    const random_tx_name = uuidgen().substring(0, 7)
    cy.get('#createButton').click()
      .then(() => {
        cy.get('#input-description').type(random_tx_name)
        cy.wait(1000)
        cy.wait(1000)
        cy.get('#input-amount').type('sadsad')
        cy.wait(1000)
        cy.get('#select-member').select(user_1.displayname)
        cy.wait(1000)
        cy.get('#split_button').click()
          .then(() => {
            cy.get('.alert').contains('Amount has to be a positive number')
          })
      })
  })
  it('Test did not select payer error', function () {
    const random_tx_name = uuidgen().substring(0, 7)
    cy.get('#createButton').click()
      .then(() => {
        cy.get('#input-description').type(random_tx_name)
        cy.wait(1000)
        cy.wait(1000)
        cy.get('#input-amount').type('sadsad')
        cy.wait(1000)
        cy.get('#split_button').click()
          .then(() => {
            cy.get('.alert').contains('You have to select a payer!')
          })
      })
  })
})