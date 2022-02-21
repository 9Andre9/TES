import { selectorify, uuidgen } from '@/utils/utils'
import { user_1, user_2 } from '../../../unit/mocks/mocked_user'

xdescribe('Test Permission Management', function () {
  beforeEach(function () {
    cy.login(1)
    cy.visit('room/!nuBRUbeiPmOujBXxnS:dsn.tm.kit.edu')
    cy.wait(5000)
    cy.get('#inviteButton').click().then(() => {
      cy.wait(1000)
      cy.get('#invite-userid').type('@test-2:dsn.tm.kit.edu')
      cy.wait(1000)
      cy.get('#invite-confirm').click()
      cy.wait(1000)
      cy.logout()
      cy.wait(1000)
      cy.login(2)
      cy.wait(1000)
      cy.visit('/rooms')
      cy.wait(5000)
      cy.get('#accept_button').click().then(() => {
        cy.wait(1000)
        cy.logout()
        cy.wait(1000)
      }
      )
    })
  })
  it('Test kick a member', function () {
    cy.login(1)
    cy.visit('room/!nuBRUbeiPmOujBXxnS:dsn.tm.kit.edu')
    cy.wait(5000)
    cy.get('#usercard_' + selectorify(user_2.user_id)).get('#kickButton').click().then(() => {
      cy.wait(1000)
      cy.get('#yes-button').click().then(() => {
        cy.get('#usercard_' + selectorify(user_2.user_id)).should('not.exist', { timeout: 3000 })
      }
      )
    }

    )
  })
})
