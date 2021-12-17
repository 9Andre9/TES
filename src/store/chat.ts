import axios from 'axios'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { MatrixRoomID } from '@/models/id.model'
import { ChatLog, ChatMessage } from '@/models/chat.model'
import { User } from '@/models/user.model'
interface State {
  chat_log: Record<MatrixRoomID, ChatLog>
}

export const chat_store = {
  namespaced: true,
  state (): State {
    return {
      chat_log: {}
    }
  },
  mutations: <MutationTree<State>>{
  },
  actions: <ActionTree<State, any>>{
  },
  getters: <GetterTree<State, any>>{
    get_chat_log_for_room: (state: State) => (room_id: MatrixRoomID): ChatLog => {
      return {
        messages: []
      }
    }
  }
}

// Testing
export default {
  state: chat_store.state,
  mutations: chat_store.mutations,
  actions: chat_store.actions,
  getters: chat_store.getters
}
