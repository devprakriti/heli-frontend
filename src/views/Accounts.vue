<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">List of Accounts</h3>
      </nav>
    </div> -->
    <!-- Filter Section -->
    <div class="bg-white p-6 rounded-lg border mb-6">
        <h3 class="text-xl font-semibold mb-4">Filter Accounts</h3>
        <div class="flex space-x-4 mb-4">
          <!-- Date Range Filter (Start Date) -->
          <div class="flex-1">
            <label for="start-date" class="block text-sm font-medium ">Start Date</label>
            <Calendar 
              id="start-date" 
              v-model="filters.fromTime" 
              :showIcon="true"
              placeholder="Pick a date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm placeholder:font-light focus:ring-slate-300 focus:border-slate-300" 
               :maxDate="maxDate"
            />
          </div>

          <!-- Date Range Filter (End Date) -->
          <div class="flex-1">
            <label for="end-date" class="block text-sm font-medium ">End Date</label>
            <Calendar 
              id="end-date" 
              v-model="filters.toTime" 
              :showIcon="true"
              placeholder="Pick a date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm placeholder:font-light focus:ring-slate-300 focus:border-slate-300" 
               :minDate="filters.fromTime" :maxDate="maxDate"
            />
          </div>

          <!-- Search Filter 
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium ">Search</label>
            <InputText 
              id="search" 
              v-model="filters.Username" 
              placeholder="Search by TradeId or Username or Coupon" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm placeholder:font-light focus:ring-slate-300 focus:border-slate-300" 
            />
          </div>-->
        </div>
        <div class="flex space-x-4 mb-4">
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <InputText 
              id="search"
              type="search" autocomplete="off" 
              v-model="filters.AccountId" 
              placeholder="Search by AccountId" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <InputText 
              id="search" 
              type="search" autocomplete="off"
              v-model="filters.Account" 
              placeholder="Search by Account" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <InputText 
              id="search" 
              type="search" autocomplete="off"
              v-model="filters.Username" 
              placeholder="Search by Username" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>
     </div>
      
    <div class="bg-white p-6 rounded-lg border relative">
      <!-- <table class="min-w-full table-auto border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left">S.N</th>
            <th class="border px-4 py-2 text-left">AccountId</th>
            <th class="border px-4 py-2 text-left">Account</th>
            <th class="border px-4 py-2 text-left">Username</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(account, key) in accounts" :key="account.Id">
          <tr class="hover:bg-gray-50">
            
            <td class="border px-4 py-2">{{ key+1 }}</td>
            <td class="border px-4 py-2">{{ account.AccountId }}</td>
            <td class="border px-4 py-2">{{ account.Account }}</td>
            <td class="border px-4 py-2">{{ account.Username }}</td>
          </tr>
        </template>
        </tbody>
      </table> -->
      <Table :items="items" :columns="tableColumns" />
       <!-- Pagination -->
       <div class="mt-6 flex justify-center items-center space-x-2">
          <Button @click="goToPage(1)" :disabled="currentPage === 1" label="First" />
          
          <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" label="Prev" />
          
          <span class=" font-semibold ">{{ currentPage }} / {{ totalPages === 0 ? 1 : totalPages
          }}</span>
          
          <Button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages || totalPages === 0" label="Next" />
  
          <Button @click="goToPage(totalPages)" :disabled="currentPage === totalPages || totalPages === 0" label="Last" />
        </div>
    </div>
  </div>
</template>

<script>
import 'primeicons/primeicons.css'; // Import PrimeIcons
import axios from "axios";
import Table from '../components/Table.vue'
export default {
  name: 'AdminSettings',
  data() {
    return {
      selectedCurrency: localStorage.getItem('selectedCurrency') || null,
      items: null,
      tableColumns: null,
      accounts: [],
      filters: {
        Username: null,
        Account:null,
        AccountId:null,
        fromTime: null,
        toTime: null,
        search:null
      },
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalCount: 0, 
      maxDate: null,
      expandedAccountId: null,
    };
  },

  watch: {
    'filters.toTime': 'getAccounts',
    'filters.fromTime': 'getAccounts',
    'filters.Username': 'getAccounts',
    'filters.Account': 'getAccounts',
    'filters.AccountId': 'getAccounts'
  },
  created() {
  try {
      this.maxDate = new Date(); 
      if (this.maxDate instanceof Date && !isNaN(this.maxDate)) {
        this.maxYear = this.maxDate.getFullYear();
      } else {
        throw new Error('Invalid Date');
      }
    } catch (error) {
      console.error('Error:', error.message);
      this.maxYear = 'Invalid Date';
    }

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
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getAccounts();
      }
    },
    async getAccounts() {
      const token = this.getAuthToken();
      if (!token) return;
      const offset = (this.currentPage - 1) * this.pageSize;
      const headers = { Authorization: `Bearer ${token}` };
      if (localStorage.getItem('selectedCurrency')) {
            headers['X-Selected-Currency'] = localStorage.getItem('selectedCurrency'); 
      }
      try {
        const response = await axios.get("/api/spinwin/accounts", {
          headers: headers,
          params: {
            Username: this.filters.Username,
            Account: this.filters.Account,
            AccountId: this.filters.AccountId,
            fromTime: this.filters.fromTime,
            toTime: this.filters.toTime,
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
        this.items = response.data.accountList.map((account) => ({
          AccountId: account.AccountId,
          Account: account.Account,
          Username: account.Username
        }));
        this.tableColumns = [
          { field: 'AccountId', header: 'AccountId' },
          { field: 'Account', header: 'Account' },
          { field: 'Username', header: 'Username' },
        ];      
        this.totalCount = totalCount;
        this.totalPages = totalPages;
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    }
  
  }
};
</script>

<style scoped>
table {
  border-spacing: 0;
}

th, td {
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