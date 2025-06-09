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

      <Table :items="items" :columns="tableColumns"  
       @edit-operator="openEditModal"
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
            <div class="flex justify-end space-x-4">
              <Button type="button" @click="closeModal" severity="secondary" label="Cancel" />
              <Button type="submit" label="Save" />
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
      <!-- <Drawer v-if="openAssignUserDrawer" v-model:visible="showAssignUserDrawer" header="List of Operators"
        position="right">
        <div v-for="operator of operators" :key="operator.id" class="flex items-center gap-2">
          <Checkbox v-model="form.operators" :inputId="operator.id" name="operator" :value="operator.id" />
          <label :for="operator.id">{{ operator.username }}</label>
        </div>
      </Drawer> -->
      <Drawer
        v-if="openAssignUserDrawer"
        v-model:visible="showAssignUserDrawer"
        header="Assign Operators"
        class="!w-full md:!w-80 lg:!w-[30rem] custom-drawer"
        position="right"
      >
        <div class="content-scrollable border rounded-md p-4">
          <div class="p-fluid grid gap-2">
            <div
              v-for="(operator, index) in operators"
              :key="operator.id"
              class="col-12 md:col-6 module-container border-b border-gray-300 pb-2"
            >
              <!-- operator Item -->
              <div class="operator-item flex align-items-center gap-2">
                <Checkbox
                  v-model="operatorForm.operatorList"
                  :inputId="'operator-' + operator.id"
                  :value="operator.id"
                />
                <label :for="'operator-' + operator.id">
                  <span class="operator-index font-bold">{{ index + 1 }}.</span> {{ operator.username }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <span v-if="errors.operatorList" class="text-red-500 text-sm">
          {{ errors.operatorList }}
        </span>
        <div class="save-button">
          <Button  
            label="Save"
            icon="pi pi-save"
            :loading="isSaving"
            class="p-button-primary"
            @click="onSaveOperator()"
          />
        </div>
      </Drawer>

      <Drawer
        v-if="openAssignRoleDrawer"
        v-model:visible="showAssignRoleDrawer"
        header="Assign Roles"
        class="!w-full md:!w-80 lg:!w-[30rem] custom-drawer"
        position="right"
      >
        <div class="content-scrollable border rounded-md p-4">
          <div class="p-fluid grid gap-2">
            <div
              v-for="(role, index) in roles"
              :key="role.id"
              class="col-12 md:col-6 module-container border-b border-gray-300 pb-2"
            >
              <!-- Role Item -->
              <div class="role-item flex align-items-center gap-2">
                <Checkbox
                  v-model="roleForm.roleList"
                  :inputId="'role-' + role.id"
                  :value="role.id"
                />
                <label :for="'role-' + role.id">
                  <span class="role-index font-bold">{{ index + 1 }}.</span> {{ role.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <span v-if="errors.roleList" class="text-red-500 text-sm">
          {{ errors.roleList }}
        </span>
        <div class="save-button">
          <Button  
            label="Save"
            icon="pi pi-save"
            :loading="isSaving"
            class="p-button-primary"
            @click="onSave()"
          />
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
            <div class="flex justify-end gap-x-3">
              <Button type="button" label="Cancel" severity="secondary" @click="closeModal" />
              <Button type="submit" label="Create" />
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
import { toRaw } from 'vue';
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
      operatorForm: {
        operatorList: [],
        group_id: null,
        group_name: null
      },
      roleForm: {
        roleList: [],
        group_id: null,
        group_name: null
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
      originalRoleList: [],
      totalPages: 0,
      totalCount: 0,
      errors: {
        name: null,
        roleList: null,
        operatorList: null
      },
      isSaving: false,
    };
  },

  watch: {
    'filters.Name': 'getGroups',
    // 'roleForm.group_id': 'getGroupRole'
  },

  mounted() {
    this.getGroups();
    this.getOperators();
    this.getRoles();
    // this.getGroupRole();

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
    async getGroupRole(groupId){
    const token = this.getAuthToken();
    if (!token) {
      console.log("No authorization token found. Save request aborted.");
      return;
    }
    try {
        const response = await axios.get("/api/groupRole", {
          params:{
            group_id: groupId
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          // const groupId = response.data.groupRoleList[0]?.Group_id || null; 
          const roleIds = response.data.groupRoleList.map((item) => item.Role_id);

          this.roleForm = {
            roleList: roleIds,
            group_id: groupId,
            group_name: 'RiskTool',
          };

        } else {
          console.error("Failed to fetch roles. API responded with success: false.");
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error saving roles:", error.response?.data || error.message || error);
      }
  },
  async getGroupOperator(groupId){
    const token = this.getAuthToken();
    if (!token) {
      console.log("No authorization token found. Save request aborted.");
      return;
    }
    try {
        const response = await axios.get("/api/groupOperator", {
          params:{
            group_id: groupId
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) { 
          const operatorIds = response.data.groupOperatorList.map((item) => item.Operator_id);
          this.operatorForm = {
            operatorList: operatorIds,
            group_id: groupId,
            group_name: 'RiskTool',
          };
        } else {
          console.error("Failed to fetch operators. API responded with success: false.");
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error saving operators:", error.response?.data || error.message || error);
      }
  },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getGroups();
      }
    },
    validateRoleForm(role) {
      this.errors = {
        roleList: null
      };

      let isValid = true;

      if (!role.roleList) {
          this.errors.roleList = "Role is required";
          isValid = false;
      }
      return isValid;
  },
  validateOperatorForm(operator) {
      this.errors = {
        operatorList: null
      };

      let isValid = true;

      if (!operator.operatorList) {
          this.errors.operatorList = "Operator is required";
          isValid = false;
      }
      return isValid;
  },
  async onSaveOperator() {
      if (!this.validateOperatorForm(this.operatorForm)) {
        console.log("Form validation failed. Save request aborted.");
        return;
      }
      const token = this.getAuthToken();
      if (!token) {
        console.log("No authorization token found. Save request aborted.");
        return;
      }

      if (!this.operatorForm.operatorList || this.operatorForm.operatorList.length === 0) {
        console.log("No operator selected. Save request aborted.");
        return;
      }
      if (this.isSaving) {
        console.log("Save is already in progress. Please wait.");
        return;
      }
      this.isSaving = true;
      try {
        const response = await axios.post("/api/groupOperator/create", this.operatorForm, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          this.showAssignUserDrawer = false;
          this.operatorForm = {
            operatorList: [],
            group_id: null,
            group_name: null,
          };

          this.originalOperatorList = [...this.operatorForm.operatorList];
        } else {
          console.error("Failed to save operators. API responded with success: false.");
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error saving roles:", error.response?.data || error.message || error);
      } finally {
        this.isSaving = false;
      }
  },
  async onSave() {
      if (!this.validateRoleForm(this.roleForm)) {
        console.log("Form validation failed. Save request aborted.");
        return;
      }
      const token = this.getAuthToken();
      if (!token) {
        console.log("No authorization token found. Save request aborted.");
        return;
      }

      if (!this.roleForm.roleList || this.roleForm.roleList.length === 0) {
        console.log("No roles selected. Save request aborted.");
        return;
      }

      if (this.isSaving) {
        console.log("Save is already in progress. Please wait.");
        return;
      }
      this.isSaving = true;
      try {
        const response = await axios.post("/api/groupRole/create", this.roleForm, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          
          this.showAssignRoleDrawer = false;
          this.roleForm = {
            roleList: [],
            group_id: null,
            group_name: null,
          };

          this.originalRoleList = [...this.roleForm.roleList];
        } else {
          console.error("Failed to save permissions. API responded with success: false.");
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error saving roles:", error.response?.data || error.message || error);
      } finally {
        this.isSaving = false;
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
        if (response.data.success) {
            if (response.data.group) {
                this.groups.push(response.data.groups);
            } else {
                console.warn("Created group data is not available in the response.");
            }
            this.getGroups();
            this.newGroup = { name: "" };
            this.closeModal();
        } else {
            console.error("Failed to create group. API responded with success: false.");
        }
    } catch (error) {
        console.error("Error creating group:", error);
    }
    },

    openEditModal(group) {
      this.editingGroup = {
        id: group.Id,
        name: group.Name
      };
      this.showEditModal = true;
      this.showCreateModal = false;
    },
    openAssignUserDrawer(group) {
      this.operatorForm.group_id = toRaw(group).Id
      const groupId = toRaw(group).Id
      this.showAssignUserDrawer = true;
      this.getGroupOperator(groupId)     
    },
    openAssignRoleDrawer(group) {
      this.roleForm.group_id = toRaw(group).Id
      const groupId = toRaw(group).Id
      this.showAssignRoleDrawer = true;
      this.getGroupRole(groupId)
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
            if (response.data.success) {
              const index = this.groups.findIndex((op) => op.id === this.editingGroup.id);
              if (index !== -1) {
                this.groups.splice(index, 1, response.groups);
              }
              window.location.reload();
              this.editingGroup = null;
              this.closeModal();
            } else {
                console.error("Failed to update group. API responded with success: false.");
            }
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
.custom-drawer {
      display: flex;
      flex-direction: column;
      height: 100%; /* Full height */
    }

.content-scrollable {
  overflow-y: auto;
  max-height: calc(100vh - 10rem); /* Adjust based on your layout */
}

.role-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-index {
  font-weight: bold;
}

.save-button {
  position: sticky;
  bottom: 0;
  padding: 1rem;
  background: white;
  z-index: 10;
}
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