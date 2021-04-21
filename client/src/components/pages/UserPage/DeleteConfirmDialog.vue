<template>
<v-dialog
  v-model="dialog"
  width="500">
  <v-card>
    <v-card-title class="text-h5" v-if="type === 'photo'">
      Are you sure?
    </v-card-title>
    <v-card-title class="text-h5" v-if="type === 'album'">
      Confirmation
    </v-card-title>
    <v-card-text class="text-body-1" v-if="deleteAll && type === 'photo'">
      If you permanently delete these photos, you won't be able to restore them later.
    </v-card-text>
    <v-card-text class="text-body-1" v-else-if="type === 'photo'">
      If you permanently delete this photo, you won't be able to restore it later.
    </v-card-text>
    <v-card-text class="text-body-1" v-else-if="type === 'album'">
      Do you really want to delete this album? (Don't worry, none of the contents will be deleted.)
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
    'deleteAll',
    'type'
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
    }
  }
}
</script>

<style>

</style>