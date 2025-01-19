<template>
    <div class="p-6 min-h-screen ">
  
      <!-- Tab Content -->
  
      <div class="bg-white p-6 rounded-lg border mb-6">
        <div class="flex justify-between items-center ">
          <form @submit.prevent="updateProfile" class="space-y-6 w-full">
            <!-- New Password Input -->
            <div class="flex gap-6">
                <div class="w-1/2">
                  <label for="newPassword" class="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                  <input v-model="profileData.newPassword" id="newPassword" type="password"
                    placeholder="Enter your new password"
                    class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                    @input="validatePasswords" />
                  <span v-if="errors.newPassword" class="text-red-500 text-sm">{{ errors.newPassword }}</span>
                </div>
      
                <!-- Confirm Password Input -->
                <div class="w-1/2">
                  <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input v-model="profileData.confirmPassword" id="confirmPassword" type="password"
                    placeholder="Confirm your new password"
                    class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                    @input="validatePasswords" />
                  <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
                </div>
            </div>
  
            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <Button type="button" severity="secondary" @click="cancelUpdate" label="Cancel" />
              <Button type="submit" label="Update Profile" 
                :disabled="errors.newPassword || errors.confirmPassword"/>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from "axios";
  export default {
    name: 'ProfileSettings',
    data() {
      return {
        activeTab: 'profilesettings',
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
      async getSystemConfig() {
        const token = this.getAuthToken();
        if (!token) return;
        try {
          const response = await axios.get("/api/systemConfig/spinwinRoutine", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('response', response)
          this.systemConfig = {
            id: response.data.systemconfigList.Id,
            parameter: response.data.systemconfigList.Parameter,
            value: parseInt(response.data.systemconfigList?.Value?.trim()) || 0,
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
          if (response.success == false) {
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
      async changeSettings(row) {
        row.status = !row.status;
        console.log('here', row)
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
  
  
  <style scoped>
  table {
    border-spacing: 0;
  }
  
  th,
  td {
    color: #333333;
  }
  
  th {
    background-color: #f3f4f6;
  }
  
  tbody tr:hover {
    background-color: #f9fafb;
  }
  
  button {
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 4px;
  }
  
  button:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  </style>