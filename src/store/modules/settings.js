import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/config'
import { sessionStore } from '@/utils'
import { SHOW_ADV_DIALOG } from '@/config/constant/app.data.common.js'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  advertiseSign: sessionStore.get(SHOW_ADV_DIALOG) || false,
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_ADVERTISE: (state, advertiseSign) => {
    state.advertiseSign = advertiseSign
    sessionStore.set(SHOW_ADV_DIALOG, advertiseSign)
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

