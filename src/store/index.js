import Vue from 'vue'
import Vuex from 'vuex'
import state from 'store/state'
import * as getters from 'store/getters'
import * as actions from 'store/actions'
import mutations from 'store/mutations'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
