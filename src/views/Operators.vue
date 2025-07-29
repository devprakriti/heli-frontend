<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Tab Navigation -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 class="text-xl font-semibold mb-4">Filter Operators</h3>
      <div class="flex space-x-4 mb-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search by Fullname</label>
          <InputText id="search" type="search" autocomplete="off" v-model="filters.Fullname"
            placeholder="Search by Fullname"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search by Username</label>
          <InputText id="search" type="search" autocomplete="off" v-model="filters.Username"
            placeholder="Search by Username"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      <div class="flex space-x-4 mb-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search By Status</label>
          <Select v-model="filters.Status" :options="statusList" showClear optionLabel="name"
            placeholder="Select a Status" fluid />
        </div>
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search By Group</label>
          <Select v-model="filters.Group" :options="groupList" showClear optionLabel="name"
            placeholder="Select a Group" fluid />
        </div>
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search By Role</label>
          <Select v-model="filters.Role" :options="roleList" showClear optionLabel="name"
            placeholder="Select a Role" fluid />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white p-6 rounded-lg shadow-lg relative">
      <!-- Plus Button -->
      <CreateButton @open-modal="openCreateModal" />

      <Table :items="items" :columns="tableColumns" @update-status="toggleStatus" @edit-operator="openEditModal">
        <!-- Edit Operator Modal -->
        <template #modal>
          <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white p-8 rounded-lg shadow-lg w-3/5 md:w-2/5">
              <h3 class="text-xl font-bold mb-6 text-center">Reset Password</h3>
              <form @submit.prevent="updateOperator" class="space-y-6">
                <div>
                  <label for="newPassword" class="block font-medium mb-2">New Password</label>
                  <input v-model="editingOperator.password" id="newPassword" type="password"
                    placeholder="Enter a new password"
                    class="w-full px-4 py-3 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
                  <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
                </div>
                <div>
                  <label for="confirmPassword" class="block font-medium mb-2">Confirm New Password</label>
                  <input v-model="editingOperator.confirmPassword" id="confirmPassword" type="password"
                    placeholder="Confirm your new password"
                    class="w-full px-4 py-3 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300"
                    @input="validatePasswords" />
                  <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
                </div>
                <div class="flex justify-end space-x-4">
                  <Button type="button" @click="closeModal" severity="secondary" label="Cancel" />

                  <Button type="submit" label="Update Password" />
                </div>
              </form>
            </div>
          </div>
        </template>
      </Table>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <Button @click="goToPage(1)" :disabled="currentPage === 1" label="First" />
        <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" label="Prev" />
        <span class="text-lg font-semibold text-gray-700">{{ currentPage }} / {{ totalPages === 0 ? 1 : totalPages }}</span>
        <Button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages || totalPages === 0" label="Next" />
        <Button @click="goToPage(totalPages)" :disabled="currentPage === totalPages || totalPages === 0" label="Last" />
      </div>

      <!-- Create Operator Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/5">
          <h3 class="text-xl font-bold mb-4">Create New Operator</h3>
          <form @submit.prevent="createOperator" class="space-y-4">
            <!-- Username -->
            <div>
              <input v-model="newOperator.username" type="text" placeholder="Operator Username"
                class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
              <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>
            </div>

            <!-- Fullname -->
            <div>
              <input v-model="newOperator.fullname" type="text" placeholder="Operator Fullname"
                class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
              <span v-if="errors.fullname" class="text-red-500 text-sm">{{ errors.fullname }}</span>
            </div>

            <!-- Currency Dropdown -->
            <!-- Multiple Currency Selection -->
          <div>
            <label class="block mb-1 font-medium text-gray-700">Currencies</label>
          
            <div class="flex flex-col gap-2 pl-1">
              <label
                v-for="curr in currency"
                :key="curr.CurrencyId"
                class="inline-flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-blue-600"
                  :value="curr.CurrencyId"
                  v-model="newOperator.currencyIds"
                />
                <span>{{ curr.Currency }}</span>
              </label>
            </div>
            <span v-if="errors.currencyIds" class="text-red-500 text-sm">{{ errors.currencyIds }}</span>
          </div>


            <div class="space-y-4">
              <div class="flex gap-4">
                <p>Groups:</p>
                <div v-for="group in groups" :key="group.Id" class="flex gap-1.5 items-center">
                  <RadioButton v-model="form.group_id" :inputId="'group-' + group.Id" :value="group.Id" :name="group.Name"
                    @change="handleGroupChange(group.Id)" />
                  <label :for="'group-' + group.Id">{{ group.Name }}</label>
                </div>
              </div>
              <div v-if="form.group_id" class="flex gap-2">
                <p>Roles:</p>
                <div v-for="role in roles" :key="role.Role_id" class="flex gap-1.5 items-center">
                  <RadioButton v-model="form.role_id" :inputId="'role-' + role.Role_id" :value="role.Role_id" :name="role.Role_Name" />
                  <label :for="'role-' + role.Role_id">{{ role.Role_Name }}</label>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end gap-x-3">
              <Button type="button" label="Cancel" severity="secondary" @click="closeModal" />
              <Button type="submit" label="Create" />
            </div>
          </form>
        </div>
      </div>
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
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalCount: 0,
      filters: {
        Username: null,
        Fullname: null,
        Status: null,
        Group: null,
        Role:null,
      },
      roleList : null,
      groupList: null,
      statusList: [
        { name: 'Active', code: '1' },
        { name: 'Inactive', code: '0' }
      ],
      newOperator: {
        username: "",
        fullname: "",
        status: 1,
        currencyIds: [],
        group_id: null,
        role_id: null
      },
      editingOperator: {
        password: "",
        confirmPassword: ""
      },
      operators: [],
      showCreateModal: false,
      showEditModal: false,
      roles: [],
      groups: [],
      currency:[],
      form: {
        group_id: null,
        role_id: null,
        operator_id: null
      },
      errors: {
        username: null,
        fullname: null,
        password: null,
        confirmPassword: null
      },
    };
  },
  watch:
  {
    'filters.Username': 'getOperators',
    'filters.Fullname': 'getOperators',
    'filters.Status': 'getOperators',
    // 'this.form.group_id': 'getGroupRoles'
  },

  mounted() {
    this.getOperators(),
    this.getCurrencyList(),
    this.getGroups(),
    this.getRoles()
    // this.getGroupRoles()
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
        fullname: null,
      };

      let isValid = true;

      if (!operator.currencyIds || operator.currencyIds.length === 0) {
        this.errors.currencyIds = "At least one currency must be selected";
        isValid = false;
      }

      if (!operator.username) {
        this.errors.username = "Username is required";
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!operator.fullname) {
        this.errors.fullname = "Fullname is required";
        isValid = false;
      } else if (!emailRegex.test(operator.fullname)) {
        this.errors.fullname = "Invalid fullname format";
        isValid = false;
      }
      return isValid;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getOperators();
      }
    },

    async getOperators() {
      const token = this.getAuthToken();
      if (!token) return;
      const offset = (this.currentPage - 1) * this.pageSize;
      try {
        const response = await axios.get("/api/users/userDetailList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            Username: this.filters.Username,
            Fullname: this.filters.Fullname,
            ...(this.filters.Status !== null && this.filters.Status.code !== null
              ? { Status: this.filters.Status.code }
              : {}),
              ...(this.filters.Group?.name ? { Group: this.filters.Group.name } : {}),
              ...(this.filters.Role?.name ? { Role: this.filters.Role.name } : {}),
            page: this.currentPage,
            pageSize: this.pageSize,
            offset: offset,
          },
        });
        const { userList, totalCount, totalPages } = response?.data;
        this.operators = userList.map((user) => ({
          id: user.id,
          password: user.password,
          fullname: user.fullname,
          status: user.status,
        }));
        this.items = userList.map((user) => ({
          id: user.id,
          password: user.password,
          username: user.username,
          fullname: user.fullname,
          groupname: user.group_details[0].group_name,
          rolename: user.group_details[0].role.role_name,
          status: user.status,
        }));
        this.tableColumns = [
          { field: 'username', header: 'Username' },
          { field: 'fullname', header: 'Fullname' },
          { field: 'groupname', header: 'Group' },
          { field: 'rolename', header: 'Role' },
          { field: 'status', header: 'Status' },
          { field: 'action', header: 'Action' },
        ];
        this.totalCount = totalCount;
        this.totalPages = totalPages;
        const createdOperator = {
          id: response?.data?.user?.id,
          ...this.newOperator,
          status: true,
        };
        this.operators.push(createdOperator);
        // window.location.reload();
        
        this.newOperator = { username: "", fullname: "", status: 1, currencyIds: [] };
        this.closeModal();
      } catch (error) {
        console.error("Error creating operator:", error);
      }
    },
    async getGroups() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.groups = response?.data?.groupList;
        this.groupList = response?.data?.groupList.map(group => ({
          name: group.Name,
          value: group.ID
        }));

      } catch (error) {
        console.error("Error creating operator:", error);
      }
    },
    async getCurrencyList() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/users/currencyList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.currency = response?.data?.currencyList;

      } catch (error) {
        console.error("Error listing currency:", error);
      }
    },
    async getRoles() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/groupRole", {
          params:{
            group_id: this.form.group_id
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.roles = response?.data?.groupRoleList;
        console.log(this.roles, "thisrole")
      } catch (error) {
        console.error("Error creating operator:", error);
      }
    },
    async getAllRoles() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.roleList = response?.data?.roleList.map(role => ({
          name: role.Name,
          value: role.ID
        }));
        console.log(this.roleList, "thisrole")
      } catch (error) {
        console.error("Error creating operator:", error);
      }
    },

    async getGroupRoles(groupId) {
      console.log('getGroupRoles',groupId)
      // if (!this.validateForm(groupId)) return;
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get(`/api/groups/groupRole/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response',response)
        this.roles = response?.data?.groupRole;

      } catch (error) {
        console.error("Error creating operator:", error);
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
        // const createdOperator = {
        //   id: response.data.user[0].Id,
        //   ...this.newOperator,
        //   status: true,
        // };
        // window.location.reload();
        // this.form.operator_id = createdOperator.id;
        // await axios.post(
        //   "/api/operatorGroupRole/create",
        //   this.form,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        this.getOperators();
        this.newOperator = { username: "", fullname: "", status: 1,currencyIds:[] ,group_id: null, role_id: null};
        // this.form = { group_id: null, role_id: null, operator_id: null };
        this.closeModal();
      } catch (error) {
        console.error("Error creating operator:", error);
      }
    },
    openEditModal(operator) {
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
      const password1 = this.editingOperator.password;
      const confirmPassword1 = this.editingOperator.confirmPassword;
      if (!password) {
        this.errors.password = 'Password is required.';
        return false;
      }
      if (password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long.';
        return false;
      }
      if (password1 !== confirmPassword1) {
        this.errors.confirmPassword = 'Passwords do not match.';
        return false;
      }
      return true;
    },

    async toggleStatus(row) {
      row.status = !row.status;
      try {
        const token = this.getAuthToken();
        if (!token) return;

        const response = await axios.put(
          `/api/users/updateStatus/${row.id}`,
          { ...row },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.getOperators();
        alert('User status updated successfully');
      }
      catch (error) {
        console.error("Error updating rule status:", error);
        alert('Failed to update user status. Please try again.');
      }
    },
    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.form.group_id = null;
      this.form.role_id = null;
    },
    openCreateModal() {
      this.newOperator = { username: "", fullname: "", status: 1, currencyIds: [] };
      this.showCreateModal = true;
      this.showEditModal = false;
    },
    // handleGroupChange(groupId) {
    //   this.form.group_id = groupId;
    // },
    handleGroupChange(group) {
    console.log('group',group)
    if (group) {
      this.getGroupRoles(group);
    } else {
      this.roles = [];
    }
  },
  

  },
};
</script>