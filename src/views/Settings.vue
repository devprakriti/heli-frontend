<template>
  <div class="p-6 min-h-screen ">

    <!-- Tab Content -->
    <!-- Settings Section -->
    <div class="bg-white p-6 rounded-lg border mb-6">
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-4">
          <h3 class="text-xl font-medium mb-4">Settings</h3>
        </nav>
      </div>
      <div class="flex justify-between items-center">
        <div>
          <p class="font-medium">Spinwin Routine Status</p>
          <small>Enable or Disable Status</small>
        </div>
        <div>
          <label class="flex items-center justify-center cursor-pointer">
            <ToggleSwitch :model-value="systemConfig.value" 
                            @change="changeSettings(systemConfig)" />
          </label>
        </div>
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
    async getSystemConfig() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/systemConfig/spinwinRoutine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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