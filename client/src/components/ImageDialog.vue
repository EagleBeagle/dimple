<template>
  <v-dialog
  width="1200"
  v-model="dialog">
  <v-card>
    <cld-image v-if="image" :publicId="`${user.username}/${image.id}`" cloudName="dimplecloud"></cld-image>
  </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: [
    'show',
    'image'
  ],
  computed: {
    dialog: {
      get () {
        return this.show
      },
      set () {
        this.$emit('close')
      }
    },
    ...mapState([
      'user'
    ])
  }
}
</script>

<style>

</style>