<template>
  <q-dialog
    :value="value"
    persistent
    :maximized="$q.screen.lt.md"
    @input="toggle"
  >
    <q-layout
      view="Lhh lpR fff"
      container
      class="bg-white"
      style="height: 750px; minWidth: 85vw"
    >
      <q-header class="bg-primary">
        <q-toolbar>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
          <q-toolbar-title>
            <slot name="title" />
          </q-toolbar-title>
          <q-btn
            v-if="submitButton"
            data-v-step="submit-button"
            :disable="!dirty"
            :loading="submitting"
            color="green"
            @click="save"
          >
            <q-icon
              left
              name="save"
            />
            <div>
              {{ $t('buttons.' + submitButton) }}
            </div>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page
          data-v-step="body"
          class="q-pa-md"
        >
          <slot name="body" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'ResponsiveModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    dirty: {
      type: Boolean,
      default: true
    },
    submitting: {
      type: Boolean,
      default: false
    },
    submitButton: {
      type: String,
      default: null
    }
  },
  methods: {
    toggle (value) {
      this.$emit('input', value)
    },
    save () {
      this.$emit('save')
    }
  }
}
</script>

<style>
</style>
