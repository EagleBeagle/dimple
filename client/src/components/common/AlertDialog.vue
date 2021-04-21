<template>
<v-dialog
  v-model="dialog"
  width="400">
  <v-card>
    <v-card-title class="text-h5">
      {{ title }}
    </v-card-title>
    <v-card-text style="text-align: left" class="text-body-1">
      {{ text }}
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        class="blue--text"
        @click="close()">
        OKAY
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'show',
    'title',
    'text'
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
  },
  data () {
    return {
      
    }
  },
  methods: {
    close() {
      this.dialog = false
    }
  }
}
</script>

<style>

</style>