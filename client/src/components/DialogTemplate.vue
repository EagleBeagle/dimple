<template>
<v-dialog
  v-model="dialog"
  width="500">
  <v-card>
    <v-card-title class="headline">
      Share Photo
    </v-card-title>
    <v-card-text>
      
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        class="blue--text">
        CREATE
      </v-btn>
      <v-btn
        depressed
        class="red--text">
        CANCEL
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'show'
  ],
  computed: {
    dialog: {
      get () {
        return this.show
      },
      set () {
        this.clearFields()
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  },
  close() {
    this.clearFields()
    this.dialog = false
  },
  async clearFields() {
    
  }
}
</script>

<style>

</style>