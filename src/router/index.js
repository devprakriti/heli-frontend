import { createRouter, createWebHistory } from 'vue-router';
import AdminLogin from '@/views/Login.vue'; 
import AdminDashboard from '@/views/Dashboard.vue';
import AdminSettings from '@/views/Settings.vue';
import AdminOperators from '@/views/Operators.vue';
import AdminGroup from '@/views/Group.vue';
import AdminRole from '@/views/Role.vue';
import AdminTickets from '@/views/Tickets.vue'
import Rules from '@/views/Rules.vue';
import ProfileSettings from '@/views/ProfileSettings.vue';
import AdminAccounts from  '@/views/Accounts.vue';
import Test from '@/views/Test.vue';


const routes = [
  { path: '/', redirect: '/dashboard' }, // This ensures that visiting '/' redirects to the login page
  { path: '/login', name: 'Login', component: AdminLogin }, // Login page route
  { 
    path: '/dashboard',
    name: 'Dashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/settings', 
    name: 'Settings',
    component: AdminSettings,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/profilesettings', 
    name: 'ProfileSettings',
    component: ProfileSettings,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/groups', 
    name: 'Group',
    component: AdminGroup,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/roles', 
    name: 'Role',
    component: AdminRole,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/accounts', 
    name: 'Accounts',
    component: AdminAccounts,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/operators', 
    name: 'Operators',
    component: AdminOperators,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/rules', 
    name: 'Rules',
    component: Rules,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/test', 
    name: 'Test',
    component: Test,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  { 
    path: '/tickets', 
    name: 'Tickets',
    component: AdminTickets,
    meta: {
      requiresAuth: true  // Only allow access to authenticated users
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');  // Check if authToken exists

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the route requires authentication and no authToken is found, redirect to login
    if (!isAuthenticated) {
      next({ name: 'Login' });
    } else {
      next();  // Proceed to the route
    }
  } else {
    next();  // Proceed for routes that don't require authentication
  }
});

export default router;
