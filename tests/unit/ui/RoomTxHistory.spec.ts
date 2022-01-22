import { newStore } from '@/store/index'
import { config, flushPromises, mount, shallowMount } from '@vue/test-utils'
import SplitModifyDialog from '@/dialogs/SplitModifyDialog.vue'
import { split_percentage, sum_amount, to_currency_display, uuidgen } from '@/utils/utils'
import RoomTxHistory from '@/views/RoomTxHistory.vue'
import bootstrap from 'bootstrap'
import TxList from '@/components/TxList.vue'
import { MatrixEventID, MatrixRoomID, MatrixUserID } from '@/models/id.model'
import { GroupedTransaction, PendingApproval, TxGraph } from '@/models/transaction.model'
import { createStore } from 'vuex'

interface State {
  transactions: Record<MatrixRoomID, {
    basic: GroupedTransaction[],
    pending_approvals: PendingApproval[],
    graph: TxGraph,
    optimized_graph: TxGraph,
    is_graph_dirty: boolean, // if both graphs are updated with basic
    rejected: Record<MatrixEventID, Set<MatrixUserID>>,
  }>
}

describe('Test RoomTxHistory', () => {
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
  it('Test whether RoomName is displayed', async () => {
    const store1 = createStore({
      modules: {
        rooms: {
          namespaced: true,
          getters: {
            get_room_name: () => (room_id: MatrixRoomID) => 'aaa'
          }
        },
        tx: {
          namespaced: true,
          actions: {
            action_optimize_graph_and_prepare_balance_for_room: jest.fn()
          },
          getters: {
            get_grouped_transactions_for_room: () => (room_id: MatrixRoomID) => []
          }
        },
        sync: {
          namespaced: true,
          actions: {
            action_sync_initial_state: jest.fn(),
            action_sync_state: jest.fn(),
            action_sync_full_tx_events_for_room: jest.fn()
          }
        }
      }
    })
    const wrapper = shallowMount(RoomTxHistory, {
      global: {
        mocks: {
          $route: {
            params: {
              room_id: 'aaa'
            }
          }
        },
        plugins: [store1]
      }
    })
    await flushPromises()
    await expect(wrapper.find('#history_room_name').element.innerHTML.includes('History: aaa')).toEqual(true)
  })
  it('Test balance display',async () => {
    
  })
})
