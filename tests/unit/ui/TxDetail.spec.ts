import { newStore } from '@/store/index'
import { Room } from '@/models/room.model'
import { config, mount, shallowMount } from '@vue/test-utils'
import TxDetail from '@/components/TxDetail.vue'
import Login from '@/tabs/Login.vue'
import { user_1, user_2, user_3 } from '../mocks/mocked_user'
import { GroupID, TxID } from '@/models/id.model'
import { User } from '@/models/user.model'
import { PendingApproval, SimpleTransaction } from '@/models/transaction.model'
import { split_percentage, sum_amount, to_currency_display, uuidgen } from '@/utils/utils'
import ModificationDialog from '@/dialogs/ModificationDialog.vue'

describe('Test TxDetail Component', () => {
  let store = newStore()
  beforeEach(() => {
    store = newStore()
  })
  beforeAll(() => {
    config.global.mocks = {
      sum_amount: sum_amount,
      split_percentage: split_percentage,
      to_currency_display: to_currency_display
    }
  })
  describe('Test component UI', () => {
    it('Test if the component does not render when the tx is undefined', async () => {
      const wrapper = shallowMount(TxDetail, {
        props: {
          tx: undefined
        }
      })
      expect(wrapper.find('#TXDetail-header').exists()).toBe(false)
      expect(wrapper.find('#TXDetail-body').exists()).toBe(false)
      expect(wrapper.find('#ModificationButton-body').exists()).toBe(false)
    })
    it('Test if the component render when the tx is defined', async () => {
      const wrapper = shallowMount(TxDetail, {
        global: {
          plugins: [store]
        },
        props: {
          tx: {
            from: user_1,
            group_id: uuidgen(),
            state: 'approved',
            txs: [
              {
                to: user_2,
                tx_id: uuidgen(),
                amount: 10000
              }
            ],
            description: 'Title',
            participants: [],
            timestamp: new Date('1/15/2022'),
            pending_approvals: []
          }
        }
      })
      expect(wrapper.find('h3').element.innerHTML.includes('Details')).toBeTruthy()
      expect(wrapper.find('#TXDetail-body').element.innerHTML.includes('Title: 100€ from DSN Test Account No 1 at 2022/1/15')).toBeTruthy()
      expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(1)
    })
    it('Test if the user can click on modification button when he is participant', async () => {
      store.state.auth.user_id = user_1.user_id
      const wrapper = shallowMount(TxDetail, {
        global: {
          plugins: [store]
        },
        props: {
          tx: {
            from: user_1,
            group_id: uuidgen(),
            state: 'approved',
            txs: [
              {
                to: user_2,
                tx_id: uuidgen(),
                amount: 10
              }
            ],
            description: 'Title',
            participants: [],
            timestamp: new Date('1/15/2022'),
            pending_approvals: []
          }
        }
      })
      expect(wrapper.find('#ModificationButton-body').attributes('‘disabled')).toBe(false)
    })
    it('Test if the user can not click on modification button when he is not participant', async () => {
      store.state.auth.user_id = user_3.user_id
      const wrapper = shallowMount(TxDetail, {
        global: {
          plugins: [store]
        },
        props: {
          tx: {
            from: user_1,
            group_id: uuidgen(),
            state: 'approved',
            txs: [
              {
                to: user_2,
                tx_id: uuidgen(),
                amount: 10
              }
            ],
            description: 'Title',
            participants: [],
            timestamp: new Date('1/15/2022'),
            pending_approvals: []
          }
        }
      })
      expect(wrapper.find('#ModificationButton-body').attributes('‘disabled')).toBeTruthy()
    })
  })
  describe('Test ModificationDialog', () => {
    it('Test empty input', async () => {
      const element = document.createElement('div')
      const wrapper = mount(ModificationDialog, {
        attachTo: element
      })
    })
  })
})
