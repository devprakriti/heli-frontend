<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">List of Operators</h3>
      </nav>
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
            <th class="border px-4 py-2 text-left">Operate</th>
            <th class="border px-4 py-2 text-left">Status</th>
            <th class="border px-4 py-2 text-left">Username</th>
            <th class="border px-4 py-2 text-left">Email</th>
            <th class="border px-4 py-2 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="(row, index) in operators" :key="index" class="hover:bg-gray-50">
            <td class="border px-4 py-2 text-center">
              <button @click="openEditModal(row)" class="text-blue-500 hover:underline">✏️</button>
            </td>
            <td class="border px-4 py-2 text-center">
              
              <label class="flex items-center justify-center cursor-pointer">
                
                  <input type="checkbox" v-model="row.status" class="sr-only"
                  @click= "toggleStatus(row)"  :checked="row.status"
                  >
                <div
                  :class="{
                    'bg-blue-500': row.status,
                    'bg-gray-300': !row.status
                  }"
                  class="relative inline-block h-6 w-12 rounded-full"
                >
                  <span
                    :class="{
                      'translate-x-6': row.status,
                      'translate-x-1': !row.status
                    }"
                    class="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition transform"
                  ></span>
                </div>
              </label>
              
            </td>
            <td class="border px-4 py-2">{{ row.username }}</td>
            <td class="border px-4 py-2">{{ row.email }}</td>
            <td class="border px-4 py-2">{{ row.phone }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Create Operator Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <!-- Set the width of the modal here, similar to the Edit modal -->
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
          <h3 class="text-2xl font-bold mb-4">Create New Operator</h3>
          <form @submit.prevent="createOperator" class="space-y-4">
          <div>
              <input
              v-model="newOperator.username"
              type="text"
              placeholder="Operator Username"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>

          </div>
          <div>
              <input
              v-model="newOperator.email"
              type="email"
              placeholder="Operator Email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>

          </div>
          <div>
              <input
              v-model="newOperator.phone"
              type="number"
              placeholder="Operator Phone"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>

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


      <!-- Edit Operator Modal -->
      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <!-- Set the width of the modal here, e.g., w-1/2 for half, w-3/4 for three-quarters width -->
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
          <h3 class="text-2xl font-bold mb-4">Edit Operator</h3>
          <form @submit.prevent="updateOperator" class="space-y-4">
          <div>
              <input
              v-model="editingOperator.username"
              type="text"
              placeholder="Operator Username"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
              <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>

          </div>
          <div>
              <input
              v-model="editingOperator.email"
              type="email"
              placeholder="Operator Email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
              <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>

          </div>
          <div>
              <input
              v-model="editingOperator.phone"
              type="number"
              placeholder="Operator Phone"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
              <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>

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
              class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
              >
              Update
              </button>
      </div>
          </form>
      </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
name: "AdminOperators",
data() {
  return {
    newOperator: {
      username: "",
      email: "",
      phone: "",
      status: 1,
    },
    editingOperator: null,
    operators: [],
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
  validateForm(operator) {
    this.errors = {
      username: null,
      email: null,
      phone: null,
    };

    let isValid = true;

    if (!operator.username) {
      this.errors.username = "Username is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!operator.email) {
      this.errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(operator.email)) {
      this.errors.email = "Invalid email format";
      isValid = false;
    }

    if (!operator.phone) {
      this.errors.phone = "Phone number is required";
      isValid = false;
    }

    return isValid;
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
async createOperator() {
    if (!this.validateForm(this.newOperator)) return; 
    const token = this.getAuthToken();
    if (!token) return;
    try {
      const response = await axios.post(
        "/api/users/create",
        this.newOperator,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('response',response)
      const createdOperator = {
        id: response.data.user.id,
        ...this.newOperator,
        status: true,
      };
      this.operators.push(createdOperator);
      // window.location.reload();
      this.newOperator = { username: "", email: "", phone: "", status: 1 };
      this.closeModal();
    } catch (error) {
      console.error("Error creating operator:", error);
    }
  },

  openEditModal(operator) {
    this.editingOperator = { ...operator };
    this.showEditModal = true;
    this.showCreateModal = false; // Close Create Modal if open
  },

async updateOperator() {
    if (!this.validateForm(this.editingOperator)) return; 
    const token = this.getAuthToken();
    if (!token) return;
    try {
      const response = await axios.put(
        `/api/users/update/${this.editingOperator.id}`,
        this.editingOperator,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('response',response)
      const index = this.operators.findIndex((op) => op.id === this.editingOperator.id);
      if (index !== -1) {
        this.operators.splice(index, 1, response.user);
      }
      window.location.reload();
      this.editingOperator = null;
     
      this.closeModal();
    } catch (error) {
      console.error("Error updating operator:", error);
    }
},
  toggleStatus(operator) {
    operator.status = !operator.status; 
  },

  // Close the modals
  closeModal() {
    this.showCreateModal = false;
    this.showEditModal = false;
  },

  // Open the create modal
  openCreateModal() {
    this.showCreateModal = true;
    this.showEditModal = false; 
  },
},
};
</script>
