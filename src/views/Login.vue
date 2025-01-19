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
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          :class="{'border-red-500': usernameError}"
        />
        <p v-if="usernameError" class="text-red-500 text-sm">username is required</p>
      </div>

      <div class="mb-6">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          :class="{'border-red-500': passwordError}"
        />
        <p v-if="passwordError" class="text-red-500 text-sm">Password is required</p>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminLogin",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      usernameError: false,
      passwordError: false,
      loading: false
    };
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
        });
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem('authUser', JSON.stringify(response.data.data)); 
          this.$router.push("/dashboard");
          setTimeout(() => {
            window.location.reload(); 
      }, 100); // Small delay to ensure navigation happens first
        } else {
          // Show error message if login failed
          this.loading = false;  // Stop loading
          this.errorMessage = "Login failed. Please check your credentials.";
        }
      } catch (error) {
        console.log('error',error)
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
