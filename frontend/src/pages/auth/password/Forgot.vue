<template>
  <q-page class="flex flex-center">
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.password.forgot.header') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          id="email"
          v-model.trim="data.email"
          type="text"
          :label="$t('auth.password.forgot.email')"
          required
          autofocus
          :error="$v.data.email.$error"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="fit"
          color="primary"
          :loading="loading"
          @click="submit"
        >
          {{ $t('auth.submit') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'

export default {
  name: 'PasswordForgot',
  data () {
    return {
      data: {
        email: ''
      },
      loading: false
    }
  },
  mounted () {
    if (this.$auth.check()) {
      this.$router.push('/account')
    }
  },
  methods: {
    submit () {
      this.$v.data.$touch()
      if (!this.$v.data.$error) {
        this.loading = true
        this.$auth.passwordForgot(this.data).then((response) => {
          this.$q.dialog({
            message: this.$t('auth.password.forgot.check_email')
          }).onOk(() => {
            this.$router.push('/login')
          })
        }).catch((error) => {
          console.error(error)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  },
  validations: {
    data: {
      email: {
        required,
        email
      }
    }
  }
}
</script>
