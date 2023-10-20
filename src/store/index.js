import { createStore } from 'vuex';
import ApiService from '@/services/ApiService';

export default createStore({
  state: {
    agents: [],
    records: [],
  },
  mutations: {
    setAgents(state, agents) {
      state.agents = agents;
    },
    setRecords(state, records) {
      const currentDate = new Date();
      state.records = records.map(record => {
        const appointmentDate = new Date(record.fields.appointment_date);
        record.active = appointmentDate >= currentDate;
        return record;
      });
    },
  },
  actions: {
    async fetchAgents({ commit }) {
      try {
        const response = await ApiService.get('/Agents');
        commit('setAgents', response.data.records);
      } catch (error) {
        console.error('Error fetching agents: ', error);
      }
    },
    async fetchRecords({ commit }) {
      try {
        const response = await ApiService.get('/Appointments');
        commit('setRecords', response.data.records);
      } catch (error) {
        console.error('Error fetching records: ', error);
      }
    },
  },
  getters: {},
});
