<template>
  <div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  components: {
  },
  data () {
    return {
      user: null
    }
  },
  computed: {
    ...mapState([
      'username'
    ])
  }
}
</script>
