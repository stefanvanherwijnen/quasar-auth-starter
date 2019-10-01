<template>
  <q-page class="flex flex-center">
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.password.reset.header') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          id="password"
          v-model="form.password"
          type="password"
          :label="$t('auth.labels.password')"
          bottom-slots
          required
          :error="$v.form.password.$error"
          :error-message="$t('auth.password.errors.password_length', {length: minPasswordLength})"
        />
        <q-input
          id="repeatPassword"
          v-model="form.repeatPassword"
          type="password"
          :label="$t('auth.labels.repeat_password')"
          bottom-slots
          required
          :error="$v.form.repeatPassword.$error"
          :error-message="$t('auth.password.errors.password_match')"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="fit"
          color="primary"
          :loading="loading"
          @click="recoverPassword"
        >
          {{ $t('auth.submit') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

var minPasswordLength = 8

export default {
  name: 'PasswordReset',
  data () {
    return {
      form: {
        password: '',
        repeatPassword: ''
      },
      loading: false,
      minPasswordLength: minPasswordLength
    }
  },
  methods: {
    recoverPassword () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.loading = true
        this.token = this.$route.query.token
        this.$auth.passwordReset({ token: this.token, data: { 'password': this.form.password } }).then((response) => {
          this.$q.dialog({
            message: this.$t('auth.password.reset.success')
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
    form: {
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
