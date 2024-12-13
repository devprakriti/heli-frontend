<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">List of Accounts</h3>
      </nav>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg relative">
      <table class="min-w-full table-auto border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left">S.N</th>
            <th class="border px-4 py-2 text-left">AccountId</th>
            <th class="border px-4 py-2 text-left">Account</th>
            <th class="border px-4 py-2 text-left">Username</th>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="account,key in accounts"
          :key="account.Id" class="hover:bg-gray-50">
            
            <td class="border px-4 py-2">{{ key+1 }}</td>
            <td class="border px-4 py-2">{{ account.AccountId }}</td>
            <td class="border px-4 py-2">{{ account.Account }}</td>
            <td class="border px-4 py-2">{{ account.Username }}</td>
          </tr>
        </tbody>
      </table>
       <!-- Pagination -->
       <div class="mt-6 flex justify-center items-center space-x-2">
          <button @click="goToPage(1)" :disabled="currentPage === 1" class="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600 transition ease-in-out duration-200 disabled:bg-gray-300">
            First
          </button>
          
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600 transition ease-in-out duration-200 disabled:bg-gray-300">
            Prev
          </button>
          
          <span class="text-lg font-semibold text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
          
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600 transition ease-in-out duration-200 disabled:bg-gray-300">
            Next
          </button>
  
          <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600 transition ease-in-out duration-200 disabled:bg-gray-300">
            Last
          </button>
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
      accounts: [],
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalCount: 0, 
      
    };
  },

  watch: {
  },
  mounted() {
    this.getAccounts();
  },
  computed: {
  },
  methods: {
    getAuthToken() {
        const token = localStorage.getItem("authToken"); 
        if (!token) {
          console.error("Authorization token not found");
          return null;
        }
        return token;
    },
  
    async getAccounts() {
      console.log('accout')
      const token = this.getAuthToken();
      if (!token) return;
      const offset = (this.currentPage - 1) * this.pageSize;

      try {
        const response = await axios.get("/api/spinwin/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            offset: offset,
          },
        });

        const { accountList, totalCount, totalPages } = response.data;
        this.accounts = accountList.map((account) => ({
          Id: account.Id,
          AccountId: account.AccountId,
          Account: account.Account,
          Username: account.Username
        }
      ));        
        this.totalCount = totalCount;
        this.totalPages = totalPages;
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    }
  
  }
};
</script>
