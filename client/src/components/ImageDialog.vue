<template>
  <v-dialog
  width="1200"
  v-model="dialog">
  <v-card>
    <v-img v-if="image" :src="image.src"></v-img>
  </v-card>
  </v-dialog>
</template>

<script>
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
    }
  }
}
</script>

<style>

</style>