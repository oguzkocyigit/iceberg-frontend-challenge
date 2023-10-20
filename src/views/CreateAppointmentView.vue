<template>
  <div class="create-appointment-view">
    <h2 class="text-2xl font-semibold mb-4">Create Appointment</h2>
    <div class="w-10/12 mx-auto p-6 bg-white shadow-lg rounded-lg create-appointment-view-container flex">
      <div class="w-1/2 mr-4">
        <g-map
            v-if="isRendered"
            :disableUI="false"
            :zoom="15"
            mapType="roadmap"
            :center="mapCenter"
            :officeLocation="mapCenter"
            ref="gmap"
            @mapClick="handleMapClick"
        >
        </g-map>
        <p class="mb-5 mt-2 font-bold">Select a point from map to calculate distance, travel time and total appointment time</p>
        <p class="font-bold" v-if="distanceToAppointment">Distance to Appointment Location: {{ distanceToAppointment }} km</p>
        <p class="font-bold" v-if="travelTimeToAppointment">Travel Time to Appointment Location: {{ travelTimeToAppointment }}</p>
        <p class="font-bold" v-if="totalAppointmentTime">Total Appointment Time: {{ totalAppointmentTime }}</p>
      </div>
      <div class="w-1/2">
        <form @submit.prevent="submitForm">
          <div class="flex items-center mb-4" v-for="(field, key) in formFields" :key="key">
            <label :for="key" class="w-1/4 text-sm font-medium text-gray-600 text-left">{{ field.label }} :</label>
            <select v-if="field.label === 'Agent Employee'" :id="key" v-model="field.value" class="w-3/4 p-2 border rounded-md" :class="field.error ? 'border-red-500' : ''">
              <option value="">Please select</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">{{ agent.fields.agent_name }} {{ agent.fields.agent_surname }}</option>
            </select>
            <select v-else-if="field.label === 'Contact'" :id="key" v-model="field.value" class="w-3/4 p-2 border rounded-md" :class="field.error ? 'border-red-500' : ''">
              <option value="">Please select</option>
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">{{ contact.fields.contact_name }} {{ contact.fields.contact_surname }}</option>
            </select>
            <input v-else :disabled="field.disabled" :type="field.type" :id="key" v-model="field.value" class="w-3/4 p-2 border rounded-md" :class="field.error ? 'border-red-500' : ''">
          </div>
          <button type="submit" class="w-3/4 float-right bg-green-500 text-white font-bold px-4 py-2 rounded-md hover:bg-green-600">Create Appointment</button>
          <div v-if="showSuccessAlert" class="fixed bottom-0 left-0 w-full bg-green-500 text-white p-4 text-center">
            Appointment created successfully!
          </div>
          <div v-if="showErrorAlert" class="fixed bottom-0 left-0 w-full bg-red-500 text-white p-4 text-center">
            Appointment is not created! Please try again.
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Gmap from "@/components/Gmap.vue";
import postCodesService from "@/services/PostCodesService";
import ApiService from '@/services/ApiService';

export default {
  name: 'CreateAppointmentView',
  components: {
    'g-map': Gmap,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const formFields = reactive({
      postalCode: { label: 'Postal Code', type: 'text', value: '', error: '', disabled: false },
      appointmentDate: { label: 'Appointment Date', type: 'date', value: '', error: '', disabled: false },
      realtor: { label: 'Agent Employee', type: 'select', value: '', error: '', disabled: false },
      contact: { label: 'Contact', type: 'select', value: '', error: '', disabled: false },
      email: { label: 'Email Address', type: 'email', value: '', error: '' , disabled: true },
      phone: { label: 'Phone Number', type: 'tel', value: '', error: '' , disabled: true},
    });

    const isFormValid = computed(() => {
      return Object.values(formFields).every(field => !field.error);
    });

    watch(formFields.contact, (val) => {
      const selectedUser = contacts.value.find(item => item.id === val.value);
      if (selectedUser) {
        formFields.email.value = selectedUser.fields.contact_email;
        formFields.phone.value = selectedUser.fields.contact_phone;
      } else {
        console.log("User not found");
      }
    });


    store.dispatch('fetchAgents');
    store.dispatch('fetchContacts');
    const agents = computed(() => store.state.agents);
    const contacts = computed(() => store.state.contacts);

    const mapCenter = ref({ lat: 0, lng: 0 });
    const isRendered = ref(false);

    onMounted(() => {
      const postcode = 'cm27pj';
      getLatLongFromPostcode(postcode);
    });

    const getLatLongFromPostcode = async (postcode) => {
      try {
        const response = await postCodesService.get(`/postcodes/${postcode}`);
        if (response.status === 200 && response.data && response.data.result) {
          const { latitude, longitude } = response.data.result;

          mapCenter.value.lat = latitude;
          mapCenter.value.lng = longitude;
          isRendered.value = true;
        } else {
          console.error('Error fetching postcode details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching postcode details:', error);
      }
    };

    const clickedLocation = ref('');
    const distanceToAppointment = ref('');
    const travelTimeToAppointment = ref('');
    const totalAppointmentTime = ref('');

    const handleMapClick = (latLngData) => {
      const { location, distance } = latLngData;

      const distanceInKm = parseFloat(distance.replace(' km', ''));

      const averageSpeed = 30; // average speed in km/h

      const travelTimeInHours = distanceInKm / averageSpeed;

      const totalTravelTimeInHours = travelTimeInHours * 2;

      const totalAppointmentTimeInHours = totalTravelTimeInHours + 1;

      const totalHours = Math.floor(totalAppointmentTimeInHours);
      const totalMinutes = Math.round((totalAppointmentTimeInHours - totalHours) * 60);

      clickedLocation.value = location;
      distanceToAppointment.value = distanceInKm.toFixed(2);

      if (travelTimeInHours < 1) {
        travelTimeToAppointment.value = Math.round(travelTimeInHours * 60) + " minutes";
      } else {
        const travelHours = Math.floor(travelTimeInHours);
        const travelMinutes = Math.round((travelTimeInHours - travelHours) * 60);
        travelTimeToAppointment.value = `${travelHours} hours ${travelMinutes} minutes`;
      }
      if (totalAppointmentTimeInHours < 1) {
        totalAppointmentTime.value = Math.round(totalAppointmentTimeInHours * 60) + " minutes";
      } else {
        totalAppointmentTime.value = `${totalHours} hours ${totalMinutes} minutes`;
      }
    };

    const showSuccessAlert = ref(false);
    const showErrorAlert = ref(false);

    const submitForm = async () => {
      for (const key in formFields) {
        formFields[key].error = !formFields[key].value;
      }

      if (Object.values(formFields).every(field => !field.error)) {
        try {
          const postData = {
            records: [
              {
                fields: {
                  appointment_date: formFields.appointmentDate.value,
                  appointment_postcode: formFields.postalCode.value,
                  agent_id: [formFields.realtor.value],
                  contact_id: [formFields.contact.value],
                }
              }
            ]
          };

          const response = await ApiService.post('/Appointments', postData);

          if (response.status === 200) {
            showSuccessAlert.value = true;
            setTimeout(() => {
              router.push('/appointments');
            }, 2000);
            console.log('Appointment created successfully:', response.data);
          } else {
            setTimeout(() => {
              showErrorAlert.value = false;
            }, 2000);
            console.error('Error creating appointment:', response.status);
          }
        } catch (error) {
          setTimeout(() => {
            showErrorAlert.value = false;
          }, 2000);
          console.error('Error creating appointment:', error);
        }
      } else {
        console.error('Form validation failed');
      }
    };

    return {
      formFields,
      isFormValid,
      agents,
      contacts,
      submitForm,
      isRendered,
      mapCenter,
      getLatLongFromPostcode,
      clickedLocation,
      distanceToAppointment,
      travelTimeToAppointment,
      totalAppointmentTime,
      handleMapClick,
      showSuccessAlert,
      showErrorAlert
    };
  }
};
</script>

<style lang="scss" scoped>
.create-appointment-view {

}

.create-appointment-view-container {
  height: 80vh;
  overflow-y: scroll;
}
</style>
