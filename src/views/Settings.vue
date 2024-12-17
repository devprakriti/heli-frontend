<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">Settings</h3>
      </nav>
    </div>

    <!-- Tab Content -->
    <!-- Settings Section -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-lg font-semibold mb-4">Spinwin Routine Status</h2>
          </div>
          <div>
               <label class="flex items-center justify-center cursor-pointer">
                  
                  <input type="checkbox" v-model="systemConfig.value" class="sr-only"
                    :checked="systemConfig.value" @click= "changeSettings(systemConfig)"
                  >
                  <span class="ml-2">Disable</span> &nbsp; 
                 <div
                   :class="{
                     'bg-blue-500': systemConfig.value,
                     'bg-gray-300': !systemConfig.value
                   }"
                   class="relative inline-block h-6 w-12 rounded-full"
                 >
                   <span
                     :class="{
                       'translate-x-6': systemConfig.value,
                       'translate-x-1': !systemConfig.value
                     }"
                     class="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition transform"
                   ></span>
                 </div>
                 <span class="ml-2">Enable</span>
               </label>
          </div>
        </div>     
    </div>


    <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">Profile Settings</h3>
      </nav>
    </div>
      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div class="flex justify-between items-center mb-4"> 
          <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- New Password Input -->
        <div>
          <label for="newPassword" class="block text-sm font-semibold text-gray-700">New Password</label>
          <input
            v-model="profileData.newPassword"
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            @input="validatePasswords"
          />
          <span v-if="errors.newPassword" class="text-red-500 text-sm">{{ errors.newPassword }}</span>
        </div>

        <!-- Confirm Password Input -->
        <div>
          <label for="confirmPassword" class="block text-sm font-semibold text-gray-700">Confirm New Password</label>
          <input
            v-model="profileData.confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            @input="validatePasswords"
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelUpdate"
            class="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
            :disabled="errors.newPassword || errors.confirmPassword"
          >
            Update Profile
          </button>
        </div>
          </form>
        </div>     
      </div>      
  </div>
</template>


<script>
import axios from "axios";
export default {
  name: 'AdminSettings',
  data() {
    return {
      activeTab: 'settings', 
      statisticalProcedureEnabled: false,
      memberDisplayEnabled: false,
      systemConfig: [],
      user: {},
      profileData: {
        newPassword: '',
        confirmPassword: '',
      },
      errors: {
        newPassword: null,
        confirmPassword: null,
      },
    };
  },
  mounted() {
    this.getSystemConfig();
    this.getAuthToken()
  },
  created() {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  computed: {
  },

  methods: {
    async getSystemConfig(){
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/systemConfig/spinwinRoutine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response',response)
        this.systemConfig = {
          id: response.data.systemconfigList.Id,
          parameter: response.data.systemconfigList.Parameter,
          value: parseInt(response.data.systemconfigList.Value),
          comment: response.data.systemconfigList.Comment
        };

      } catch (error) {
        console.error("Error fetching rules:", error);
      }
    },
    getAuthToken() {
      const token = localStorage.getItem("authToken");
      console.log('token', token)
      if (!token) {
        console.error("Authorization token not found");
        return null;
      }
      return token;
    },
    
    validatePasswords() {
      const { newPassword, confirmPassword } = this.profileData;

      this.errors.newPassword = null;
      this.errors.confirmPassword = null;

      if (!newPassword || newPassword.length < 8) {
        this.errors.newPassword = 'Password must be at least 8 characters long.';
      }

      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match.';
      }
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
    async updateProfile() {
      this.validatePasswords();

      if (this.errors.newPassword || this.errors.confirmPassword) {
        return;
      }
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const payload = {
          id: this.user.id,
          password: this.profileData.newPassword,
        };

        const response = await axios.put(
          `/api/users/password-reset/${this.user.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.success == false) 
        {
          alert('Failed to update');
          return;
        }
        alert('Profile updated successfully');
        this.logout()
        this.profileData.newPassword = '';
        this.profileData.confirmPassword = '';
      } catch (error) {
        console.error("Error updating operator:", error);

        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred while updating the password. Please try again.');
        }
      }
    },

    cancelUpdate() {
      this.profileData.newPassword = '';
      this.profileData.confirmPassword = '';
      this.errors.newPassword = null;
      this.errors.confirmPassword = null;
    },
    async changeSettings(row){
      row.status = !row.status;
      console.log('here',row)
      try {
        const token = this.getAuthToken();
        if (!token) return;
        const response = await axios.put(
          `/api/systemConfig/update/status/${row.id}`,
          { ...row },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Rule status updated successfully:', response.data);
        // this.getRules();
        alert('Rule status updated successfully');
        } 
          catch (error) {
          console.error("Error updating rule status:", error);
          alert('Failed to update rule status. Please try again.');
        }
    },
  },
};
</script>

