<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Tab Navigation -->
    <!-- <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">List of Operators</h3>
      </nav>
    </div> -->
    <!-- Table Section -->
    <div class="bg-white p-6 rounded-lg border relative">
      <!-- Plus Button -->
      <CreateButton @open-modal="openCreateModal" />

      <!-- <table class="min-w-full table-auto border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left">S.N</th>
            <th class="border px-4 py-2 text-left">Username</th>
            <th class="border px-4 py-2 text-left">Email</th>
            <th class="border px-4 py-2 text-left">Phone</th>
            <th class="border px-4 py-2 text-left">Status</th>
            <th class="border px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in operators" :key="index" class="hover:bg-gray-50">
            <td class="border px-4 py-2">{{ index + 1 }}</td>
            <td class="border px-4 py-2">{{ row.username }}</td>
            <td class="border px-4 py-2">{{ row.email }}</td>
            <td class="border px-4 py-2">{{ row.phone }}</td>
            <td class="border px-4 py-2 text-center">
              <label class="flex items-center justify-center cursor-pointer">
                <input type="checkbox" v-model="row.status" class="sr-only" @click="toggleStatus(row)"
                  :checked="row.status">
                <div :class="{
                  'bg-blue-500': row.status,
                  'bg-gray-300': !row.status
                }" class="relative inline-block h-6 w-12 rounded-full">
                  <span :class="{
                    'translate-x-6': row.status,
                    'translate-x-1': !row.status
                  }" class="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition transform"></span>
                </div>
              </label>
            </td>
            <td class="border px-4 py-2 text-center">
              <Button icon="pi pi-pencil" class="p-button-text text-blue-500" @click="openEditModal(row)"
                label="Edit" />
            </td>

          </tr>
        </tbody>
      </table> -->
      
      <Table :items="items" :columns="tableColumns" @update-status="toggleStatus" @edit-operator="openEditModal">
        <!-- Edit Operator Modal -->
        <template #modal>
          <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <!-- Modal Content -->
            <div class="bg-white p-8 rounded-lg shadow-lg w-3/5 md:w-2/5">
              <h3 class="text-xl font-bold mb-6 text-center">Reset Password</h3>
              <!-- Form -->
              <form @submit.prevent="updateOperator" class="space-y-6">
                <div>
                  <label for="newPassword" class="block font-medium mb-2">New Password</label>
                  <input  v-model="editingOperator.password" id="newPassword" type="password"
                    placeholder="Enter a new password"
                    class="w-full px-4 py-3 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
                  <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
                </div>
                <div>
                  <label for="confirmPassword" class="block font-medium mb-2">Confirm New
                    Password</label>
                  <input v-model="editingOperator.confirmPassword" id="confirmPassword" type="password"
                    placeholder="Confirm your new password"
                    class="w-full px-4 py-3 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300"
                    @input="validatePasswords" />
                  <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
                </div>
                <div class="flex justify-end space-x-4">
                  <Button type="button" @click="closeModal"
                  severity="secondary"
                    label="Cancel"/>
                 
                  <Button type="submit"
                     label="Update Password"/>
                </div>
              </form>
            </div>
          </div>
        </template>
      </Table>
      
      <!-- Create Operator Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <!-- Set the width of the modal here, similar to the Edit modal -->
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/5">
          <h3 class="text-xl font-bold mb-4">Create New Operator</h3>
          <form @submit.prevent="createOperator" class="space-y-4">
            <div>
              <input v-model="newOperator.username" type="text" placeholder="Operator Username"
                class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
              <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>

            </div>
            <div>
              <input v-model="newOperator.email" type="email" placeholder="Operator Email"
                class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
              <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>

            </div>
            <div>
              <input v-model="newOperator.phone" type="number" placeholder="Operator Phone"
                class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
              <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>

            </div>
            <div class="flex justify-end gap-x-3">
              <Button type="button" label="Cancel" severity="secondary" @click="closeModal" />
              <Button type="submit" label="Create" />
            </div>
          </form>
        </div>
      </div>

      <!-- <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
          <h3 class="text-2xl font-bold mb-4">Edit Operator</h3>
          <form @submit.prevent="updateOperator" class="space-y-4">
          <div>
              <input
              v-model="editingOperator.username"
              type="text"
              placeholder="Operator Username"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-slate-300"
              />
              <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>

          </div>
          <div>
              <input
              v-model="editingOperator.email"
              type="email"
              placeholder="Operator Email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-slate-300"
              />
              <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>

          </div>
          <div>
              <input
              v-model="editingOperator.phone"
              type="number"
              placeholder="Operator Phone"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-slate-300"
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
      </div> -->

    </div>
  </div>
</template>

<script>
import axios from "axios";
import Button from 'primevue/button';
import Table from '../components/Table.vue'
import CreateButton from '../components/CreateButton.vue'
export default {
  name: "AdminOperators",
  data() {
    return {
      items: null,
      tableColumns: null,
      newOperator: {
        username: "",
        email: "",
        phone: "",
        status: 1,
      },
      editingOperator: {
        id: "",
        password: "",
        confirmPassword: ""
      },
      operators: [],
      showCreateModal: false,
      showEditModal: false,
      errors: { // Initialize errors object
        username: null,
        email: null,
        phone: null,
        password: null,
        confirmPassword: null
      },
    };
  },
  components: {
    Button,
    Table
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
        console.log('response', response)
        this.operators = response.data.userList.map((user) => ({
          id: user.id,
          password: user.password,
          username: user.username,
          email: user.email,
          phone: user.phone,
          status: true,
        }));
        this.items = response.data.userList.map((user) => ({
          password: user.password,
          username: user.username,
          email: user.email,
          phone: user.phone,
          status: true,
        }));
        this.tableColumns = [
          { field: 'username', header: 'Username' },
          { field: 'email', header: 'Email' },
          { field: 'phone', header: 'Phone' },
          { field: 'status', header: 'Status' },
          { field: 'action', header: 'Action' },
        ];
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
        console.log('response', response)
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
      console.log(operator, 'operator')
      this.editingOperator = {
        id: operator.id
      };
      this.showEditModal = true;
      this.showCreateModal = false; // Close Create Modal if open
    },

    async updateOperator() {
      this.errors = {};
      if (!this.validatePasswords(this.editingOperator.password, this.editingOperator.confirmPassword)) {
        return;
      }
      const token = this.getAuthToken();
      if (!token) return;

      try {
        const payload = {
          id: this.editingOperator.id,
          password: this.editingOperator.password,
        };

        const response = await axios.put(
          `/api/users/password-reset/${this.editingOperator.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.success == false) {
          alert('Failed to update');
          return;
        }
        alert('Profile updated successfully');
        this.editingOperator = null;
        this.showEditModal = false
      } catch (error) {
        console.error("Error updating operator:", error);

        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred while updating the password. Please try again.');
        }
      }
    },


    validatePasswords(password, confirmPassword) {
      this.errors = {};
      if (!password) {
        this.errors.password = 'Password is required.';
        return false;
      }
      if (password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long.';
        return false;
      }
      // const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      // if (!passwordRequirements.test(password)) {
      //   this.errors.password =
      //     'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, and one number.';
      //   return false;
      // }
      if (password !== confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match.';
        return false;
      }
      return true;
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

<style>
.custom-absolute {
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
}

</style>