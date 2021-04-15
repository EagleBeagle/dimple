<template>
  <div></div>
</template>
<script>
import UserService from '@/services/UserService'
export default {
  async mounted() {
    const confirmationToken = this.$route.params.confirmationToken
    try {
      const response = await UserService.confirm(confirmationToken)
      if (response.data.avatar) {
        response.data.avatar = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${response.data.username}/avatar/${response.data.avatar}`
      }
      localStorage.setItem('user', JSON.stringify(response.data))
      this.$store.dispatch('setUser', response.data)
      this.$store.dispatch('alert', 'Your account is now verified.')
      this.$router.push({ name: 'Explore' }).catch(() => {})
    } catch (err) {
      this.$store.dispatch('alert', 'Account verification failed')
      if (this.$store.state.user) {
        this.$router.push({ name: 'Explore' }).catch(() => {})
      } else {
        this.$router.push({ name: 'Authentication' }).catch(() => {})
      }
    }
  }
}
</script>

<style>

</style>