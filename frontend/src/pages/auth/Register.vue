<template>
  <q-page
    padding
    class="flex flex-center"
  >
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.register.register') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          id="email"
          v-model.trim="data.email"
          type="text"
          :label="$t('auth.register.email')"
          bottom-slots
          required
          autofocus
          :error="$v.data.email.$error"
          :error-message="$t('auth.register.errors.email')"
        />
        <q-input
          v-model.trim="data.name"
          type="text"
          :label="$t('auth.register.name')"
          required
          :error="$v.data.name.$error"
        />
        <q-input
          id="password"
          v-model="data.password"
          type="password"
          :label="$t('auth.register.password')"
          bottom-slots
          required
          :error="$v.data.password.$error"
          :error-message="$t('auth.register.errors.password_length', { length: minPasswordLength })"
        />
        <q-input
          id="repeatPassword"
          v-model="data.repeatPassword"
          type="password"
          :label="$t('auth.register.repeat_password')"
          bottom-slots
          required
          :error="$v.data.repeatPassword.$error"
          :error-message="$t('auth.register.errors.password_match')"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          color="primary"
          :loading="loading"
          :label="$t('auth.register.register')"
          @click="register"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'

const minPasswordLength = 8

export default {
  name: 'Register',
  data () {
    return {
      data: {
        name: '',
        email: '',
        password: '',
        repeatPassword: ''
      },
      loading: false,
      minPasswordLength: minPasswordLength
    }
  },
  methods: {
    register () {
      this.$v.data.$touch()
      if (!this.$v.data.$error) {
        this.$q.dialog({
          message: this.$t('auth.register.check_email', { email: this.data.email }),
          cancel: true
        }).onOk(() => {
          this.loading = true
          this.$auth.register(this.data).then(() => {
            this.$q.dialog({
              message: this.$t('auth.register.account_created')
            }).onOk(data => {
              this.$router.push('/login')
            })
          }).catch((error) => {
            if (error.response) {
              if (error.response.status === 422) {
                this.$q.dialog({
                  message: this.$t('auth.register.invalid_data')
                })
              } else if (error.response.status === 409) {
                this.$q.dialog({
                  message: this.$t('auth.register.already_registered')
                })
              } else {
                console.error(error)
              }
            }
          }).finally(() => {
            this.loading = false
          })
        })
      }
    }
  },
  validations: {
    data: {
      name: { required },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(minPasswordLength)
      },
      repeatPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  }
}
</script>
