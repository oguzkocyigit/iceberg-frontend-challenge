<template>
  <table class="min-w-full border border-gray-200">
    <thead>
    <tr>
      <th @click="handleSortByColumn('appointment_date')" class="cursor-pointer py-2 px-4 border-b">
        Appointment Date <span v-if="sortBy === 'appointment_date'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
      </th>
      <th class="py-2 px-4 border-b">Appointment ID</th>
      <th class="py-2 px-4 border-b">Appointment Postcode</th>
      <th class="py-2 px-4 border-b">Contact Name</th>
      <th class="py-2 px-4 border-b">Contact Email</th>
      <th class="py-2 px-4 border-b">Contact Phone</th>
      <th class="py-2 px-4 border-b">Agent Name</th>
      <th class="py-2 px-4 border-b"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="record in filteredRecords" :key="record.id" :class="{ 'bg-slate-200': !record.active }">
      <td class="py-2 px-4 border-b">{{ formatDate(record.fields.appointment_date) }}</td>
      <td class="py-2 px-4 border-b">{{ record.fields.appointment_id }}</td>
      <td class="py-2 px-4 border-b">{{ record.fields.appointment_postcode }}</td>
      <td class="py-2 px-4 border-b">
              <span v-if="record.fields.contact_name">
                {{ record.fields.contact_name[0] }}
                {{ record.fields.contact_surname[0] }}
              </span>
      </td>
      <td class="py-2 px-4 border-b">
                <span v-if="record.fields.contact_email">
                  {{ record.fields.contact_email[0] }}
                </span>
      </td>
      <td class="py-2 px-4 border-b">
                <span v-if="record.fields.contact_phone">
                  {{ record.fields.contact_phone[0] }}
                </span>
      </td>
      <td class="py-2 px-4 border-b">
                <span v-if="record.fields.agent_name">
                {{ record.fields.agent_name[0] }}
                {{ record.fields.agent_surname[0] }}
              </span>
      </td>
      <td class="py-2 px-4 border-b">
        <button @click="editAppointment(record)"
                v-if="record.active"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Edit
        </button>
        <span class="text-red-500" v-else>
                  Passive
                </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>
<script>
import {computed} from 'vue';

export default {
  props: {
    records: Array,
    sortBy: String,
    sortOrder: String,
    selectedAgent: String,
    formatDate: Function,
  },
  setup(props, {emit}) {
    const sortedRecords = computed(() => {
      return [...props.records].sort((a, b) => {
        let comparison = 0;
        if (props.sortBy === 'appointment_date') {
          comparison = new Date(a.fields.appointment_date) - new Date(b.fields.appointment_date);
        } else {
          const propA = a.fields[props.sortBy];
          const propB = b.fields[props.sortBy];

          if (propA < propB) {
            comparison = -1;
          } else if (propA > propB) {
            comparison = 1;
          }
        }
        return props.sortOrder === 'asc' ? comparison * -1 : comparison;
      });
    });

    const filteredRecords = computed(() => {
      if (!props.selectedAgent) {
        return sortedRecords.value;
      } else {
        const agentId = props.selectedAgent;
        return sortedRecords.value.filter(record => {
          const recordAgentId = record.fields.agent_id;
          return recordAgentId.find(item => item === agentId);
        });
      }
    });

    const handleSortByColumn = (column) => {
      emit('sort-by-column', column);
    };

    return {
      sortedRecords,
      filteredRecords,
      handleSortByColumn
    };
  },
};
</script>
