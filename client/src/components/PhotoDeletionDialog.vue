<template>
<v-dialog
  v-model="dialog"
  width="500">
  <v-card>
    <v-card-title class="headline">
      Are you sure?
    </v-card-title>
    <v-card-text class="text-body-1" v-if="deleteAll">
      If you permanently delete these photos, you won't be able to restore them later.
    </v-card-text>
    <v-card-text class="text-body-1" v-else>
      If you permanently delete this photo, you won't be able to restore it later.
    </v-card-text>
    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        class="blue--text"
        @click="confirm()">
        CONFIRM
      </v-btn>
      <v-btn
        depressed
        class="red--text"
        @click="close()"
      >
        CANCEL
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'show',
    'deleteAll'
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
    },
    confirm() {
      if (this.deleteAll) {
        this.$emit('deleteAll')
      } else {
        this.$emit('confirm')
      }
      this.dialog = false
    }
  }
}
</script>

<style>

</style>