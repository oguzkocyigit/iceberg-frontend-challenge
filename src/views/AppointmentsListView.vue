<template>
  <div class="appointments-list-view">
    <div class="flex justify-center h-screen">
      <div class="w-10/12 mx-auto bg-white rounded-lg">
        <div v-if="!records.length" class="fixed inset-0 bg-gray-500 opacity-75 flex items-center justify-center">
          <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <div v-else class="table-container">
          <div class="flex items-center justify-end mb-4">
            <label for="agentFilter" class="mr-2">Filter by Agent:</label>
            <select v-model="selectedAgent" id="agentFilter" class="border p-2">
              <option value="">All Agents</option>
              <option
                  v-for="agent in agents"
                  :value="agent.id"
                  :key="agent.id"
              >
                {{ agent.fields.agent_name }}
                {{ agent.fields.agent_surname }}
              </option>
            </select>
          </div>
          <app-table
              :records="filteredRecords"
              :sort-by="sortBy"
              :sort-order="sortOrder"
              :format-date="formatDate"
              @sort-by-column="handleSortByColumn"
          ></app-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, computed} from 'vue';
import {useStore} from 'vuex';
import AppointmentsTable from '../components/AppointmentsTable.vue';

export default {
  name: 'AppointmentsListView',
  components: {
    'app-table': AppointmentsTable,
  },
  setup() {
    const sortBy = ref('appointment_date');
    const sortOrder = ref('asc');
    const selectedAgent = ref('');

    const store = useStore();

    const agents = computed(() => store.state.agents);
    const records = computed(() => store.state.records);

    store.dispatch('fetchAgents');
    store.dispatch('fetchRecords');

    const filteredRecords = computed(() => {
      if (!selectedAgent.value) {
        return sortedRecords.value;
      } else {
        const agentId = selectedAgent.value;
        const filtered = sortedRecords.value.filter(record => {
          const recordAgentId = record.fields.agent_id;
          return recordAgentId.find(item => item === agentId);
        });
        return filtered;
      }
    });

    const formatDate = (dateString) => {
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSortByColumn = (column) => {
      if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy.value = column;
        sortOrder.value = column === 'appointment_date' ? 'asc' : 'desc';
      }
    };

    const sortedRecords = computed(() => {
      return [...records.value].sort((a, b) => {
        let comparison = 0;
        if (sortBy.value === 'appointment_date') {
          comparison = new Date(a.fields.appointment_date) - new Date(b.fields.appointment_date);
        } else {
          const propA = a.fields[sortBy.value];
          const propB = b.fields[sortBy.value];

          if (propA < propB) {
            comparison = -1;
          } else if (propA > propB) {
            comparison = 1;
          }
        }
        return sortOrder.value === 'asc' ? comparison * -1 : comparison;
      });
    });


    return {
      records,
      agents,
      sortBy,
      formatDate,
      sortedRecords,
      sortOrder,
      handleSortByColumn,
      selectedAgent,
      filteredRecords,
    };
  }
}
</script>

<style scoped>
.table-container {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
