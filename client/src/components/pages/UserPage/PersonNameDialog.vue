<template>
<v-dialog
  v-model="dialog"
  width="350">
  <v-card>
    <v-card-title class="py-3 text-h5">
      <span>Name this person</span>
      <v-spacer></v-spacer>
      <v-icon @click="close()">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="py-0 pt-2">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        autocomplete="off">
        <v-container class="pa-0">
          <v-row justify="center" class="pb-5">
            <v-col cols="8" align-self="center" class="pa-0">
              <v-text-field
                label="Name"
                outlined
                hide-details
                maxlength="25"
                :rules="nameRules"
                v-model="name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class="pb-5">
            <v-col cols="12" align-self="center" class="pa-0">
              <v-btn
                :disabled="!valid || name.length === 0"
                depressed
                class="blue--text"
                @click="confirm">
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
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
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || "The name can't stay empty.",
        v => (v && v.length < 26) || "The name can't be longer than 25 characters."
      ],
    }
  },
  methods: {
    close() {
    this.dialog = false
    },
    confirm() {
      this.$emit('confirm', this.name)
      this.dialog = false
    }
  }
}
</script>

<style>

</style>