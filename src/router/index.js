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
import Unauthorized from '../views/Unauthorized.vue';
import { store } from '../store/auth';

const routes = [
  { path: '/', redirect: '/dashboard' }, // This ensures that visiting '/' redirects to the login page
  { path: '/login', name: 'Login', component: AdminLogin }, // Login page route
  { 
    path: '/dashboard',
    name: 'Dashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true,  // Only allow access to authenticated users
    }
  },
  { 
    path: '/settings', 
    name: 'Settings',
    component: AdminSettings,
    meta: {
      requiresAuth: true,  // Only allow access to authenticated users
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
    name: 'Groups',
    component: AdminGroup,
    meta: {
      requiresAuth: true,  // Only allow access to authenticated users,
    }
  },
  { 
    path: '/roles', 
    name: 'Roles',
    component: AdminRole,
    meta: {
      requiresAuth: true,  // Only allow access to authenticated users
    }
  },
  { 
    path: '/accounts', 
    name: 'Accounts',
    component: AdminAccounts,
    meta: {
      requiresAuth: true,  // Only allow access to authenticated users
    }
  },
  { 
    path: '/operators', 
    name: 'Operators',
    component: AdminOperators,
    meta: {
      requiresAuth: true,  // Only allow access to authenticated users
    }
  },
  { 
    path: '/rules', 
    name: 'Rules',
    component: Rules,
    meta: {
      requiresAuth: true,  // Only allow access to authenticated users
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
    path: '/unauthorized', 
    name: 'Unauthorized',
    component: Unauthorized,
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
  const isAuthenticated = !!localStorage.getItem('authToken');
  const allRouteNames = router.getRoutes().map(route => route.name).filter(route => route != undefined);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' });
    } 
    if (to.name === 'Dashboard') {
      return next()
    }
    const routeKey = to.name.toLowerCase();
    const permissionObj = store?.routePermissions[routeKey] || null;
    if (permissionObj && (permissionObj.get || permissionObj?.view)) {
      const requiredSlug = permissionObj.get && permissionObj?.view;
      if (!store?.hasPermission(requiredSlug)) {
        return next({ name: 'Unauthorized' }); 
      }
    }
    return next();
  } else {
    next(); 
  }
});

export default router;
