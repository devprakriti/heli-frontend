<template>
  <div id="app" class="min-h-screen flex flex-col">
    <div class="flex flex-1 bg-gray-800">
      <!-- Sidebar -->
      <aside v-if="isAuthenticated && !loading"
        :class="`bg-primary-700 text-white pb-6 transition-all duration-300 ${isSidebarMinimized ? 'w-24' : 'w-64'}`"
        class="h-full">
        <div class="flex items-center space-x-5 py-6 border-b border-gray-600 px-6 ">
          <div class="text-white p-0 cursor-pointer" @click="toggleSidebar">
            <span v-if="isSidebarMinimized"><i class="pi pi-angle-right text-white  text-base"></i></span>
            <span v-else><i class="pi pi-angle-left text-white text-base"></i></span>
          </div>
          <span v-if="!isSidebarMinimized" class="text-base font-semibold">Menu</span>
        </div>

        <!-- <ul class="space-y-3 mt-4 px-6 ">
          <li>
            <router-link to="/dashboard" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
              'bg-[#6b7280]': isActiveRoute('/dashboard'),
              'hover:bg-gray-700': !isActiveRoute('/dashboard'),
            }">
              <span><i class="pi pi-home"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3 text-base">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
              'bg-[#6b7280]': isActiveRoute('/settings'),
              'hover:bg-gray-700': !isActiveRoute('/settings'),
            }">
              <span><i class="pi pi-cog"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Settings</span>
            </router-link>
          </li>
          <li>
            <router-link to="/accounts" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
              'bg-[#6b7280]': isActiveRoute('/accounts'),
              'hover:bg-gray-700': !isActiveRoute('/accounts'),
            }">
              <span><i class="pi pi-users"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Accounts</span>
            </router-link>
          </li>
          <li>
            <router-link to="/operators" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
              'bg-[#6b7280]': isActiveRoute('/operators'),
              'hover:bg-gray-700': !isActiveRoute('/operators'),
            }">
              <span><i class="pi pi-user "></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Operators</span>
            </router-link>
          </li>
          <li>
            <router-link to="/rules" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
              'bg-[#6b7280]': isActiveRoute('/rules'),
              'hover:bg-gray-700': !isActiveRoute('/rules'),
            }">
              <span><i class="pi pi-file"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Rules</span>
            </router-link>
          </li>
          <li>
            <router-link to="/tickets" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
              'bg-[#6b7280]': isActiveRoute('/tickets'),
              'hover:bg-gray-700': !isActiveRoute('/tickets'),
            }">
              <span><i class="pi pi-ticket"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Tickets</span>
            </router-link>
          </li>
          
        </ul> -->
      
        <ul class="space-y-3 mt-4 px-6">
            <!-- Dashboard -->
            <li>
              <router-link to="/dashboard" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
                'bg-[#6b7280]': isActiveRoute('/dashboard'),
                'hover:bg-gray-700': !isActiveRoute('/dashboard'),
              }">
                <span><i class="pi pi-home"></i></span>
                <span v-if="!isSidebarMinimized" class="ml-3 text-base">Dashboard</span>
              </router-link>
            </li>

            <!-- Settings -->
            <li>
              <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleSettings" :class="{
                'bg-[#6b7280]':isActiveRoute('/profilesettings') || isActiveRoute('/groups') || isActiveRoute('/roles'),
                'hover:bg-gray-700': !isActiveRoute('/profilesettings') && !isActiveRoute('/groups') && !isActiveRoute('/roles'),
              }">
                 <span><i class="pi pi-cog"></i></span>
                <span v-if="!isSidebarMinimized" class="ml-3">Settings</span>
                <span v-if="!isSidebarMinimized" class="ml-auto">
                  <i class="pi" :class="isSettingOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
                </span>
              </div>
              <ul v-if="isSettingOpen" class="ml-6 space-y-2 mt-4">
                <li>
                  <router-link to="/profilesettings" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/profilesettings'),
                    'hover:bg-gray-700': !isActiveRoute('/profilesettings'),
                  }">
                    <span><i class="pi pi-user-edit"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Profile</span>
                  </router-link>
                </li>   
                <li v-if="store?.hasRoutePermission('groups', 'get') || store?.hasRoutePermission('groups', 'view')">
                  <router-link to="/groups" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/groups'),
                    'hover:bg-gray-700': !isActiveRoute('/groups'),
                  }">
                    <span><i class="pi pi-users"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Group</span>
                  </router-link>
                </li>  
                <li v-if="store?.hasRoutePermission('roles', 'get') || store?.hasRoutePermission('roles', 'view')">
                  <router-link to="/roles" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/roles'),
                    'hover:bg-gray-700': !isActiveRoute('/roles'),
                  }">
                    <span><i class="pi pi-user-minus"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Role</span>
                  </router-link>
                </li>         
              </ul>
            </li>

            <li v-if="store?.hasRoutePermission('operators', 'get') || store?.hasRoutePermission('operators', 'view')">
                  <router-link to="/operators" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/operators'),
                    'hover:bg-gray-700': !isActiveRoute('/operators'),
                  }">
                    <span><i class="pi pi-user"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Operators</span>
                  </router-link>
                </li>

            <li >
              <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleSpinwin" :class="{
                'bg-[#6b7280]': isActiveRoute('/accounts') || isActiveRoute('/rules') || isActiveRoute('/tickets') || isActiveRoute('/settings'),
                'hover:bg-gray-700': !isActiveRoute('/accounts') && !isActiveRoute('/tickets') && !isActiveRoute('/rules') && !isActiveRoute('/settings'),
              }">
                 <span><i class="pi pi-bullseye"></i></span>
                <span v-if="!isSidebarMinimized" class="ml-3">Spinwin</span>
                <span v-if="!isSidebarMinimized" class="ml-auto">
                  <i class="pi" :class="isSpinwinOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
                </span>
              </div>
              <ul v-if="isSpinwinOpen" class="ml-6 space-y-2 mt-4">
                <li v-if="store?.hasRoutePermission('settings', 'get') || store?.hasRoutePermission('settings', 'view')">
                  <router-link to="/settings" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/settings'),
                    'hover:bg-gray-700': !isActiveRoute('/settings'),
                  }">
                    <span><i class="pi pi-cog"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Settings</span>
                  </router-link>
                 </li>

                <li v-if="store?.hasRoutePermission('accounts', 'get') || store?.hasRoutePermission('accounts', 'view')">
                  <router-link to="/accounts" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/accounts'),
                    'hover:bg-gray-700': !isActiveRoute('/accounts'),
                  }">
                    <span><i class="pi pi-users"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Accounts</span>
                  </router-link>
                </li>

                <li v-if="store?.hasRoutePermission('rules', 'get') || store?.hasRoutePermission('rules', 'view')">
                  <router-link to="/rules" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/rules'),
                    'hover:bg-gray-700': !isActiveRoute('/rules'),
                  }">
                    <span><i class="pi pi-file"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Rules</span>
                  </router-link>
                </li>

                <!-- Tickets -->
                <li v-if="store?.hasRoutePermission('tickets', 'get') || store?.hasRoutePermission('tickets', 'view')">
                  <router-link to="/tickets" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                    'bg-[#6b7280]': isActiveRoute('/tickets'),
                    'hover:bg-gray-700': !isActiveRoute('/tickets'),
                  }">
                    <span><i class="pi pi-ticket"></i></span>
                    <span v-if="!isSidebarMinimized" class="ml-3">Tickets</span>
                  </router-link>
                </li>           
              </ul>
            </li>

           

            
        </ul>

      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-100">

        <header v-if="isAuthenticated && !loading"
          class=" text-black border-b bg-white backdrop-blur-xl px-6 py-3 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold">{{ pageHeader }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-slate-400">Welcome, {{ user.username }}</span>
            <button class="bg-red-500 text-sm px-4 py-2 text-white rounded hover:bg-red-600"
              @click="logout">Logout</button>
          </div>
        </header>
        <div v-if="loading" class="flex justify-center items-center h-full p-6">
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
import { store } from './store/auth';
export default {

  data() {
    return {
      store,
      isSidebarMinimized: false,
      isSpinwinOpen: false,
      isSettingOpen: false,
      loading: false,
      isSidebarMinimized: false,
      user: {},
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('authToken');
    },
    pageHeader() {
      const route = this.$route.path;
      switch (route) {
        case '/dashboard':
          return 'Dashboard Overview';
        case '/settings':
          return 'Settings';
        case '/profilesettings':
          return 'Profile Settings';
        case '/groups':
          return 'Group';
        case '/roles':
          return 'Role';
        case '/accounts':
          return 'Accounts';
        case '/operators':
          return 'Operators';
        case '/rules':
          return 'Rules';
        case '/tickets':
          return 'Tickets';
        default:
          return 'Dashboard'; 
      }
    },
    canShowSpinwin() {
    return (
      this.store?.hasRoutePermission('accounts', 'get') || this.store?.hasRoutePermission('accounts', 'view') ||
      this.store?.hasRoutePermission('rules', 'get') || this.store?.hasRoutePermission('rules', 'view') ||
      this.store?.hasRoutePermission('tickets', 'get') || this.store?.hasRoutePermission('tickets', 'view')
    );
  }
  },
  methods: {
    toggleSpinwin() {
    this.isSpinwinOpen = !this.isSpinwinOpen;
    },
    toggleSettings(){
    this.isSettingOpen = !this.isSettingOpen;
    },
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized;
      this.isSettingOpen = false
      this.isSpinwinOpen = false
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    async logout() {
        window.location.replace('/login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('profile');
        localStorage.removeItem('routePermissions');
      
    },
  },
  mounted() {
    if (!localStorage.getItem('authToken')) {
      this.$router.push('/login');
    }
  },
  created() {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    },
};
</script>