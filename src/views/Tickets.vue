<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
        <h3 class="text-2xl font-semibold mb-4">List of Tickets</h3>
      </nav>
    </div>
      <!-- Filter Section -->
      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 class="text-xl font-semibold mb-4">Filter Tickets</h3>
        <div class="flex space-x-4 mb-4">
          <!-- Date Range Filter (Start Date) -->
          <div class="flex-1">
            <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
           
           
            <Calendar 
              id="start-date" 
              v-model="filters.fromTime" 
              :showIcon="true"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              :maxDate="maxDate" 
            />
          </div>

          <!-- Date Range Filter (End Date) -->
          <div class="flex-1">
            <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
          
            <Calendar 
              id="end-date" 
              v-model="filters.toTime" 
              :showIcon="true"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              :minDate="filters.fromTime" :maxDate="maxDate"
            />
          </div>

          <!-- Search Filter 
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <InputText 
              id="search" 
              v-model="filters.Username" 
              placeholder="Search by TradeId or Username or Coupon" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div> -->
        </div>
        <div class="flex space-x-4 mb-4">
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700">Search by TradeId</label>
            <InputText 
              id="search" 
              v-model="filters.TradeId" 
              placeholder="Search by TradeId" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700">Search by Username</label>
            <InputText 
              id="search" 
              v-model="filters.Username" 
              placeholder="Search by Username" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700">Search by Coupon</label>
            <InputText 
              id="search" 
              v-model="filters.Coupon" 
              placeholder="Search by Coupon" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>
     </div>
    <!-- Table Section -->
    <div class="bg-white p-6 rounded-lg shadow-lg relative">
      <!-- Plus Button -->
      <button @click="openCreateModal" class="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      <table class="min-w-full table-auto border-collapse border border-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2 text-left text-gray-800">S.N</th>
          <th class="border px-4 py-2 text-left text-gray-800">Username</th>
          <th class="border px-4 py-2 text-left text-gray-800">Reward</th>
          <th class="border px-4 py-2 text-left text-gray-800">TradeId</th>
          <th class="border px-4 py-2 text-left text-gray-800">Coupon</th>
          <th class="border px-4 py-2 text-left text-gray-800">Operator</th>
          <th class="border px-4 py-2 text-left text-gray-800">Status</th>
          <th class="border px-4 py-2 text-left text-gray-800">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tickets" :key="index" class="hover:bg-gray-50">
          <td class="border px-4 py-2 text-gray-800">{{ index+1 }}</td>
          <td class="border px-4 py-2 text-gray-800">{{ row.Username }}</td>
          <td class="border px-4 py-2 text-center"> 
            {{ getRewardTypeText(row) }}
          </td>
          <td class="border px-4 py-2 text-gray-800">{{ row.TradeId }}</td>
          <td class="border px-4 py-2 text-gray-800">{{ row.Coupon }}</td>
          <td class="border px-4 py-2 text-gray-800">{{ row.Operator }}</td>
          <td class="border px-4 py-2 text-center"> 
            <button
              :class="getStatusClass(row.Status)"
              class="px-4 py-2 rounded text-white"
            >
              {{ getStatusText(row.Status) }}
            </button>
          </td>
          <td class="border px-4 py-2 text-center">
            <Button
                  icon="pi pi-pencil"
                  class="p-button-text text-blue-500"
                  @click="openEditModal(row)"
                  label="Edit"
                />
                
          </td>
          
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
      <!-- Modals for Create and Edit -->
      <!-- Create Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
          <h3 class="text-2xl font-bold mb-4">Create New Ticket</h3>
          <form @submit.prevent="createTicket" class="space-y-4">
            <div>
              <label class="block text-gray-700">User</label>
              <input v-model="newTicket.userId" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.userId" class="text-red-500 text-sm">{{ errors.userId }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rule</label>
              <div class="relative">
                <select v-model="newTicket.ruleId" class="form-select block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option v-for="rule in rules" :key="rule.Id" :value="rule.Id">{{ rule.Name }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-gray-700">Quantity</label>
              <input v-model="newTicket.quantity" type="number" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.quantity" class="text-red-500 text-sm">{{ errors.quantity }}</span>
            </div>

            <div>
              <label class="block text-gray-700">Memo</label>
              <input v-model="newTicket.memo" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.memo" class="text-red-500 text-sm">{{ errors.memo }}</span>
            </div>

            <div class="flex justify-end">
              <button type="button" @click="closeModal" class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200">Cancel</button>
              <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">Create</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
          <h3 class="text-2xl font-bold mb-4">Edit Ticket</h3>
          <form @submit.prevent="updateTicket" class="space-y-4">
            <div>
              <label class="block text-gray-700">User</label>
              <input v-model="editingTicket.userId" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.userId" class="text-red-500 text-sm">{{ errors.userId }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rule</label>
              <div class="relative">
                <select v-model="editingTicket.ruleId" class="form-select block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option v-for="rule in rules" :key="rule.Id" :value="rule.Id">{{ rule.Name }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-gray-700">Memo</label>
              <input v-model="editingTicket.memo" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.memo" class="text-red-500 text-sm">{{ errors.memo }}</span>
            </div>

            <div class="flex justify-end">
              <button type="button" @click="closeModal" class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200">Cancel</button>
              <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import axios from "axios";
import moment from 'moment';
export default {
name: "AdminTickets",
data() {
    return {
    newTicket: {
        userId: "",
        ruleId:  "",
        quantity:  "" ,
        memo: "",
        operator: ""
    },
    daysInMonth: Array.from({ length: 31 }, (_, i) => i + 1), 
    daysOfWeek: [
        { value: 1, label: 'Sunday' },
        { value: 2, label: 'Monday' },
        { value: 3, label: 'Tuesday' },
        { value: 4, label: 'Wednesday' },
        { value: 5, label: 'Thursday' },
        { value: 6, label: 'Friday' },
        { value: 7, label: 'Saturday' },
    ],
    editingTicket: null,
    tickets: [],
    rules:[],
    ruleType: [],
    operators: [],
    filters: {
      Username: '',
      TradeId: '',
      Coupon: '',
      fromTime: '',
      toTime: '',
      search: ''
    },
    showCreateModal: false,
    showEditModal: false,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0, 
    errors: {
        userId: null,
        ruleId:  null,
        quantity:  null,
        memo: null,
        operator: null
    },
    
    // maxDate: moment().format('YYYY-MM-DD'),
    maxDate: null
    };
},

watch:{
  'filters.toTime': 'getTickets',
  'filters.fromTime': 'getTickets',
  'filters.Username': 'getTickets',
  'filters.TradeId': 'getTickets',
  'filters.Coupon': 'getTickets',
},

mounted() {
    this.getTickets();
    this.getRules();
    this.getOperators();

},
created() {
  try {
      // Assign maxDate and ensure it's a Date object
      this.maxDate = new Date(); // Replace with actual value if needed

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
methods: {
  
  getStatusClass(status) {
    console.log(status, 'status')
    const statusClasses = {
      0: "bg-gray-500",
      1: "bg-blue-500",
      2: "bg-yellow-500",
      3: "bg-green-500",
      4: "bg-red-500",
      5: "bg-orange-300",
    };
    return statusClasses[status] || "bg-gray-500";
  },
  getStatusText(status) {
    const statusTexts = {
      0: "CREATED",
      1: "DRAW",
      2: "PROCESSING",
      3: "SUCCESS",
      4: "FAILED",
      5: "MANUAL"
    };
    return statusTexts[status] || "UNKNOWN";
  },
  getRewardTypeText(status) {
    const rewardTypeMap = {
      0: "NO_WIN",
      1: "POINT",
      2: "CREDIT",
      3: "PHYSICAL",
      4: "SPIN_TICKET"
    };
    const rewardTypeText = rewardTypeMap[status.RewardType] || " "; 
    return status.RewardAmount ? `${status.RewardAmount} ${rewardTypeText}` : rewardTypeText;

  },
  getAuthToken() {
    const token = localStorage.getItem("authToken"); 
    if (!token) {
        console.error("Authorization token not found");
        return null;
    }
    return token;
  },
  validateForm(rule) {
    this.errors = {
        userId: null,
        ruleId:  null,
        // quantity:  null,
        memo: null,
        operator: null
    };

    let isValid = true;

    if (!rule.userId) {
        this.errors.userId = "userId is required";
        isValid = false;
    }

    if (!rule.ruleId) {
        this.errors.ruleId = "ruleId is required";
        isValid = false;
    }
    if (!rule.memo) {
        this.errors.memo = "memo is required";
        isValid = false;
    }
    //   if (!rule.operator) {
    //       this.errors.operator = "operator is required";
    //       isValid = false;
    //   }
    return isValid;
  },

    // Fetch the list of rules (GET request)
  async getTickets() {
    const token = this.getAuthToken();
    if (!token) return;
    const offset = (this.currentPage - 1) * this.pageSize;
    try {
      const response = await axios.get("/api/spinwin/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          Username: this.filters.Username,
          TradeId: this.filters.TradeId,
          Coupon: this.filters.Coupon,
          fromTime: this.filters.fromTime,
          toTime: this.filters.toTime,
          page: this.currentPage,
          pageSize: this.pageSize,
          offset: offset,
        },
      });
      const { ticketList, totalCount, totalPages } = response.data;
      console.log('response',response)
      this.tickets = ticketList.map(ticket => ({
        Id: ticket.Id,
        Username: ticket.Username,
        RuleId: ticket.RuleId,
        Memo: ticket.Memo,
        TradeId: ticket.TradeId,
        Reward: ticket.Reward,
        RewardType: ticket.RewardType,
        RewardAmount: ticket.RewardAmount,
        Coupon: ticket.Coupon,
        Operator: ticket.AddOperator,
        Status: ticket.Status
      }));

      this.totalCount = totalCount;
      this.totalPages = totalPages;

    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  },

  // Navigate to a specific page
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getTickets();
    }
  },

    async getOperators() {
    const token = this.getAuthToken();
    if (!token) return; 
    try {
        const response = await axios.get("/api/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        console.log('response',response)
        this.operators = response.data.userList.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: true,
        }));
    } catch (error) {
        console.error("Error fetching operators:", error);
    }
    },
    async getRules() {
    const token = this.getAuthToken();
    if (!token) return;
    try {
        const response = await axios.get("/api/spinwin/rules", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        console.log('response',response)
        this.rules = response.data.ruleList.map((rule) => ({
        Id: rule.Id,
        Name: rule.Name,
        TicketType: rule.TicketType,
        TicketAmount: rule.TicketAmount,
        IssueFrequency: rule.IssueFrequency,
        DesignatedDate: rule.DesignatedDate,
        DesignatedDays: rule.DesignatedDays,
        status: rule.Status, 
        }));
    } catch (error) {
        console.error("Error fetching rules:", error);
    }
    },

  
async createTicket() {
    if (!this.validateForm(this.newTicket)) return; 
    const token = this.getAuthToken();
    if (!token) return;
    try {
        const response = await axios.post(
        "/api/spinwin/ticket/create",
        this.newTicket,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
        console.log('response',response)
        console.log('response sucess' ,response.data.success)
        if(response.data.success == true){
         this.closeModal();
         this.newTicket = { 
              userId: "",
              ruleId:  "",
              quantity:  "",
              memo: "",
              operator: ""
          };
        this.closeModal();
        window.location.reload();
        }
    } catch (error) {
        console.error("Error creating Ticket:", error);
    }
    },



    openEditModal(ticket) {
    console.log('editingTicket',ticket)
    this.editingTicket = { 
        id: ticket.Id,
        userId: ticket.Username,
        ruleId:  ticket.RuleId,
        memo: ticket.Memo,
        operator: ticket.Operator,
        status: ticket.Status };
    this.showEditModal = true;
    this.showCreateModal = false; 
    },

async updateTicket() {
    if (!this.validateForm(this.editingTicket)) return; 
    const token = this.getAuthToken();
    if (!token) return;
    try {
        const response = await axios.put(
        `/api/spinwin/ticket/update/${this.editingTicket.id}`,
        this.editingTicket,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
        console.log('response',response)
        const index = this.tickets.findIndex((op) => op.id === this.editingTicket.id);
        if (index !== -1) {
        this.tickets.splice(index, 1, response.user);
        }
        window.location.reload();
        this.editingTicket = null;
    
        this.closeModal();
    } catch (error) {
        console.error("Error updating ticket:", error);
    }
},

    toggleStatus(ticket) {
    ticket.status = !ticket.status; 
    },
    closeModal() {
    this.showCreateModal = false;
    this.showEditModal = false;
    },
    openCreateModal() {
    this.showCreateModal = true;
    this.showEditModal = false;
    },
},
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