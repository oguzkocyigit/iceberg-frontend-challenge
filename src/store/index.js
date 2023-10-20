import { createStore } from 'vuex';
import ApiService from '@/services/ApiService';

export default createStore({
  state: {
    agents: [],
    contacts: [],
    records: [],
  },
  mutations: {
    setAgents(state, agents) {
      state.agents = agents;
    },
    setContacts(state, contacts) {
      state.contacts = contacts;
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
        // filtering response data if name and surname are empty from response
        const filteredRecords = response.data.records.filter(record =>
            record.fields.agent_name && record.fields.agent_surname
        );
        commit('setAgents', filteredRecords);
      } catch (error) {
        console.error('Error fetching agents: ', error);
      }
    },
    async fetchContacts({ commit }) {
      try {
        const response = await ApiService.get('/Contacts');
        // filtering response data if name and surname are empty from response
        const filteredRecords = response.data.records.filter(record =>
            record.fields.contact_name && record.fields.contact_surname
        );
        commit('setContacts', filteredRecords);
      } catch (error) {
        console.error('Error fetching contacts: ', error);
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
