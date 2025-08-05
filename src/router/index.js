import { createRouter, createWebHistory } from 'vue-router';
import AdminLogin from '@/views/Login.vue';  // Login view
import AdminDashboard from '@/views/Dashboard.vue';  // Dashboard view
import AdminSettings from '@/views/Settings.vue';  // Settings view
import AdminOperators from '@/views/Operators.vue';  // Operators view
import AdminGroup from '@/views/Group.vue';  // Group view
import AdminRole from '@/views/Role.vue';  // Role view
import AdminTickets from '@/views/Tickets.vue';  // Tickets view
import AdminAccounts from '@/views/Accounts.vue';  // Accounts view
import AdminRules from '@/views/Rules.vue';  // Rules view
import ProfileSettings from '@/views/ProfileSettings.vue';  // Profile Settings view
import Unauthorized from '../views/Unauthorized.vue';
import { store } from '../store/auth';

const routes = [
  { path: '/', redirect: '/login' },  // Redirect '/' to login
  { path: '/login', name: 'Login', component: AdminLogin },  // Login view route
  { 
    path: '/dashboard',
    name: 'Dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true },  // Protect the route
  },
  { 
    path: '/settings',
    name: 'Settings',
    component: AdminSettings,
    meta: { requiresAuth: true },
  },
  { 
    path: '/profilesettings',
    name: 'ProfileSettings',
    component: ProfileSettings,
    meta: { requiresAuth: true },
  },
  { 
    path: '/groups',
    name: 'Groups',
    component: AdminGroup,
    meta: { requiresAuth: true },
  },
  { 
    path: '/roles',
    name: 'Roles',
    component: AdminRole,
    meta: { requiresAuth: true },
  },
  { 
    path: '/accounts',
    name: 'Accounts',
    component: AdminAccounts,
    meta: { requiresAuth: true },
  },
  { 
    path: '/operators',
    name: 'Operators',
    component: AdminOperators,
    meta: { requiresAuth: true },
  },
  { 
    path: '/rules',
    name: 'Rules',
    component: AdminRules,
    meta: { requiresAuth: true },
  },
  { 
    path: '/tickets',
    name: 'Tickets',
    component: AdminTickets,
    meta: { requiresAuth: true },
  },
  { 
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',  // Catch-all route that redirects to login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check if the user is authenticated before accessing protected routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');  // Check for auth token
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({ name: 'Login' });  // Redirect to login if not authenticated
    }
  }
  next();  // Proceed to the route
});

export default router;
