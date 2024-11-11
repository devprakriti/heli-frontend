<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">List of Operators</h2>
      <button
        @click="openCreateModal"
        class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Create Operator
      </button>
    </div>

    <table class="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr>
          <th class="py-3 px-6 bg-gray-200 text-left">S.N</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Username</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Email</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Phone</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Status</th>
          <th class="py-3 px-6 bg-gray-200 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="operator in operators"
          :key="operator.id"
          class="border-t border-gray-300"
        >
          <td class="py-3 px-6">{{ operator.id }}</td>
          <td class="py-3 px-6">{{ operator.username }}</td>
          <td class="py-3 px-6">{{ operator.email }}</td>
          <td class="py-3 px-6">{{ operator.phone }}</td>
          <td class="py-3 px-6">
            <span :class="operator.status ? 'text-green-500' : 'text-red-500'">
              {{ operator.status ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="py-3 px-6">
            <!-- Action Icons -->
            <font-awesome-icon 
              icon="edit" 
              class="cursor-pointer text-gray-600 hover:text-gray-800 mr-4"
              @click="openEditModal(operator)"
            />
            <!-- <font-awesome-icon 
              icon="trash" 
              class="cursor-pointer text-red-600 hover:text-red-800 mr-4"
              @click="deleteOperator(operator.id)"
            /> -->
            <font-awesome-icon 
              icon="exchange-alt" 
              class="cursor-pointer text-yellow-600 hover:text-yellow-800"
              @click="toggleStatus(operator)"
            />
          </td>
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
    // Fetch the operators when the component is mounted
    this.getOperators();
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
      // Validate form data before submitting
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

    // Fetch the list of operators (GET request)
    async getOperators() {
      const token = this.getAuthToken();
      if (!token) return; // If no token, stop execution
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response',response)
        // Assume each user represents an operator
        this.operators = response.data.userList.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          status: true, // Mock status
        }));
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    },

    // Create a new operator (POST request)
  async createOperator() {
      if (!this.validateForm(this.newOperator)) return; // Validate before proceeding
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


   

    // Open the edit modal and set the operator to be edited
    openEditModal(operator) {
      this.editingOperator = { ...operator };
      this.showEditModal = true;
      this.showCreateModal = false; // Close Create Modal if open
    },

    // Update an existing operator (PUT request)
  async updateOperator() {
      if (!this.validateForm(this.editingOperator)) return; // Validate before proceeding
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

    // Toggle the status of an operator
    toggleStatus(operator) {
      operator.status = !operator.status; // Toggle the status between Active/Inactive
    },

    // Close the modals
    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
    },

    // Open the create modal
    openCreateModal() {
      this.showCreateModal = true;
      this.showEditModal = false; // Close Edit Modal if open
    },
  },
};
</script>

<style scoped>
/* Add any additional scoped styles here */
</style>
