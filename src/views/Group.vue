<template>
  <div class="p-6 bg-gray-50 min-h-screen">

    <!-- Filter Section -->
    <div class="bg-white p-6 rounded-lg border mb-6">
      <h3 class="text-xl font-semibold mb-4">Filter Groups</h3>
      <div class="flex space-x-4 mb-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search by Name</label>
          <InputText id="search" type="search" autocomplete="off" v-model="filters.Name" placeholder="Search by Name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
    </div>
    <!-- Table Section -->
    <div class="bg-white p-6 rounded-lg border relative">
      <!-- Plus Button -->

      <CreateButton @open-modal="openCreateModal" />

      <Table :items="items" :columns="tableColumns"  :get-status="getStatusClass" 
       :get-statusText="getStatusText"
       :get-rewardText="getRewardTypeText"   @edit-operator="openEditModal"
       @assign-user="openAssignUserDrawer"
       @assign-role="openAssignRoleDrawer"
       :showAssign="true">
        <template #modal>
            <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
          <h3 class="text-2xl font-bold mb-4">Create New Group</h3>
          <form @submit.prevent="createGroup" class="space-y-4">
            <div>
              <label class="block text-gray-700">Name</label>
              <input v-model="newGroup.name" type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeModal"
                class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200">Cancel</button>
              <button type="submit"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">Create</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
          <h3 class="text-2xl font-bold mb-4">Edit Group</h3>
          <form @submit.prevent="updateGroup" class="space-y-4">
            <div>
              <label class="block text-gray-700">User</label>
              <input v-model="editingGroup.name" type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeModal"
                class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200">Cancel</button>
              <button type="submit"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">Save</button>
            </div>
          </form>
        </div>
      </div>
        </template>
      </Table>

      
      <!-- <table class="min-w-full table-auto border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left text-gray-800">S.N</th>
            <th class="border px-4 py-2 text-left text-gray-800">Name</th>
            <th class="border px-4 py-2 text-left text-gray-800">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in groups" :key="index" class="hover:bg-gray-50">
            <td class="border px-4 py-2 text-gray-800">{{ index + 1 }}</td>
            <td class="border px-4 py-2 text-gray-800">{{ row.Name }}</td>
            <td class="border px-4 py-2 text-center">
              <Button icon="pi pi-pencil" class="p-button-text text-blue-500" @click="openEditModal(row)"
                label="Edit" />
              <Button icon="pi pi-users" class="p-button-text text-blue-500" @click="openAssignUserDrawer(row)"
                label="Assign User" />
              <Button icon="pi pi-plus-circle" class="p-button-text text-blue-500" @click="openAssignRoleDrawer(row)"
                label="Assign Role" />
            </td>
          </tr>
        </tbody>
      </table> -->


      <!-- Pagination -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <Button @click="goToPage(1)" :disabled="currentPage === 1" label="First" />

        <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" label="Prev" />

        <span class="text-lg font-semibold text-gray-700">{{ currentPage }} / {{ totalPages }}</span>

        <Button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" label="Next" />

        <Button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" label="Last" />
      </div>
      <!-- Modals for Create and Edit -->
      <!-- Create Modal -->
      <Drawer v-if="openAssignUserDrawer" v-model:visible="showAssignUserDrawer" header="List of Operators"
        position="right">
        <div v-for="operator of operators" :key="operator.id" class="flex items-center gap-2">
          <Checkbox v-model="form.operators" :inputId="operator.id" name="operator" :value="operator.id" />
          <label :for="operator.id">{{ operator.username }}</label>
        </div>
      </Drawer>

      <Drawer v-if="openAssignRoleDrawer" v-model:visible="showAssignRoleDrawer" header="List of Roles"
        position="right">
        <div v-for="role of roles" :key="role.id" class="flex items-center gap-2">
          <Checkbox v-model="form.roles" :inputId="role.id" name="role" :value="role.id" />
          <label :for="role.id">{{ role.name }}</label>
        </div>
      </Drawer>
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
          <h3 class="text-2xl font-bold mb-4">Create New Group</h3>
          <form @submit.prevent="createGroup" class="space-y-4">
            <div>
              <label class="block text-gray-700">Name</label>
              <input v-model="newGroup.name" type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeModal"
                class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200">Cancel</button>
              <button type="submit"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">Create</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
          <h3 class="text-2xl font-bold mb-4">Edit Group</h3>
          <form @submit.prevent="updateGroup" class="space-y-4">
            <div>
              <label class="block text-gray-700">User</label>
              <input v-model="editingGroup.name" type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
              <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeModal"
                class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200">Cancel</button>
              <button type="submit"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">Save</button>
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
import CreateButton from '../components/CreateButton.vue'
import Table from "../components/Table.vue";
export default {
  name: "AdminGroup",
  data() {
    return {
      items: null,
      tableColumns: null,
      newGroup: {
        name: ""
      },
      form: {
        operators: []
      },
      roleForm: {
        roles: []
      },
      editingGroup: null,
      groups: [],
      operators: [],
      roles: [],
      filters: {
        Name: '',
        search: ''
      },
      showCreateModal: false,
      showAssignUserDrawer: false,
      showAssignRoleDrawer: false,
      showEditModal: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalCount: 0,
      errors: {
        name: null
      },
    };
  },

  watch: {
    'filters.Name': 'getGroups'
  },

  mounted() {
    this.getGroups();
    this.getOperators();
    this.getRoles();

  },
  created() {
  },
  methods: {
    async getRoles() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response', response)
        this.roles = response.data.roleList.map((user) => ({
          id: user.Id,
          name: user.Name
        }));
      } catch (error) {
        console.error("Error creating role:", error);
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
        console.log('response', response)
        this.operators = response.data.userList.map((user) => ({
          id: user.id,
          password: user.password,
          username: user.username,
          fullname: user.fullname,
          status: true,
        }));
      } catch (error) {
        console.error("Error creating operator:", error);
      }
    },
    getAuthToken() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Authorization token not found");
        return null;
      }
      return token;
    },
    validateForm(group) {
      this.errors = {
        name: null
      };

      let isValid = true;

      if (!group.name) {
        this.errors.name = "Name is required";
        isValid = false;
      }
      return isValid;
    },

    async getGroups() {
      const token = this.getAuthToken();
      if (!token) return;
      const offset = (this.currentPage - 1) * this.pageSize;
      try {
        const response = await axios.get("/api/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            Name: this.filters.Name,
            page: this.currentPage,
            pageSize: this.pageSize,
            offset: offset,
          },
        });
        const { groupList, totalCount, totalPages } = response.data;
        this.groups = groupList.map(group => ({
          Id: group.Id,
          Name: group.Name
        }));
        this.items = groupList.map(group => ({
          Id: group.Id,
          Name: group.Name
      }));
      this.tableColumns = [
          { field: 'Name', header: 'Name' },
          { field: 'action', header: 'Action' },
        ];
        this.totalCount = totalCount;
        this.totalPages = totalPages;

      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getGroups();
      }
    },


    async createGroup() {
      if (!this.validateForm(this.newGroup)) return;
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.post(
          "/api/groups/create",
          this.newGroup,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success == true) {
          this.closeModal();
          this.newGroup = {
            name: ""
          };
          this.closeModal();
          window.location.reload();
        }
      } catch (error) {
        console.error("Error creating Group:", error);
      }
    },
    openEditModal(group) {
      console.log('editingGroup', group)
      this.editingGroup = {
        id: group.Id,
        name: group.Name
      };
      this.showEditModal = true;
      this.showCreateModal = false;
    },
    openAssignUserDrawer(group) {
      console.log('editingGroup', group)
      this.showAssignUserDrawer = true;
    },
    openAssignRoleDrawer(group) {
      console.log('editingGroup', group)
      this.showAssignRoleDrawer = true;
    },

    async updateGroup() {
      if (!this.validateForm(this.editingGroup)) return;
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.put(
          `/api/groups/update/${this.editingGroup.id}`,
          this.editingGroup,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('response', response)
        const index = this.groups.findIndex((op) => op.id === this.editingGroup.id);
        if (index !== -1) {
          this.groups.splice(index, 1, response.user);
        }
        window.location.reload();
        this.editingGroup = null;

        this.closeModal();
      } catch (error) {
        console.error("Error updating group:", error);
      }
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

th,
td {
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