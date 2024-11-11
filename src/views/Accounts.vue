<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">List of Accounts</h2>
      </div>
  
      <table class="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th class="py-3 px-6 bg-gray-200 text-left">S.N</th>
            <th class="py-3 px-6 bg-gray-200 text-left">AccountId</th>
            <th class="py-3 px-6 bg-gray-200 text-left">Account</th>
            <th class="py-3 px-6 bg-gray-200 text-left">Username</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="account,key in accounts"
            :key="account.Id"
            class="border-t border-gray-300"
          >
            <td class="py-3 px-6">{{ key+1 }}</td>
            <td class="py-3 px-6">{{ account.AccountId }}</td>
            <td class="py-3 px-6">{{ account.Account }}</td>
            <td class="py-3 px-6">{{ account.Username }}</td>
          
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  
  <script>
  import axios from "axios";
  
  export default {
    name: "AdminAccounts",
    data() {
      return {
        accounts: [],
        showCreateModal: false,
        showEditModal: false,
        errors: { // Initialize errors object
          username: null,
          email: null,
          phone: null,
        },
      };
    },
  
    mounted() {
      this.getAccounts();
    },
    methods: {
      // Helper method to get authorization token
      getAuthToken() {
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
        if (!token) {
          console.error("Authorization token not found");
          // You can also redirect the user to login here
          return null;
        }
        return token;
      },
  
      // Fetch the list of Accounts (GET request)
      async getAccounts() {
        const token = this.getAuthToken();
        if (!token) return; // If no token, stop execution
        try {
          const response = await axios.get("/api/spinwin/accounts", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('response',response)
          this.accounts = response.data.accountList.map((account) => ({
            Id: account.Id,
            AccountId: account.AccountId,
            Account: account.Account,
            Username: account.Username
          }));
        } catch (error) {
          console.error("Error fetching account:", error);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional scoped styles here */
  </style>
  