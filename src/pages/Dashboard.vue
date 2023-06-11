<template>
  <v-card>
    <OverlayLoader :isLoading="isLoading" />
    <div class="flex justify-between p-4">
      <div class="flex flex-col md:flex-row w-full md:space-x-8">
        <v-text-field
          v-model="customerSearch"
          variant="outlined"
          label="Search (Name / IC No.)"
          type="text"
          density="compact"
          bg-color="white"
          class="md:w-[150px]"
        >
          <template #prepend-inner>
            <v-icon class="text-[18px]">fa-solid fa-magnifying-glass</v-icon>
          </template>
        </v-text-field>
        <v-btn class="!bg-primary text-white font-bold px-4 mb-5 md:mb-0" variant="flat" height="38" @click="searchCustomer()">
          Search
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="!bg-primary text-white font-bold px-4" variant="flat" height="38" @click="customerDialog = true">
          Register Customer
        </v-btn>
      </div>
    </div>
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="tableHeaders"
      :items="customerData"
      :search="customerSearchAction"
      :filter-keys="['full_name', 'identity_no']"
      :sort-by="[{ key: 'name', order: 'asc' }]"
    >
      <template #[`item.created_at`]="{ item }">
        <div>{{ format(parseISO(item.raw.created_at), 'yyyy/MM/dd h:mm aa') }}</div>
      </template>
      <template #[`item.status`]="{ item }">
        <div class="capitalize">{{ item.raw.status }}</div>
      </template>
      <template #[`item.gender`]="{ item }">
        <div class="capitalize">{{ item.raw.gender }}</div>
      </template>
      <template #[`item.action`]="{ item }">
        <div class="flex space-x-3">
          <v-icon size="small" @click="editCustomer(item.raw)">
            fa-solid fa-pen-to-square
          </v-icon>
          <v-icon size="small" @click="deleteCustomer(item.raw)">
            fa-solid fa-trash
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog 
    v-model="deleteCustomerDialog"
    class="flex mx-auto w-full md:w-4/12"
    height="auto"
  >
    <v-card>
      <v-toolbar class="!bg-primary text-white text-center">
        <v-toolbar-title class="!m-0">Delete {{ editedCustomer.full_name }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="font-bold !text-lg text-center">
        Are you sure you want to delete this customer?
      </v-card-text>
      <v-card-actions class="justify-center space-x-8">
        <v-btn color="grey-lighten-3 font-bold px-5" variant="flat" @click="closeDeleteCustomerDialog">
          Cancel
        </v-btn>
        <v-btn class="font-bold px-8 !bg-primary text-white" variant="flat" @click="deleteCustomerConfirm">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog 
    v-model="customerDialog"
    class="flex mx-auto w-full md:w-4/12"
    height="auto"
    scrollable
  >
  <v-card>
    <v-toolbar class="!bg-primary text-white text-center fixed z-[999]">
      <v-toolbar-title class="!m-0">{{ formTypeTitle ? 'Register New Customer' : `Edit ${editedCustomer.full_name}` }}</v-toolbar-title>
    </v-toolbar>
    <div class="flex flex-col justify-center items-center pt-[64px]">
      <v-form ref="createCustomerForm" v-model="isFormValid" @submit.prevent="registerCustomer" class="w-3/4 py-5 space-y-3">
        <div>
          <v-label>Full Name*</v-label>
          <v-text-field
            v-model="editedCustomer.full_name"
            :rules="customerFullNameRules"
            variant="solo"
            placeholder="Customer Full Name"
            type="text"
            autofocus
            single-line
            density="compact"
          ></v-text-field>
        </div>
        <div>
          <v-label>Gender</v-label>
          <v-radio-group v-model="editedCustomer.gender" inline :rules="customerGenderRules">
            <v-radio value="male">
              <template v-slot:label>
                <div>Male</div>
              </template>
            </v-radio>
            <v-radio value="female">
              <template v-slot:label>
                <div>Female</div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <div>
          <v-label>Phone Number*</v-label>
          <v-text-field
            v-model="editedCustomer.phone_number"
            :rules="customerPhoneNumberRules"
            variant="solo"
            placeholder="Example 01xxxxxxx"
            single-line
            type="number"
            density="compact"
          ></v-text-field>
        </div>
        <div>
          <v-label>Email*</v-label>
          <v-text-field
            v-model="editedCustomer.email"
            :rules="customerEmailRules"
            variant="solo"
            placeholder="Example abc@gmail.com"
            single-line
            type="email"
            density="compact"
          ></v-text-field>
        </div>
        <div>
          <v-label>Identification Number*</v-label>
          <v-text-field
            v-model="editedCustomer.identity_no"
            :rules="identificationNumberRules"
            variant="solo"
            placeholder="Example IC No."
            single-line
            type="number"
            density="compact"
          ></v-text-field>
        </div>
        <div>
          <v-label>Status</v-label>
          <v-radio-group v-model="editedCustomer.status" inline :rules="customerStatusRules">
            <v-radio value="active">
              <template v-slot:label>
                <div>Active</div>
              </template>
            </v-radio>
            <v-radio value="inactive">
              <template v-slot:label>
                <div>Inactive</div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <v-card-actions class="justify-center space-x-8">
          <v-btn color="grey-lighten-3 font-bold px-8" variant="flat" @click="closeCustomerDialog">
            Cancel
          </v-btn>
          <v-btn type="submit" class="font-bold px-8 !bg-primary text-white" variant="flat">{{ formTypeTitle ? 'Create' : 'Update' }}</v-btn>
        </v-card-actions>
      </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import Swal from 'sweetalert2'
import OverlayLoader from '../components/OverlayLoader.vue'
import { format, parseISO } from 'date-fns'

const createCustomerForm=ref<HTMLFormElement>()
const isFormValid = ref(false)
const isLoading = ref(false)
const itemsPerPage = ref(10)
const customerSearch = ref('')
const customerSearchAction = ref('')
const tableHeaders = [
  { title: 'Full Name', key: 'full_name' },
  { title: 'Gender', key: 'gender' },
  { title: 'Phone Number', key: 'phone_number' },
  { title: 'Email', key: 'email' },
  { title: 'Identification Number', key: 'identity_no' },
  { title: 'Joined On', key: 'created_at' },
  { title: 'Status', key: 'status' },
  {
    title: 'Actions',
    key: 'action',
    sortable: false,
  },
]
const customerData = ref([
  {
    full_name: 'Tan Boon Heong',
    gender: 'male',
    phone_number: '0167890123',
    email: 'tbh@gmail.com',
    identity_no: '801234089543',
    created_at: '2023-06-10T22:04:36.436Z',
    status: 'active',
  },
  {
    full_name: 'Chin Shin Xuan',
    gender: 'female',
    phone_number: '0161237895',
    email: 'tsx@gmail.com',
    identity_no: '909985012345',
    created_at: '2023-05-29T12:30:36.436Z',
    status: 'inactive',
  }
])
const editedIndex = ref(-1)
const customerDialog = ref(false)
const deleteCustomerDialog = ref(false)
const editedCustomer = ref({
  full_name: '',
  gender: '',
  phone_number: '',
  email: '',
  identity_no: '',
  created_at: new Date().toISOString(),
  status: '',
})
const defaultCustomer = ref({
  full_name: '',
  gender: '',
  phone_number: '',
  email: '',
  identity_no: '',
  created_at: new Date().toISOString(),
  status: '',
})

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const customerFullNameRules = [
  (value:any) => !!value || 'You must enter name.',
]
const customerPhoneNumberRules = [
  (value:any) => !!value || 'You must enter phone number.',
  (value:any) => value.length <= 12 || 'Invalid phone number',
]
const customerGenderRules = [
  (value:any) => !!value || 'You must select gender.',
]
const customerEmailRules = [
  (value:any) => !!value || 'You must enter email address.',
  (value:any) => emailPattern.test(value) || 'Invalid email'
]
const identificationNumberRules = [
  (value:any) => !!value || 'You must enter identification number.',
  (value:any) => value.length <= 12 || 'Invalid identification number',
]
const customerStatusRules = [
  (value:any) => !!value || 'You must select status.',
]

watch(() => customerDialog.value, (val:any) => {
  val || closeCustomerDialog()
})

watch(() => deleteCustomerDialog.value, (val:any) => {
  val || closeDeleteCustomerDialog()
})

const searchCustomer = () => {
  customerSearchAction.value = customerSearch.value
}

const formTypeTitle = computed(() => {
  return editedIndex.value === -1
})

const closeCustomerDialog = async() => {
  customerDialog.value = false
  await nextTick()
  resetCustomerForm()
}

const closeDeleteCustomerDialog = async() => {
  deleteCustomerDialog.value = false
  await nextTick()
  resetCustomerForm()
}

const deleteCustomer = (item:any) => {
  editedIndex.value = customerData.value.indexOf(item)
  editedCustomer.value = Object.assign({}, item)
  deleteCustomerDialog.value = true
}

const deleteCustomerConfirm = () => {
  isLoading.value = true
  setTimeout(() => {
    try {
      customerData.value.splice(editedIndex.value, 1)
      isLoading.value = false
      Swal.fire({
        icon: 'success',
        title: 'Customer Deleted Successfully',
        timer: 1500,
        timerProgressBar: true,
      })
    } catch(error:any) {
      isLoading.value = false
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: error,
      })
    }
    closeDeleteCustomerDialog()
  }, 1000);
}

const editCustomer = (item:any) => {
  editedIndex.value = customerData.value.indexOf(item)
  editedCustomer.value = Object.assign({}, item)
  customerDialog.value = true
}

const registerCustomer = () => {
  if (isFormValid.value) {
    isLoading.value = true
    setTimeout(() => {
      try {
        if (editedIndex.value > -1) {
          Object.assign(customerData.value[editedIndex.value], editedCustomer.value)
        } else {
          customerData.value.push(editedCustomer.value)
        }
        isLoading.value = false
        Swal.fire({
          icon: 'success',
          title: `Customer ${formTypeTitle.value ? 'Registered' : 'Edited'} Successfully`,
          timer: 1500,
          timerProgressBar: true,
        })

      } catch(error:any) {
        isLoading.value = false
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: error,
        })
      }
      closeCustomerDialog()
    }, 1500);
  }
}

const resetCustomerForm = () => {
  editedCustomer.value = Object.assign({}, defaultCustomer.value)
  editedIndex.value = -1
}
</script>

<style scoped>
:deep(.v-data-table-header__content) {
  font-weight: bold;
}

:deep(.v-toolbar-title) {
  font-weight: bold;
}
</style>