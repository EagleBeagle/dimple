<template>
<v-dialog
  v-model="dialog"
  width="500">
  <v-card>
    <v-card-title class="headline">
      Create New Album
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        outlined
        v-model="valid"
        lazy-validation
        autocomplete="off">
        <v-container>
          <v-row class="mb-5">
            <v-text-field
              label="Name"
              :rules="nameRules"
              v-model="name"
            ></v-text-field>
          </v-row>
          <v-row class="mb-5">
            <v-select
              :items="visibilityItems"
              label="Visibility"
              v-model="visibility"
            ></v-select>
          </v-row>
          <v-row>
            <v-textarea
              outlined
              label="Description"
              value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
              v-model="description"
              hint="Say something about this album"
            ></v-textarea>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        :disabled="!valid"
        class="blue--text"
        @click="createAlbum()"
      >
        CREATE
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
import AlbumService from '@/services/AlbumService'
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
        this.visibility = 'Private'
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      valid: true,
      name: '',
      nameRules: [
        v => !!v || "The name can't stay empty.",
        v => (v && v.length < 26) || "The name can't be longer than 25 characters."
      ],
      description: '',
      visibilityItems: ['Private', 'Public'],
      visibility: 'Private'
    }
  },
  methods: {
    async createAlbum() {
      try {
        const response = await AlbumService.create({
          name: this.name,
          visibility: this.visibility == 'Public' ? 1 : 0,
          description: this.description,
          userId: localStorage.getItem('user').id
        })
        this.$store.dispatch('alert', `Album ${this.name} succesfully created`)
        this.$store.dispatch('albumAdded', response.data)
        this.clearFields()
        this.dialog = false
      } catch(err) {
        console.log(err)
        this.$store.dispatch('alert', `An error has happened during album creation`)
      }
    },
    close() {
      this.clearFields()
      this.dialog = false
    },
    async clearFields() {
      this.name = ''
      this.description = ''
      this.$refs.form.resetValidation()
      this.visibility = 'Private'
    }
  }
}
</script>

<style>

</style>