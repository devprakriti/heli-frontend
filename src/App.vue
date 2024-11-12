<template>
  <div id="app" class="min-h-screen flex flex-col">
    <header v-if="isAuthenticated && !loading" class="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      <div class="flex items-center space-x-4">
        <span>Welcome, Admin</span>
        <button class="bg-red-500 px-4 py-2 rounded hover:bg-red-600" @click="logout">Logout</button>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar: Only show if user is authenticated and not loading -->
      <aside v-if="isAuthenticated && !loading" class="w-64 bg-gray-800 text-white p-6">
        <h2 class="text-lg font-bold mb-4">Menu</h2>
        <ul class="space-y-2">
          <li>
            <router-link to="/dashboard" class="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/settings" class="block py-2 px-4 rounded hover:bg-gray-700">Settings</router-link>
          </li>
          <li>
            <router-link to="/accounts" class="block py-2 px-4 rounded hover:bg-gray-700">Accounts</router-link>
          </li>
          <li>
            <router-link to="/operators" class="block py-2 px-4 rounded hover:bg-gray-700">Operators</router-link>
          </li>
          <li>
            <router-link to="/rules" class="block py-2 px-4 rounded hover:bg-gray-700">Rules</router-link>
          </li>
          <li>
            <router-link to="/tickets" class="block py-2 px-4 rounded hover:bg-gray-700">Tickets</router-link>
          </li>
          <!-- <li>
            <router-link to="/test" class="block py-2 px-4 rounded hover:bg-gray-700">Test</router-link>
          </li> -->
        </ul>
      </aside>

      <!-- Main Content or Processing Screen -->
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
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('authToken'); 
    },
  },
  methods: {
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

<style scoped>
.spinner-border {
  border-top-color: transparent;
  border-right-color: #3498db;
  border-bottom-color: #3498db;
  border-left-color: transparent;
}
</style>
