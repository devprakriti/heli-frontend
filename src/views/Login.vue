<template>
  <div class="flex h-screen justify-center items-center bg-gray-100">
    <!-- Show loading screen when login is in process -->
    <div v-if="loading" class="flex justify-center items-center h-full">
      <div class="text-center">
        <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <p class="text-xl mt-2">Processing...</p>
      </div>
    </div>

    <!-- Show login form when not loading -->
    <form v-else @submit.prevent="login" class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

      <div v-if="errorMessage" class="mb-4 text-red-500 text-center">
        {{ errorMessage }}
      </div>

      <div class="mb-4">
        <input
          v-model="email"
          type="text"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          :class="{'border-red-500': emailError}"
        />
        <p v-if="emailError" class="text-red-500 text-sm">Email is required</p>
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
      email: "",
      password: "",
      errorMessage: "",
      emailError: false,
      passwordError: false,
      loading: false,  // Add loading state
    };
  },
  methods: {
    validateForm() {
      this.emailError = !this.email;
      this.passwordError = !this.password;
      return !this.emailError && !this.passwordError;
    },
    async login() {
      // Clear previous error messages
      this.errorMessage = "";

      // Form validation
      if (!this.validateForm()) {
        return;
      }

      // Set loading state to true when login starts
      this.loading = true;

      try {
        // Make the API call to login
        const response = await axios.post('/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        // Check for successful response and save the token
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);

          // Navigate to dashboard and reload the page
          this.$router.push("/dashboard");
          setTimeout(() => {
            window.location.reload(); // Reload the page after navigation
      }, 100); // Small delay to ensure navigation happens first
        } else {
          // Show error message if login failed
          this.loading = false;  // Stop loading
          this.errorMessage = "Login failed. Please check your credentials.";
        }
      } catch (error) {
        // Handle login error (e.g., server down, invalid credentials)
        this.loading = false;  // Stop loading
        this.errorMessage = error.response?.data?.message || "An error occurred during login.";
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
