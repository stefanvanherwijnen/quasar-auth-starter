<template>
  <q-page
    padding
    class="flex justify-center"
  >
    <q-table
      title="Users"
      class="min-width q-ma-sm"
      :dense="$q.screen.lt.md"
      :data="Object.values(users)"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination.sync="pagination"
      :rows-per-page-options="[3, 5, 10, 20]"
      @request="onRequest"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-btn icon="search">
          <q-menu>
            <q-banner class="q-pa-md">
              <q-btn
                class="q-mb-md"
                round
                icon="clear"
                size="sm"
                @click="resetFilter"
              >
              </q-btn>
              <q-input
                v-for="field in Object.keys(filterFields)"
                :key="field"
                dense
                debounce="300"
                v-model="filterFields[field]"
                :label="$t('auth.users.labels.' + field) + '...'"
                filled
              >
              </q-input>
            </q-banner>
          </q-menu>
        </q-btn>
      </template>
      <template v-slot:body-cell-button="props">
        <q-td :props="props">
          <q-btn
            icon="edit"
            size="sm"
          >
            <q-menu>
              <q-list>
                <q-item
                  clickable
                  @click="editUser(props.row._jv.id)"
                  v-close-popup
                >
                  <q-item-section>
                    {{ $t('auth.users.edit_label') }}
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="verifyUser(props.row)"
                  v-close-popup
                >
                  <q-item-section>
                    {{ $t('auth.users.verify_label') }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-verified="props">
        <q-td :props="props">
          <q-checkbox :value="Boolean(props.row.verified)">
          </q-checkbox>
        </q-td>
      </template>
    </q-table>

    <responsive-modal
      v-model="editModal.opened"
      :submitting="editModal.isSubmitting"
      submit-button="send"
      @save="submitUser(editModal.data)"
    >
      <template slot="title">
        {{ editModal.data.email }}
      </template>
      <template slot="body">
        <q-input
          v-model="editModal.data.name"
          :label="$t('auth.users.labels.name')"
        >
        </q-input>
      </template>
    </responsive-modal>
  </q-page>
</template>

<style>
</style>

<script>
import { extend } from 'quasar'
import responsiveModal from 'components/ResponsiveModal'
let rowsNumber = 10
const emptyFilterFields = {
  email: '',
  name: ''
}
export default {
  name: 'SuperuserUsers',
  preFetch ({ store }) {
    return store.dispatch('jv/get', 'users').then((response) => {
      rowsNumber = response._jv.json.meta.total
    })
  },
  components: {
    responsiveModal
  },
  computed: {
    filter: function () {
      return JSON.stringify(this.filterFields)
    }
  },
  data () {
    return {
      loading: false,
      filterFields: extend(true, this.filterFields, emptyFilterFields),
      pagination: {
        sortBy: 'id',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: rowsNumber
      },
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: row => row._jv.id },
        { name: 'email', align: 'center', label: 'Email', field: row => row.email },
        { name: 'name', align: 'center', label: 'Name', field: row => row.name },
        { name: 'verified', align: 'center', label: 'Verified', field: row => row.verified },
        { name: 'button', align: 'right' }
      ],
      users: this.$store.getters['jv/get']('user'),
      editModal: {
        opened: false,
        isSubmitting: false,
        data: {
          email: '',
          name: ''
        }
      }
    }
  },
  methods: {
    resetFilter () {
      this.filterFields = extend(true, this.filterFields, emptyFilterFields)
    },
    onRequest (props) {
      let { page, rowsPerPage } = props.pagination

      this.loading = true

      const filterObj = JSON.parse(props.filter)
      const filter = Object.keys(filterObj).reduce((acc, cur) => {
        if (filterObj[cur]) {
          acc[cur] = filterObj[cur]
        }
        return acc
      }, {})
      const params = {
        filter: filter,
        page: {
          number: page,
          size: rowsPerPage
        }
      }
      return this.$store.dispatch('jv/get', ['users', { params: params }]).then((response) => {
        this.pagination.rowsNumber = response._jv.json.meta.total
        delete response._jv
        this.users = response
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.loading = false
      })
    },
    editUser (id) {
      this.editModal.opened = true
      this.editModal.data = this.$store.getters['jv/get']('user/' + id)
    },
    submitUser (user) {
      this.editModal.isSubmitting = true
      this.$store.dispatch('jv/patch', [user, { url: 'users' }])
        .then((response) => {
          this.users[response._jv.id] = { ...this.users[response._jv.id], ...response }
          this.editModal.opened = false
        })
        .finally(() => {
          this.editModal.isSubmitting = false
        })
    },
    verifyUser (user) {
      this.$q.dialog({
        title: this.$t('auth.users.verify_label'),
        message: this.$t('users.verify_message', { user: user.email }),
        cancel: true
      }).onOk(data => {
        this.$auth.verify(user.verificationToken).then(() => {
          user.verified = 1
        })
      })
    }
  }
}
</script>
