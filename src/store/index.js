import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import user from './module/user'
import app from './module/app'
import advisoryChat from './module/advisoryChat'
import supportChat from './module/supportChat'

Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    advisoryChat,
    supportChat
  },
  plugins: [vuexLocal.plugin],
})
