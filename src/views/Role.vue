<template>
    <div class="p-6 bg-gray-50 min-h-screen">
   
        <!-- Filter Section -->
        <div class="bg-white p-6 rounded-lg border mb-6">
          <h3 class="text-xl font-semibold mb-4">Filter Roles</h3>
          <div class="flex space-x-4 mb-4">
            <div class="flex-1">
              <label for="search" class="block text-sm font-medium text-gray-700">Search by Name</label>
              <InputText 
                id="search" 
                v-model="filters.Name" 
                placeholder="Search by Name" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
       </div>
      <!-- Table Section -->
      <div class="bg-white p-6 rounded-lg border relative">
        <!-- Plus Button -->
        
        <CreateButton @open-modal="openCreateModal" />
        
         <table class="min-w-full table-auto border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left text-gray-800">S.N</th>
            <th class="border px-4 py-2 text-left text-gray-800">Name</th>
            <th class="border px-4 py-2 text-left text-gray-800">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in roles" :key="index" class="hover:bg-gray-50">
            <td class="border px-4 py-2 text-gray-800">{{ index+1 }}</td>
            <td class="border px-4 py-2 text-gray-800">{{ row.Name }}</td>
            <td class="border px-4 py-2 text-center">
              <Button
                    icon="pi pi-pencil"
                    class="p-button-text text-blue-500"
                    @click="openEditModal(row)"
                    label="Edit"
                  />
              <Button
                    icon="pi pi-users"
                    class="p-button-text text-blue-500"
                    @click="openAssignPermissionDrawer(row)"
                    label="Assign Permission"
                  />
            </td>
          </tr>
        </tbody>
        </table> 
       
     
        <!-- Pagination -->
        <div class="mt-6 flex justify-center items-center space-x-2">
          <Button @click="goToPage(1)" :disabled="currentPage === 1" label="First" />
          
          <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" label="Prev" />
          
          <span class="text-lg font-semibold text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
          
          <Button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" label="Next" />
  
          <Button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" label="Last" />
        </div>
        <!-- <Drawer v-if="openAssignPermissionDrawer" v-model:visible="showAssignPermissionDrawer" header="List of Permission" position="right">
          <div v-for="(permissions, moduleName) in groupedPermissions" :key="moduleName" class="mb-4">
            <h3 class="font-bold">{{ moduleName }}</h3>
            <div v-for="permission in permissions" :key="permission.Id" class="flex items-center gap-2">
              <Checkbox v-model="form.permissionsList" :inputId="permission.Id" name="permission" :value="permission.Id" />
              <label :for="permission.Id">{{ permission.Name }}</label>
            </div>
          </div>
        </Drawer> -->
     
        <Drawer
          v-if="openAssignPermissionDrawer"
          v-model:visible="showAssignPermissionDrawer"
          header="List of Permissions"
          class="!w-full md:!w-80 lg:!w-[30rem] custom-drawer"
          position="right"
        >
          <!-- Scrollable Content -->
          <div class="content-scrollable">
            <div class="p-fluid grid">
              <div
                v-for="(permissions, moduleName) in groupedPermissions"
                :key="moduleName"
                class="col-12 md:col-6 module-container"
              >
                <!-- Module Header -->
                <h4 class="module-title">{{ moduleName }}</h4>
                <!-- Permissions List -->
                <div v-for="permission in permissions" :key="permission.Id" class="field-checkbox permission-item">
                  <Checkbox
                    v-model="form.permissionsList"
                    :inputId="'permission-' + permission.Id"
                    :value="permission.Id"
                  />
                  <label :for="'permission-' + permission.Id">{{ permission.Name }}</label>
                </div>
              </div>
            </div>
          </div>
          <span v-if="errors.permissionsList" class="text-red-500 text-sm">{{ errors.permissionsList }}</span>
          <!-- Sticky Save Button -->
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
            <h3 class="text-2xl font-bold mb-4">Create New Role</h3>
            <form @submit.prevent="createRole" class="space-y-4">
              <div>
                <label class="block text-gray-700">Name</label>
                <input v-model="newRole.name" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
                <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
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
            <h3 class="text-2xl font-bold mb-4">Edit Role</h3>
            <form @submit.prevent="updateRole" class="space-y-4">
              <div>
                <label class="block text-gray-700">User</label>
                <input v-model="editingRole.name" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
                <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
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
  import { toRaw } from 'vue';
  import moment from 'moment';
  import CreateButton from '../components/CreateButton.vue'
  import Table from "../components/Table.vue";
  export default {
  name: "AdminRole",
  data() {
      return {
      newRole: {
          name: ""
      },
      form:{
        permissionsList: [],
        group_id: null
      },
      permissionform:{
        permissions: []
      },
      editingRole: null,
      roles: [],
      permissionsList: [],
      operators: [],
      filters: {
        Name: '',
        search: ''
      },
      showCreateModal: false,
      showEditModal: false,
      showAssignPermissionDrawer: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalCount: 0, 
      originalPermissionsList: [],
      errors: {
        name: null,
        permissionsList: null
      },
      groupedPermissions: {},
      isSaving: false,
      
      };
      

  },
  
  watch:{
    'filters.Name': 'getRoles'
  },
  
  mounted() {
      this.getRoles();
      this.getOperators();
      this.getPermissions();
     
  
  },
  created() {
  },
  methods: {
    isSaveDisabled() {
      console.log('here',this.form.permissionsList.length === this.originalPermissionsList.length &&
      this.form.permissionsList.every((id) => this.originalPermissionsList.includes(id)))
      return (
        this.form.permissionsList.length === this.originalPermissionsList.length &&
        this.form.permissionsList.every((id) => this.originalPermissionsList.includes(id))
      );
    },
    async getPermissions() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/permissions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response', response)
        this.permissionsList = response.data.permissionsList
        this.groupedPermissions = this.permissionsList.reduce((groups, permission) => {
        if (!groups[permission.Module]) {
          groups[permission.Module] = [];
        }
        groups[permission.Module].push(permission);
        return groups;
      }, {});

    } catch (error) {
      console.error("Error creating operator:", error);
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
  async onSave() {
      if (!this.form.permissionsList || this.form.permissionsList.length === 0) {
        console.log("No permissions selected. Save request aborted.");
        return; 
      }
      if (this.isSaving) return; 
      this.isSaving = true;
      try {
        console.log("Saving permissions:", this.form.permissionsList);
        // Simulate a network request with a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.originalPermissionsList = [...this.form.permissionsList]; 
        console.log("Permissions saved successfully.");
      } catch (error) {
        console.error("Error saving permissions:", error);
      } finally {
        this.isSaving = false; 
      }
    },

  // async onSave(){
  //   if (!this.validatePermissionForm(this.form)) return; 
  //     const token = this.getAuthToken();
  //     if (!token) return;
  //     try {
  //         const response = await axios.post(
  //         "/api/roles/create",
  //         this.form,
  //         {
  //             headers: {
  //             Authorization: `Bearer ${token}`,
  //             },
  //         }
  //         );
  //         if(response.data.success == true){
  //          this.closeModal();
  //          this.form = { 
  //             permissionsList: []
  //           };
  //         this.closeModal();
  //         window.location.reload();
  //         }
  //     } catch (error) {
  //         console.error("Error creating Role Permission:", error);
  //     }
      
  // },
  openAssignPermissionDrawer(group){
      this.form.group_id = toRaw(group).Id
      this.showAssignPermissionDrawer = true;
  },

  getAuthToken() {
    const token = localStorage.getItem("authToken"); 
    if (!token) {
        console.error("Authorization token not found");
        return null;
    }
    return token;
  },
  validateForm(role) {
    this.errors = {
      name: null
    };

    let isValid = true;

    if (!role.name) {
        this.errors.name = "Name is required";
        isValid = false;
    }
    return isValid;
  },
  validatePermissionForm(role) {
    this.errors = {
      permissionsList: null
    };

    let isValid = true;

    if (!role.permissionsList) {
        this.errors.permissionsList = "Permission is required";
        isValid = false;
    }
    return isValid;
  },
  async getRoles() {
    const token = this.getAuthToken();
    if (!token) return;
    const offset = (this.currentPage - 1) * this.pageSize;
    try {
      const response = await axios.get("/api/roles", {
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
      const { roleList, totalCount, totalPages } = response.data;
      this.roles = roleList.map(role => ({
        Id: role.Id,
        Name: role.Name
      }));
      this.totalCount = totalCount;
      this.totalPages = totalPages;

    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getRoles();
      }
    },
  
    
  async createRole() {
      if (!this.validateForm(this.newRole)) return; 
      const token = this.getAuthToken();
      if (!token) return;
      try {
          const response = await axios.post(
          "/api/roles/create",
          this.newRole,
          {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          }
          );
          if(response.data.success == true){
           this.closeModal();
           this.newRole = { 
              name: ""
            };
          this.closeModal();
          window.location.reload();
          }
      } catch (error) {
          console.error("Error creating Role:", error);
      }
      },  
      openEditModal(role) {
      console.log('editingRole',role)
      this.editingRole = { 
          id: role.Id,
          name: role.Name};
      this.showEditModal = true;
      this.showCreateModal = false; 
  },
  
  async updateRole() {
      if (!this.validateForm(this.editingRole)) return; 
      const token = this.getAuthToken();
      if (!token) return;
      try {
          const response = await axios.put(
          `/api/roles/update/${this.editingRole.id}`,
          this.editingRole,
          {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          }
          );
          console.log('response',response)
          const index = this.roles.findIndex((op) => op.id === this.editingRole.id);
          if (index !== -1) {
          this.roles.splice(index, 1, response.user);
          }
          window.location.reload();
          this.editingRole = null;
      
          this.closeModal();
      } catch (error) {
          console.error("Error updating role:", error);
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
    /* Drawer Layout */
    .custom-drawer {
      display: flex;
      flex-direction: column;
      height: 100%; /* Full height */
    }

    /* Scrollable Content */
    .content-scrollable {
      flex: 1;
      overflow-y: auto;
      padding: 1rem; /* Optional padding for scrollable area */
    }

    /* Sticky Save Button */
    .save-button {
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
      background-color: #fff;
      position: sticky;
      bottom: 0;
      z-index: 10;
      text-align: right;
    }

    /* Grid Spacing */
    .grid {
      gap: 1rem;
    }

    /* Module Container */
    .module-container {
      padding: 1rem;
      border: 1px solid #dcdcdc;
      border-radius: 8px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Module Title */
    .module-title {
      margin-bottom: 0.75rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #333333;
      text-align: center;
    }

    /* Permission Item */
    .permission-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .permission-item label {
      margin-left: 0.5rem;
      color: #4a4a4a;
    }
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