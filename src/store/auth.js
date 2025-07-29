import { reactive } from 'vue'
import axios from "axios";
export const store = reactive({
  profile: null,
  routePermissions:{},
  setProfile(profileData) {
    this.profile = profileData
  },
  setRoutePermissions(routePermissions) {
    this.routePermissions = routePermissions
  },

// Check if the user has permission
hasPermission(slug) {
  if (!this.profile) return false;
  console.log('slug',slug)
  console.log('profilesdas', this.profile)
  const userSlugs = new Set(
    this.profile.map(p => p.permission_slug)
  );
  return userSlugs.has(slug);
},

// Check if the user has route-specific permission
hasRoutePermission(route, operation) {
  const routeName = route.toLowerCase(); 
  const routePermissions = JSON.parse(localStorage.getItem("routePermissions")) || {};

  const permissionsForRoute = routePermissions[routeName];
  console.log('prakriti',permissionsForRoute)
  if (!permissionsForRoute) {
    return false;
  }
  const requiredSlug = permissionsForRoute[operation];
  if (!requiredSlug) {
    return false;
  }
  return this.hasPermission(requiredSlug);
},

async getRolePermission(token){
  try {
      const response = await axios.get("/api/permissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        
        response.data.permissionsList.forEach((permission) => {
          
          const module = permission?.Module?.toLowerCase().endsWith('s') ? permission?.Module?.toLowerCase() : permission?.Module?.toLowerCase() + 's'
          const slug = permission?.Slug?.toLowerCase()
          const action = slug.split("_")[0]
          if (!this.routePermissions[module]) {
            this.routePermissions[module] = {};
          }
          this.routePermissions[module][action] = slug;
        });
        console.log(JSON.stringify(this.routePermissions),'permissionsList')
        localStorage.setItem("routePermissions", JSON.stringify(this.routePermissions));
      } else {
        console.error("Failed to fetch permissions. API responded with success: false.");
      }
    } catch (error) {
      console.error("Error saving permissions:", error.response?.data || error.message || error);
    }
},

})