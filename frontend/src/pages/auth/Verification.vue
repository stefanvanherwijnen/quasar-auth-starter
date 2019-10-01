<template>
  <q-page
    v-cloak
    padding
  >
    <p>
      {{ message }}
    </p>
  </q-page>
</template>

<script>
export default {
  name: 'Verification',
  data () {
    return {
      token: '',
      message: ''
    }
  },
  mounted () {
    this.verifyUser()
  },
  methods: {
    verifyUser () {
      this.token = this.$route.query.token

      this.$auth.verify(this.token).then((response) => {
        this.message = this.$i18n.t('auth.verification=.verification_success')
      })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 422) {
              this.message = this.$i18n.t('auth.verification.verification_failed')
            }
          }
          console.error(error)
        })
    }
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
