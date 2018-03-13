import Vue from 'vue'
import Vuex from 'vuex'
import APIURL from './APIURL'

Vue.use(Vuex)

const state = {
  APIURL: APIURL
}

export default new Vuex.Store({
  state
})
