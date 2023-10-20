<template>
  <div class="fixed-left-menu h-screen bg-gray-200 p-4 shadow-md fixed top-0 left-0">
    <router-link to="/">
      <img class="brand-logo w-full" src="../assets/images/logo.png" alt="">
    </router-link>
    <nav class="mt-8">
      <router-link to="/" class="block font-semibold text-gray-700 mb-4">Dashboard</router-link>
      <router-link to="/appointments" class="block font-semibold text-gray-700 mb-4">Appointments</router-link>
      <router-link to="/appointments/create" class="block font-semibold text-gray-700">Create Appointment</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "LeftMenu"
}
</script>
