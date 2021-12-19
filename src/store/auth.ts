import { ActionTree, createStore, GetterTree, MutationTree, StoreOptions } from 'vuex'
import axios from 'axios'
import { GETLoginResponse, POSTLoginResponse } from '@/interface/api.interface'
import { MatrixError } from '@/interface/error.interface'

interface State {
  user_id: string
  homeserver: string
  access_token: string
  device_id?: string,
  event_txn_id: number
}

export const auth_store = {
  namespaced: true,
  state (): State {
    return {
      user_id: localStorage.getItem('user_id') || '',
      homeserver: localStorage.getItem('homeserver') || '',
      access_token: localStorage.getItem('access_token') || '',
      device_id: localStorage.getItem('device_id') || '',
      event_txn_id: localStorage.getItem('event_txn_id')
        ? parseInt(localStorage.getItem('event_txn_id') as string)
        : 0
    }
  },
  mutations: <MutationTree<State>>{
    mutation_login (state, payload: State): void {
      state.user_id = payload.user_id
      state.homeserver = payload.homeserver
      state.access_token = payload.access_token
      state.device_id = payload.device_id
      localStorage.setItem('user_id', state.user_id)
      localStorage.setItem('access_token', state.access_token)
      localStorage.setItem('device_id', state.device_id!)
      localStorage.setItem('homeserver', state.homeserver)
      localStorage.setItem('event_txn_id', state.event_txn_id.toString())
    },
    mutation_logout (state: State): void {
      state.access_token = ''
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('event_txn_id')
    },
    mutation_increment_event_txn_id (state: State) {
      state.event_txn_id++
      localStorage.setItem('event_txn_id', state.event_txn_id.toString())
    }
  },
  actions: <ActionTree<State, any>>{
    async action_login ({
      state,
      commit
    }, payload: {
      username: string,
      password: string,
      homeserver: string
    }) {
      const response_get = await axios.get<GETLoginResponse>(`${payload.homeserver}/_matrix/client/r0/login`)
      if (!response_get.data.flows.map(i => i.type).includes('m.login.password')) {
        throw new Error('Homeserver does not support password authentication')
      } else {
        const response_post = await axios.post<POSTLoginResponse>(`${payload.homeserver}/_matrix/client/r0/login`, {
          type: 'm.login.password',
          identifier: {
            type: 'm.id.user',
            user: payload.username
          },
          password: payload.password,
          device_id: state.device_id === '' ? undefined : state.device_id
        }, {
          validateStatus: () => true // Always resolve unless we throw an error manually
        })
        if (response_post.status === 200) {
          commit('mutation_login', {
            user_id: response_post.data.user_id,
            access_token: response_post.data.access_token,
            device_id: response_post.data.device_id,
            homeserver: payload.homeserver,
            event_txn_id: '0'
          })
        } else {
          const error = response_post.data as unknown as MatrixError
          throw new Error(error.error)
        }
      }
    },
    async action_logout ({
      state,
      commit
    }) {
      await axios.post(`${state.homeserver}/_matrix/client/r0/logout`)
      commit('mutation_logout')
    },
    action_get_next_event_txn_id ({
      state,
      commit
    }) : number {
      const result = state.event_txn_id
      commit('mutation_increment_event_txn_id')
      return result
    }
  },
  getters: <GetterTree<State, any>>{
    device_id (state: State): string | undefined {
      return state.device_id
    },
    is_logged_in (state: State): boolean {
      return state.access_token !== ''
    },
    user_id (state: State): string {
      return state.user_id
    },
    homeserver (state: State): string {
      return state.homeserver
    }
  }
}

// Testing
export default {
  state: auth_store.state,
  mutations: auth_store.mutations,
  actions: auth_store.actions,
  getters: auth_store.getters
}
