import { selectorify, uuidgen } from '@/utils/utils'
import { user_1, user_2 } from '../../../unit/mocks/mocked_user'
import { POSTLoginResponse } from '@/interface/api.interface'

describe('Test Permission Management', function () {
  beforeEach(function () {
    cy.login(1)
    cy.visit('/rooms')
    cy.get('.alert-primary').should('not.exist', { timeout: 6000 })
    cy.get('table').contains('test-sending-message').parent().contains('Detail').click()
    cy.get('.spinner').should('not.exist', { timeout: 6000 })
  })
  it('Test get chatlog synchronized', function () {
    const message = uuidgen()
    cy.request<POSTLoginResponse>('POST', 'https://matrix.dsn.scc.kit.edu/_matrix/client/r0/login', {
      type: 'm.login.password',
      identifier: {
        type: 'm.id.user',
        user: '@test-2:dsn.tm.kit.edu'
      },
      password: 'RF!WZxyUtUr8'
    }).then(() => {
      cy.request('PUT', 'https://matrix.dsn.scc.kit.edu/_matrix/client/r0/rooms/!MDXnrxrPjjppRhMozh:dsn.tm.kit.edu/send/m.room.message/' + uuidgen(), {
        msgtype: 'm.text',
        body: message
      })
      cy.get('.mb-5').children().last().find('.small mb-0 chat-message text-wrap text-break')
        .contains(message)
    })
  })
})