<template>
  <div />
</template>

<script>
export default {
  name: 'Logout',
  mounted () {
    this.$q.dialog({
      title: this.$i18n.t('auth.logout.confirm'),
      message: this.$i18n.t('auth.logout.logout_confirmation'),
      ok: this.$i18n.t('auth.logout.logout'),
      cancel: this.$i18n.t('auth.logout.cancel')
    }).onOk(() => {
      this.$auth.logout().then(() => {
        this.$router.push('/')
      })
    }).onCancel(() => {
      this.$router.go(-1)
    })
  }
}
</script>
