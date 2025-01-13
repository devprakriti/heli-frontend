<template>
  <div id="app" class="min-h-screen flex flex-col">
    <header v-if="isAuthenticated && !loading" class="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button class="text-white bg-blue-500 p-2 rounded hover:bg-blue-400" @click="toggleSidebar">
          <span v-if="isSidebarMinimized">▶</span>
          <span v-else>◀</span>
        </button>
        <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <div class="flex items-center space-x-4">
        <span>Welcome, Admin</span>
        <button class="bg-red-500 px-4 py-2 rounded hover:bg-red-600" @click="logout">Logout</button>
      </div>
    </header>

    <div class="flex flex-1 bg-gray-800">
      <!-- Sidebar -->
      <aside
        v-if="isAuthenticated && !loading"
        :class="`bg-gray-800 text-white p-6 transition-all duration-300 ${isSidebarMinimized ? 'w-16' : 'w-64'}`"
        class="h-full"
      >
        <div class="flex items-center space-x-4">
          <span v-if="!isSidebarMinimized" class="text-lg font-bold">Menu</span>
        </div>
        <ul class="space-y-2 mt-4">
          <li>
            <router-link
              to="/dashboard"
              class="flex items-center py-2 px-4 rounded transition-all"
              :class="{
                'bg-blue-500': isActiveRoute('/dashboard'),
                'hover:bg-gray-700': !isActiveRoute('/dashboard'),
              }"
            >
              <span>🏠</span>
              <span v-if="!isSidebarMinimized" class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/settings"
              class="flex items-center py-2 px-4 rounded transition-all"
              :class="{
                'bg-blue-500': isActiveRoute('/settings'),
                'hover:bg-gray-700': !isActiveRoute('/settings'),
              }"
            >
              <span>⚙️</span>
              <span v-if="!isSidebarMinimized" class="ml-3">Settings</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/accounts"
              class="flex items-center py-2 px-4 rounded transition-all"
              :class="{
                'bg-blue-500': isActiveRoute('/accounts'),
                'hover:bg-gray-700': !isActiveRoute('/accounts'),
              }"
            >
              <span>👥</span>
              <span v-if="!isSidebarMinimized" class="ml-3">Accounts</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/rules"
              class="flex items-center py-2 px-4 rounded transition-all"
              :class="{
                'bg-blue-500': isActiveRoute('/rules'),
                'hover:bg-gray-700': !isActiveRoute('/rules'),
              }"
            >
              <span>⚖️</span>
              <span v-if="!isSidebarMinimized" class="ml-3">Rules</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/tickets"
              class="flex items-center py-2 px-4 rounded transition-all"
              :class="{
                'bg-blue-500': isActiveRoute('/tickets'),
                'hover:bg-gray-700': !isActiveRoute('/tickets'),
              }"
            >
              <span>🎫</span>
              <span v-if="!isSidebarMinimized" class="ml-3">Tickets</span>
            </router-link>
          </li>
          
          <li>
            <Menu
              :model="operatorMenuItems"
              popup
              ref="menu"
              :class="{
                'ml-2': !isSidebarMinimized,
              }"
            ></Menu>
            <div
              @click="$refs.menu.toggle($event)"
              class="flex items-center py-2 px-4 rounded cursor-pointer transition-all"
              :class="{
                'bg-blue-500': isActiveRoute('/operators'),
                'hover:bg-gray-700': !isActiveRoute('/operators'),
              }"
            >
              <span>👨‍🔧</span>
              <span v-if="!isSidebarMinimized" class="ml-3">Operators</span>
              <span class="ml-auto" v-if="!isSidebarMinimized">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 bg-gray-100">
        <div v-if="loading" class="flex justify-center items-center h-full">
          <div class="text-center">
            <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
            <p class="text-xl mt-2">Processing...</p>
          </div>
        </div>
        <router-view v-else></router-view>
      </main>
    </div>
  </div>
</template>
<script>

export default {

  data() {
    return {
      loading: false,
      isSidebarMinimized: false,
      operatorMenuItems: [
        { label: 'Create Operator', icon: 'pi pi-plus', command: () => this.$router.push('/operators/create') },
        { label: 'Edit Operator', icon: 'pi pi-pencil', command: () => this.$router.push('/operators/edit') },
      ],
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('authToken');
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized;
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    async logout() {
      this.loading = true;
      setTimeout(() => {
        localStorage.removeItem('authToken');
        this.loading = false;
        this.$router.push('/login');
        window.location.reload();
      }, 1000);
    },
  },
  mounted() {
    if (!localStorage.getItem('authToken')) {
      this.$router.push('/login');
    }
  },
};
</script>
