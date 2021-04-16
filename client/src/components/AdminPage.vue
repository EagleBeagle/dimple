<template>
  <v-container fluid fill-height class="pa-5">
    <v-row>
      <v-col cols="12" sm="6" class="pa-2">
        <v-data-table
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
      <v-col cols="12" sm="6" class="pa-2">
        <v-data-table
          :headers="userHeaders"
          :items="users"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" class="pa-2">
        <v-data-table
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
      <v-col cols="12" sm="6" class="pa-2">
        <v-data-table
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
export default {
  data () {
    return {
      users: [],
      userHeaders: [
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Registration date', value: 'createdAt' },
        { text: 'Photo count', value: 'imageCount' },
        { text: 'Admin', value: 'admin' },
      ]
    }
  },
  async mounted() {
    await this.getUsers()
  },
  methods: {
    async getUsers() {
      try {
        this.users = (await UserService.search('', true)).data
        console.log(this.users)
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error happened while fetching users')
      }
    }
  }
}
</script>

<style>

</style>