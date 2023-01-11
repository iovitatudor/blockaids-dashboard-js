import {ExpertApi} from "../api/ContentApi/expert";

export default {
  namespaced: true,

  state: {
    experts: [],
    lastCreatedExpert: null,
  },

  getters: {
    getExperts: (state) => state.experts,
    getLastCreatedExpert: (state) => state.lastCreatedExpert,
  },

  mutations: {
    setExperts(state, experts) {
      state.experts = experts;
    },
    addExpert(state, expert) {
      state.experts.unshift(expert);
      state.lastCreatedExpert = expert;
    },
    deleteExpert(state, id) {
      state.experts = state.experts.filter(expert => expert.id !== id);
    },
  },

  actions: {
    async saveExpert({commit}, data) {
      const result = await ExpertApi.create(data);
      commit('addExpert', result.data);
      return result.data;
    },
    fetchExperts({commit}) {
      return ExpertApi.getAll().then((res) => {
        commit('setExperts', res.data.data);
      });
    },
    getExpertById({commit}, id) {
      return ExpertApi.getById(id);
    },
    async editExpert({commit, rootGetters}, data) {
      const result = await ExpertApi.edit(data.id, data.data);
      const expert = result.data;
      const authExpert = rootGetters['auth/getAuthExpert'];
      if (authExpert.id === expert.id) {
        commit('auth/setAuthExpert', expert, {root: true});
      }
      return result;
    },
    destroyExpert({commit}, id) {
      return ExpertApi.remove(id).then((res) => {
        commit('deleteExpert', id);
      });
    },
    async toggleStatus({commit, rootGetters}, id) {
      const result = await ExpertApi.toggleStatus(id);
      const expert = result.data;
      const authExpert = rootGetters['auth/getAuthExpert'];
      if (authExpert.id === expert.id) {
        commit('auth/setAuthExpert', expert, {root: true});
      }
      return expert;
    }
  },
};
