<template>
  <div v-if="!isAuthenticated" class="flex h-screen justify-center items-center bg-gray-100">

    <div v-if="loading" class="flex justify-center items-center h-full">
      <div class="text-center">
        <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <p class="text-xl mt-2">Processing...</p>
      </div>
    </div>

    <form v-else @submit.prevent="login" class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

      <div v-if="errorMessage" class="mb-4 text-red-500 text-center">
        {{ errorMessage }}
      </div>

      <div class="mb-4">
        <input v-model="username" type="text" placeholder="Username"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          :class="{ 'border-red-500': usernameError }" />
        <p v-if="usernameError" class="text-red-500 text-sm">username is required</p>
      </div>

      <div class="mb-6 relative">
        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
          class="  w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          :class="{ 'border-red-500': passwordError }" />
        <span class="absolute right-4 top-2.5 cursor-pointer" @click="togglePasswordVisibility">
          <i :class="showPassword ? 'pi pi-eye-slash text-gray-400' : 'pi pi-eye text-gray-400'"></i>
        </span>
        <p v-if="passwordError" class="text-red-500 text-sm">Password is required</p>
      </div>

      <div class="mb-6 flex gap-3 items-center">
        <Checkbox v-model="isAdmin"  inputId="superadmin" name="superadmin" value="true" />
            <label for="superadmin"> Log in as Admin </label>
      </div>

      <button type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"  :disabled="loading">
        Login
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { store } from "../store/auth";
import { Checkbox } from "primevue"

export default {
  name: "AdminLogin",
  data() {
    return {
      store,
      username: "",
      password: "",
      errorMessage: "",
      usernameError: false,
      passwordError: false,
      loading: false,
      showPassword: false,
      isAdmin: false,
      groupId: 4
    };
  },
  watch: {
    isAdmin(value) {
      this.groupId = value[0] ? 1 : 2 ;
    }
    },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("authToken");
    },
  },
  methods: {
    validateForm() {
      this.usernameError = !this.username;
      this.passwordError = !this.password;
      return !this.usernameError && !this.passwordError;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      this.errorMessage = "";

      if (!this.validateForm()) {
        return;
      }
      this.loading = true;
      try {
        const response = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password,
          groupId: this.groupId
        });
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem('authUser', JSON.stringify(response.data.data));
          const headers = { Authorization: `Bearer ${response?.data?.token}` };
          
          

         
          const authme = await axios.get("/api/auth/me", 
          {
            headers 
          });
          localStorage.setItem("profile", JSON.stringify(authme?.data?.user?.permissionList));
          localStorage.setItem("userCurrency", JSON.stringify(authme?.data?.user?.userCurrency));
          await store?.getRolePermission(response?.data?.token)
          localStorage.setItem("routePermissions", JSON.stringify(store?.routePermissions));

          const selectedCurrency = localStorage.getItem('selectedCurrency') || (JSON.parse(localStorage.getItem("userCurrency"))?.[0].CurrencyId)

          if (selectedCurrency) {
            headers['X-Selected-Currency'] = selectedCurrency; 
          }

          console.log('headers',headers )
          const totalCount = await axios.get("/api/users/totalCount", {
            headers
          });
          localStorage.setItem("accountList", totalCount?.data?.totalList?.accountList);
          localStorage.setItem("ruleList", totalCount?.data?.totalList?.ruleList);
          localStorage.setItem("operatorList", totalCount?.data?.totalList?.operatorList);
          localStorage.setItem("ticketList", totalCount?.data?.totalList?.ticketList);
          this.$router.push("/dashboard");
          setTimeout(() => {
            window.location.reload();
           }, 100);
        } else {
          // Show error message if login failed
          this.loading = false;  // Stop loading
          this.errorMessage = "Login failed. Please check your credentials.";
        }
      } catch (error) {
        console.log('error', error)
        // Handle login error (e.g., server down, invalid credentials)
        this.loading = false;  // Stop loading
        this.errorMessage = error.response.data.message || "An error occurred during login.";
      }
    },
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