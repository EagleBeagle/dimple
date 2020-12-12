<template>
  <div>
  <sidebar />
  <toolbar />
  <router-view />
    
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import Toolbar from '@/components/Toolbar'
export default {
  components: {
    Sidebar,
    Toolbar
  }
}
</script>

<style>

</style>