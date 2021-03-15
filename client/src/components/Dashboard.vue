<template>
  <div>
    <sidebar />
    <toolbar v-on:showUploadbar="showUploadbar = true"/>
    <router-view></router-view>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import Toolbar from '@/components/Toolbar'
export default {
  components: {
    Sidebar,
    Toolbar,
  }
}
</script>

<style>

</style>