<template>
  <div class="fixed-left-menu">
    <router-link to="/">
      <img class="brand-logo" src="../assets/images/logo.png" alt="">
    </router-link>
    <nav>
      <router-link to="/">Dashboard</router-link>
      <router-link to="/appointments">Appointments</router-link>
      <router-link to="/appointments/create">Create Appointment</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "LeftMenu"
}
</script>
