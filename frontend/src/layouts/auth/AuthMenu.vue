<template>
  <div>
    <div class="column flex-center">
      <q-icon
        name="person"
        size="3rem"
        class="q-mt-lg"
      />
      <div v-if="$auth.user()">
        {{ $auth.user().email }}
      </div>
    </div>
    <q-list
      no-border
      link
      inset-delimiter
    >
      <q-item
        v-if="this.$auth.check()"
        clickable
        @click="$router.push('/account')"
      >
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('auth.my_account') }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-if="!this.$auth.check()"
        clickable
        @click="$router.push('/login')"
      >
        <q-item-section avatar>
          <q-icon name="exit_to_app" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('auth.login.login') }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-if="!this.$auth.check()"
        clickable
        @click="$router.push('/register')"
      >
        <q-item-section avatar>
          <q-icon name="person_add" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('auth.register.register') }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-if="this.$auth.check()"
        clickable
        @click="$router.push('/logout')"
      >
        <q-item-section avatar>
          <q-icon name="power_settings_new" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('auth.logout.logout') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <hr>
    <q-list
      v-if="this.$auth.check('administrator')"
      no-border
      link
      inset-delimiter
    >
      <q-item-label header>
        {{ $t('auth.administrator.title') }}
      </q-item-label>
      <q-item
        clickable
        @click="$router.push('/admin/home')"
      >
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('auth.home') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <br>
    <q-list
      v-if="this.$auth.check('superuser')"
      no-border
      link
      inset-delimiter
    >
      <q-item-label header>
        {{ $t('auth.superuser.title') }}
      </q-item-label>
      <q-item
        clickable
        @click="$router.push('/superuser/users')"
      >
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('auth.superuser.users.users') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'AuthMenu'
}
</script>
