<template>
  <v-layout>
    <v-navigation-drawer
      :active="!isMobile"
      color="#f5f5f5"
      :mobile-breakpoint="640"
      width="130"
      class="!fixed max-w-full"
    >
      <v-list class="flex flex-col items-center">
        <v-list-item
          v-for="(item, i) in navs"
          :key="i"
          :to="item.to"
          router
          exact
          class="my-2 py-3 h-auto rounded-md"
        >
          <div class="flex flex-col items-center">
            <v-icon 
              :size="22"
              :class="[isRouteMatch(item) ? '!text-primary' : 'text-white']"
              >{{ item.icon }}</v-icon
            >
            <v-list-item-title>
              <span class="font-bold">{{ item.title }}</span>
            </v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-bottom-navigation
      :active="isMobile"
      bg-color="#000000"
      color="#000000"
      grow
      class="!fixed"
    >
      <v-btn
        v-for="(item, i) in navs"
        :key="i"
        :to="item.to"
        router
        exact
        :class="['!px-[5px] !text-[10px]', isRouteMatch(item) ? '!text-primary' : 'text-white']"
        :prepend-icon="item.icon"
      >
        {{ item.title }}
      </v-btn>
    </v-bottom-navigation>
    <v-app-bar class="!fixed">
      <div class="font-bold px-2 text-lg">{{ headerTitle }}</div>
      <v-spacer></v-spacer>
      <UserMenu />
    </v-app-bar>
    <v-main>
      <v-container fluid class="h-full min-h-full">
        <slot></slot>
      </v-container>
    </v-main>
  </v-layout>
</template>
  
<script>
import UserMenu from '../components/UserMenu.vue'

export default {
  name: 'DefaultLayout',
  components: { UserMenu },
  data() {
    return {
      isAdmin: true,
      isStudent: false,
      items: [
        {
          icon: 'fa-solid fa-users-gear',
          title: 'Customer',
          to: '/',
          admin: true,
          student: false,
        },
      ],
      isMobile: false,
      navigationTitle: '',
    }
  },
  computed: {
    navs() {
      return this.isAdmin
        ? this.items.filter((i) => i.admin === true)
        : this.items.filter((i) => i.student === true)
    },
    headerTitle() {
      return this.navigationTitle + ' Management' 
    },
  },
  mounted() {
    this.checkBreakpoint()
    window.addEventListener('resize', () => this.checkBreakpoint())
  },
  methods: {
    checkBreakpoint() {
      if (window.innerWidth > 640) {
        this.isMobile = false
      } else {
        this.isMobile = true
      }
    },
    isRouteMatch(route) {
      if (route.to === this.$route.path) {
        this.navigationTitle = route.title
        return true
      }
      else return false
    },
  },
}
</script>
<style scoped>
.v-list--nav {
  padding: 20px 20px;
}

:deep(.v-app-bar) {
  box-shadow: 0px 0px 10px #00000029 !important;
}
:deep(.v-toolbar__content) {
  padding: 4px 20px;
}
@screen md {
  :deep(.v-toolbar__content) {
    padding: 4px 30px;
  }
}

:deep(.v-list-item) {
  height: 58px;
}

.container {
  padding: 0;
}
</style>
  