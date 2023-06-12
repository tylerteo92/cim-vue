<template>
  <div class="flex items-center py-1 px-2 !bg-primary rounded-[5px] text-white font-bold">
    Admin
    <v-btn
      id="menu-activator"
      icon="fa-solid fa-circle-chevron-down"
      variant="text"
      color="white"
      size="x-small"
    >
    </v-btn>
    <v-menu
      v-model="menu"
      activator="#menu-activator"
      :close-on-content-click="false"
    >
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :value="index"
          @click="menuAction(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menu = ref(false)
const menuItems = ref([
  { title: 'Logout', action: 'logout' },
])

const menuAction = (action:any) => {
  if (action.action === 'logout') {
    logout()
  }
}

const logout = () => {
  Swal.fire({
    icon: 'question',
    text: `You are about to logout. Continue?`,
    timer: 3000,
    timerProgressBar: true,
    showCancelButton: true,
  }).then(async(res) => {
    if (res.isConfirmed || res.dismiss === Swal.DismissReason.timer) {
      router.push({ name: 'home' })
    }
  })
}
</script>

<style scoped>
.logout-container {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  @apply px-[36px] py-[20px];
}
</style>
  
