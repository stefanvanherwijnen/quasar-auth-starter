<template>
  <q-page class="flex flex-center">
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.login.login') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          id="email"
          v-model.trim="data.body.email"
          type="email"
          :label="this.$t('auth.login.email')"
          :error="this.$v.data.body.email.$error"
          required
          autofocus
        />
        <q-input
          id="password"
          v-model="data.body.password"
          type="password"
          :label="this.$t('auth.login.password')"
          :error="$v.data.body.password.$error"
          required
          @keyup.enter="login"
        /><br>
        <q-checkbox
          id="rememberMe"
          v-model="data.rememberMe"
          :label="this.$t('auth.login.remember_me')"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          color="primary"
          :loading="loading"
          @click="login"
        >
          {{ $t('auth.login.login') }}
        </q-btn>
      </q-card-actions>
      <router-link to="/password/forgot">
        <a>{{ this.$t('auth.login.password_forgot') }}</a>
      </router-link>
    </q-card>
  </q-page>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data () {
    return {
      data: {
        body: {
          email: '',
          password: ''
        },
        rememberMe: false
      },
      loading: false
    }
  },
  methods: {
    login () {
      this.$v.data.$touch()
      if (!this.$v.data.$error) {
        this.loading = true
        this.$auth.login(this.data).then((response) => {
          this.$router.push('/account')
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              this.$q.dialog({
                message: this.$t('auth.login.verification_required')
              })
            } else if (error.response.status === 403) {
              this.$q.dialog({
                message: this.$t('auth.login.invalid_credentials')
              })
            } else {
              console.error(error)
            }
          }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  },
  validations: {
    data: {
      body: {
        email: {
          required,
          email
        },
        password: {
          required
        }
      }
    }
  }
}
</script>
