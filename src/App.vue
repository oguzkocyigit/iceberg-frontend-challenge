<template>
  <LeftMenu/>
  <div class="page-view">
    <router-view/>
  </div>
</template>
<script>
import LeftMenu from "@/components/LeftMenu.vue"
export default {
  name: 'App',
  components: { LeftMenu }
}
</script>
