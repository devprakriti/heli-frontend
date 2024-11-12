<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">List of Tickets</h2>
      <button
        @click="openCreateModal"
        class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Create Ticket
      </button>
    </div>
<!--    
    "userId": "jwtest01",
    "ruleId": 1,
    "quantity": 5,
    "memo": "Test memo test prakriti",
    "operator": "admin" -->
    <table class="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr>

          <th class="py-3 px-6 bg-gray-200 text-left">S.N</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Username</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Rule</th>
          <th class="py-3 px-6 bg-gray-200 text-left">TradeId</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Coupon</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Operator</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Status</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ticket,key in tickets"
          :key="ticket.Id"
          class="border-t border-gray-300"
        >
          <td class="py-3 px-6">{{ key+1 }}</td>
          <td class="py-3 px-6">{{ ticket.Username }}</td>
          <td class="py-3 px-6">{{ ticket.RuleId }}</td>
          <td class="py-3 px-6">{{ ticket.TradeId }}</td>
          <td class="py-3 px-6">{{ ticket.Coupon }}</td>
          <td class="py-3 px-6">{{ ticket.Operator }}</td>
          <td class="py-3 px-6">
            <span :class="ticket.Status ? 'text-green-500' : 'text-red-500'">
              {{ ticket.Status ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="py-3 px-6">
            <!-- Action Icons -->
            <!-- <font-awesome-icon 
              icon="edit" 
              class="cursor-pointer text-gray-600 hover:text-gray-800 mr-4"
              @click="openEditModal(ticket)"
            /> -->
            <font-awesome-icon 
              icon="exchange-alt" 
              class="cursor-pointer text-yellow-600 hover:text-yellow-800"
              @click="toggleStatus(ticket)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
    <h3 class="text-2xl font-bold mb-4">Create New Ticket</h3>
        <form @submit.prevent="createTicket" class="space-y-4">
         
          <div>
            <label class="block text-gray-700">User</label>
            <input
              v-model="newTicket.userId"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <span v-if="errors.userId" class="text-red-500 text-sm">{{ errors.userId }}</span>
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rule</label>
            <div class="relative">
              <select
                v-model="newTicket.ruleId"
                class="form-select block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="rule in rules" :key="rule" :value="rule.Id">{{ rule.Name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-gray-700">Quantity</label>
            <input
              v-model="newTicket.quantity"
              type="number"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <span v-if="errors.quantity" class="text-red-500 text-sm">{{ errors.quantity }}</span>
          </div>

          <div>
            <label class="block text-gray-700">Memo</label>
            <input
              v-model="newTicket.memo"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <span v-if="errors.memo" class="text-red-500 text-sm">{{ errors.memo }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Operator</label>
            <div class="relative">
              <select
                v-model="newTicket.operator"
                class="form-select block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="operator in operators" :key="operator" :value="operator.username">{{ operator.username }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>



    <!-- Edit rule Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
        <h3 class="text-2xl font-bold mb-4">Edit Ticket</h3>
        <form @submit.prevent="updateTicket" class="space-y-4">
          <div>
            <label class="block text-gray-700">User</label>
            <input
              v-model="editingTicket.userId"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <span v-if="errors.userId" class="text-red-500 text-sm">{{ errors.userId }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rule</label>
            <div class="relative">
              <select
                v-model="editingTicket.ruleId"
                class="form-select block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="rule in rules" :key="rule" :value="rule.Id">{{ rule.Name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-gray-700">Memo</label>
            <input
              v-model="editingTicket.memo"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <span v-if="errors.memo" class="text-red-500 text-sm">{{ errors.memo }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Operator</label>
            <div class="relative">
              <select
                v-model="editingTicket.operator"
                class="form-select block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="operator in operators" :key="operator" :value="operator.username">{{ operator.username }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Update
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
      operators: [],
      showCreateModal: false,
      showEditModal: false,
      errors: {
        userId: null,
        ruleId:  null,
        quantity:  null,
        memo: null,
        operator: null
      },
    };
  },

  mounted() {
    this.getTickets();
    this.getRules();
    this.getOperators();
  
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

      // if (!rule.quantity) {
      //   this.errors.quantity = "quantity is required";
      //   isValid = false;
      // }

      if (!rule.memo) {
        this.errors.memo = "memo is required";
        isValid = false;
      }
      if (!rule.operator) {
        this.errors.operator = "operator is required";
        isValid = false;
      }
      return isValid;
    },

    // Fetch the list of rules (GET request)
    async getTickets() {
      const token = this.getAuthToken();
      if (!token) return; 
      try {
        const response = await axios.get("/api/spinwin/tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response',response)
        this.tickets = response.data.ticketList.map((ticket) => ({
          Id: ticket.Id,
          Username: ticket.Username,
          RuleId:  ticket.RuleId,
          Memo: ticket.Memo,
          TradeId:  ticket.TradeId,
          Coupon: ticket.Coupon,
          Operator: ticket.AddOperator,
          Status: ticket.Status
        }));
      } catch (error) {
        console.error("Error fetching tickets:", error);
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
        this.newTicket = { 
          userId: "",
          ruleId:  "",
          quantity:  "",
          memo: "",
          operator: ""};
        console.log('response ',response)
        if(response.success == true){
          this.closeModal();
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
</style>
