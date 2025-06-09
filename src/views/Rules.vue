<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Tab Navigation -->
    <!-- <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">List of Rules</h3>
      </nav>
    </div> -->
    <!-- Filter Section -->
    <!-- Filter Section -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 class="text-xl font-semibold mb-4">Filter Rules</h3>
      <div class="flex space-x-4 mb-4">
        <!-- Date Range Filter (Start Date) -->
        <div class="flex-1">
          <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
          <Calendar id="start-date" v-model="filters.fromTime" :showIcon="true" placeholder="Pick a date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            :maxDate="maxDate" />
        </div>

        <!-- Date Range Filter (End Date) -->
        <div class="flex-1">
          <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
          <Calendar id="end-date" v-model="filters.toTime" :showIcon="true" placeholder="Pick a date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            :minDate="filters.fromTime" :maxDate="maxDate" />
        </div>
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search By Name</label>
          <InputText  type="search" autocomplete="off"  id="search" v-model="filters.Name" placeholder="Search by Name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
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
          </div>-->
      </div>
      <div class="flex space-x-4 mb-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search By TicketType</label>
          <Select v-model="filters.TicketType" :options="ticketTypeList" showClear optionLabel="Type"
            placeholder="Select a TicketType" fluid />
        </div>
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search By Status</label>
          <Select v-model="filters.Status" :options="statusList" showClear optionLabel="name"
            placeholder="Select a Status" fluid />

        </div>

      </div>
    </div>


    <!-- Table Section -->
    <div class="bg-white p-6 rounded-lg border relative">
      <div v-if="(!items || items.length === 0) && !showNoData" class="flex justify-center items-center min-h-[550px]">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration=".7s" />
        </div>

        <!-- No items found -->
        <div v-else-if="showNoData" class="flex justify-center items-center min-h-[550px]">
            <p class="text-gray-500 text-lg">No items found</p>
        </div>
      <!-- Plus Button -->
      <div v-else>
          <CreateButton @open-modal="openCreateModal" />
          <table class="min-w-full table-auto border-collapse border border-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="border px-4 py-2 text-left">S.N</th>
                <th class="border px-4 py-2 text-left">Name</th>
                <th class="border px-4 py-2 text-left">Type of Condition</th>
                <th class="border px-4 py-2 text-left" v-if="store?.hasRoutePermission($route.name, 'update')">Status</th>
                <th class="border px-4 py-2 text-left" v-if="store?.hasRoutePermission($route.name, 'update')">Action</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, index) in rules" :key="index">
                <tr class="hover:bg-gray-50">
                  <td class="border px-4 py-2">{{ index + 1 }}</td>
                  <td class="border px-4 py-2">{{ row.name }}</td>
                  <td class="border px-4 py-2">{{ row.type }}</td>
                  <td class="border px-4 py-2 text-center" v-if="store?.hasRoutePermission($route.name, 'update')">
                    <ToggleSwitch :model-value="!!row.status" @change="toggleStatus(row)" />
                  </td>
                  <td class="border px-2 py-2 space-x-0" v-if="store?.hasRoutePermission($route.name, 'update')">
                    <Button icon="pi pi-pencil" class="p-button-text" @click="openEditModal(row)" label="Edit" />
    
                    <Button icon="pi pi-eye" class="p-button-text " @click="toggleDetails(row.id)" label="View" />
                  </td>
                </tr>
                <tr v-if="expandedRuleId === row.id">
                  <td colspan="5">
                    <table class="w-full mx-auto border-collapse border border-gray-400 rounded-md shadow-sm">
                      <thead class="bg-blue-200">
                        <tr>
                          <th class="border px-4 py-2 text-left">Issue Frequency</th>
                          <th class="border px-4 py-2 text-left">Ticket Amount</th>
                          <th class="border px-4 py-2 text-left">Designated Date</th>
                          <th class="border px-4 py-2 text-left">Designated Days</th>
                          <th class="border px-4 py-2 text-left">Expire Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="border px-4 py-2">{{ row.issueTime }}</td>
                          <td class="border px-4 py-2">{{ row.issueThresholdAmount }}</td>
                          <td class="border px-4 py-2">{{ getDesignatedDate(row.DesignatedDate) }}</td>
                          <td class="border px-4 py-2">{{ getWeekdayNames(row.DesignatedDays) }}</td>
                          <td class="border px-4 py-2">{{ row.validPeriod }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <Button @click="goToPage(1)" :disabled="currentPage === 1" label="First" />

        <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" label="Prev" />

        <span class="text-lg font-semibold text-gray-700">{{ currentPage }} / {{ totalPages === 0 ? 1 : totalPages
          }}</span>

        <Button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages || totalPages === 0"
          label="Next" />

        <Button @click="goToPage(totalPages)" :disabled="currentPage === totalPages || totalPages === 0" label="Last" />

      </div>

      <!-- Create Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
          <h3 class="text-2xl font-bold mb-4">Create New Rule</h3>
          <div v-if="showErrorNotification"
            class="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-80 p-4 bg-red-600 text-white rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-300">
            <!-- Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>

            <!-- Error message text -->
            <div class="flex-1">
              <p class="text-sm font-semibold">{{ errorMessage }}</p>
            </div>

            <!-- Close button -->
            <button @click="showErrorNotification = false" class="text-white hover:text-gray-300 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="createRule" class="space-y-4">
            <!-- Rule Name -->
            <div>
              <label class="block font-medium mb-2">Rule Name</label>
              <input v-model="newRule.Name" type="text"
                class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300 " />
            </div>

            <!-- Ticket Type -->
            <div>
              <label class="block font-medium mb-2">Rule Type</label>
              <select v-model="newRule.TicketType" class="form-select block w-full px-4 py-2 border rounded-lg">
                <option v-for="ticket in ticketTypeList" :key="ticket.Type" :value="ticket.Type"
                  @change="loadParameterTemplate()">{{ capitalizeFirstLetter(ticket.Type) }}</option>
              </select>
            </div>

            <div v-if="newRule.parameterTemplate">
              <div v-for="(field, fieldName) in newRule.parameterTemplate" :key="fieldName" class="space-y-4">

                <div v-if="Array.isArray(field) && fieldName === 'amountList'">
                  <div v-for="(item, index) in field" :key="index" class="flex items-center space-x-4">

                    <div v-for="(value, key) in item" :key="key" class="flex-1">
                      <label class="block font-medium mb-2">{{ capitalizeFirstLetter(key) }}</label>
                      <input v-model="newRule.parameterTemplate[fieldName][index][key]" type="number"
                        :min="getMinValue(key)"  class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" :placeholder="key" />
                    </div>

                    <!-- Remove button (only if more than 1 item) -->
                    <div v-if="newRule.parameterTemplate[fieldName].length > 1">
                      <button type="button" class="bg-red-500 text-white py-2 px-4 rounded-lg"
                        @click="removeItem(index)">
                        Remove
                      </button>
                    </div>
                  </div>

                  <!-- Add More functionality: Only add to the amountList -->
                  <div v-if="newRule.parameterTemplate[fieldName].length < 5" class="flex items-center space-x-4 mt-2">
                    <Button type="button" label="Add More"  @click="addMore()" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Ticket Amount -->
            <div>
              <label class="block font-medium mb-2">Ticket Amount</label>
              <input v-model="newRule.TicketAmount" type="number" class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
            </div>

            <!-- Issue Frequency Radio Buttons -->
            <div>
              <label class="block font-medium mb-2">Issue Frequency</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="newRule.IssueFrequency" value=0 class="form-radio text-blue-600" />
                  <span class="ml-2">Everyday</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="newRule.IssueFrequency" value=1 class="form-radio text-blue-600" />
                  <span class="ml-2">Designated Time</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="newRule.IssueFrequency" value=2 class="form-radio text-blue-600" />
                  <span class="ml-2">Manual</span>
                </label>
              </div>
            </div>

            <div v-if="newRule.IssueFrequency == 1">
              <!-- Designated Date -->
              <div>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="designatedDateSelected" class="form-checkbox" />
                  <span class="ml-2">Designated Date</span>
                </label>
                <MultiSelect v-if="designatedDateSelected" v-model="selectedDesignatedDates" :options="dateOptions"
                  optionLabel="name" filter placeholder="Select Date" :maxSelectedLabels="10"
                  class="block w-full mt-2" />
              </div>


              <!-- Designated Weekday -->
              <div>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="designatedWeekdaySelected" class="form-checkbox" />
                  <span class="ml-2">Designated Weekday</span>
                </label>
                <MultiSelect v-if="designatedWeekdaySelected" v-model="selectedDesignatedDays" :options="weekdayOptions"
                  optionLabel="name" filter placeholder="Select Weekdays" :maxSelectedLabels="10"
                  class="block w-full mt-2" />
              </div>

            </div>
            <div>
              <label class="block font-medium mb-2">Expiry Type</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="newRule.ExpireType" value=0 class="form-radio text-blue-600" />
                  <span class="ml-2">Never</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="newRule.ExpireType" value=1 class="form-radio text-blue-600" />
                  <span class="ml-2">Days</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="newRule.ExpireType" value=2 class="form-radio text-blue-600" />
                  <span class="ml-2">Hours</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block font-medium mb-2">Expiry Time</label>
              <input v-model="newRule.ExpireTime" type="number" class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
            </div>

            <div class="flex justify-end gap-x-3">
              <Button type="button" @click="closeModal" label="Cancel" severity="secondary"/>
              <Button type="submit" label="Create" />
            </div>
          </form>
        </div>
      </div>

      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
          <h3 class="text-2xl font-bold mb-4">Update Rule</h3>

          <!-- Error Notification -->
          <div v-if="showErrorNotification"
            class="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-80 p-4 bg-red-600 text-white rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-300">
            <!-- Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>

            <!-- Error message text -->
            <div class="flex-1">
              <p class="text-sm font-semibold">{{ errorMessage }}</p>
            </div>

            <!-- Close button -->
            <button @click="showErrorNotification = false" class="text-white hover:text-gray-300 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateRule" class="space-y-4">
            <!-- Rule Name -->
            <div>
              <label class="block font-medium mb-2">Rule Name</label>
              <input v-model="editingRule.Name" type="text"
                class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300 " />
            </div>

            <!-- Ticket Type -->
            <div>
              <label class="block font-medium mb-2">Rule Type</label>
              <select v-model="editingRule.TicketType" class="form-select block w-full px-4 py-2 border rounded-lg"
                @change="loadParameterTemplate()" disabled>
                <option v-for="ticket in ticketTypeList" :key="ticket.Type" :value="ticket.Type">
                  {{ capitalizeFirstLetter(ticket.Type) }}
                </option>
              </select>
            </div>

            <!-- Parameter Template -->
            <div v-if="editingRule.parameterTemplate">
              <div v-for="(field, fieldName) in editingRule.parameterTemplate" :key="fieldName" class="space-y-4">
                <div v-if="Array.isArray(field) && fieldName === 'amountList'">
                  <div v-for="(item, index) in field" :key="index" class="flex items-center space-x-4">
                    <div v-for="(value, key) in item" :key="key" class="flex-1">
                      <label class="block font-medium mb-2">{{ capitalizeFirstLetter(key) }}</label>
                      <input v-model="editingRule.parameterTemplate[fieldName][index][key]" type="number"
                        :min="getMinValue(key)" class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" :placeholder="key" />
                    </div>

                    <!-- Remove button (only if more than 1 item) -->
                    <div v-if="editingRule.parameterTemplate[fieldName].length > 1">
                      <button type="button" class="bg-red-500 text-white py-2 px-4 rounded-lg"
                        @click="removeItemEdit(index)">
                        Remove
                      </button>
                    </div>
                  </div>

                  <!-- Add More functionality -->
                  <div v-if="editingRule.parameterTemplate[fieldName].length < 5"
                    class="flex items-center space-x-4 mt-2">
                    <Button type="button" @click="addMoreEdit()" label="Add More" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Ticket Amount -->
            <div>
              <label class="block font-medium mb-2">Ticket Amount</label>
              <input v-model="editingRule.TicketAmount" type="number" class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
            </div>

            <!-- Issue Frequency Radio Buttons -->
            <div>
              <label class="block font-medium mb-2">Issue Frequency</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="editingRule.IssueFrequency" value="0" class="form-radio text-blue-600" />
                  <span class="ml-2">Everyday</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="editingRule.IssueFrequency" value="1" class="form-radio text-blue-600" />
                  <span class="ml-2">Designated Time</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="editingRule.IssueFrequency" value="2" class="form-radio text-blue-600" />
                  <span class="ml-2">Manual</span>
                </label>
              </div>
            </div>

            <!-- Designated Time Options -->
            <div v-if="editingRule.IssueFrequency == 1">
              <div>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="designatedDateSelected" class="form-checkbox" />
                  <span class="ml-2">Designated Date</span>
                </label>

                <MultiSelect v-if="editingRule.DesignatedDate" v-model="editingRule.DesignatedDate"
                  :options="dateOptions" optionLabel="name" filter placeholder="Select Date" :maxSelectedLabels="10"
                  class="block w-full mt-2" />

              </div>

              <div>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="designatedWeekdaySelected" class="form-checkbox" />
                  <span class="ml-2">Designated Weekday</span>
                </label>
                <MultiSelect v-if="designatedWeekdaySelected" v-model="editingRule.DesignatedDays"
                  :options="weekdayOptions" optionLabel="name" filter placeholder="Select Date" :maxSelectedLabels="10"
                  class="block w-full mt-2" />
              </div>
            </div>

            <!-- Expiry Type -->
            <div>
              <label class="block font-medium mb-2">Expiry Type</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="editingRule.ExpireType" value="0" class="form-radio text-blue-600" />
                  <span class="ml-2">Never</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="editingRule.ExpireType" value="1" class="form-radio text-blue-600" />
                  <span class="ml-2">Days</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="editingRule.ExpireType" value="2" class="form-radio text-blue-600" />
                  <span class="ml-2">Hours</span>
                </label>
              </div>
            </div>

            <!-- Expiry Time -->
            <div>
              <label class="block font-medium mb-2">Expiry Time</label>
              <input v-model="editingRule.ExpireTime" type="number" class="w-full px-4 py-2 border rounded-lg placeholder:font-light focus:outline-none focus:ring focus:ring-slate-300" />
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-x-3">
              <Button type="button" @click="closeModal" label="Cancel" severity="secondary" />
              <Button type="submit"  label="Update"  />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Multiselect from 'vue-multiselect';
import CreateButton from '../components/CreateButton.vue';
import Select from 'primevue/select';
import ProgressSpinner from 'primevue/progressspinner';
import { store } from "../store/auth";
export default {
  components: {
    Multiselect,
    Select
  },
  name: 'AdminSettings',
  data() {
    return {
      store,
      items: null,
      tableColumns: null,
      showNoData: false,
      extendedTable: false,
      activeTab: 'settings',
      loading: true,
      statisticalProcedureEnabled: false,
      memberDisplayEnabled: false,
      filters: {
        Name: null,
        TicketType: null,
        Status: null,
        fromTime: null,
        toTime: null,
        search: null
      },
      newRule: {
        Id: "",
        Name: "",
        TicketType: "",
        TicketAmount: "",
        IssueFrequency: "",
        DesignatedDate: [],
        DesignatedDays: [],
        ExpireType: "",
        ExpireTime: "",
        Status: 1,
        Template: null,
        parameterTemplate: null,
      },
      parameterTemplate: null,
      parameterTemplates: null,
      ticketTypeList: [],
      issueFrequency: 'everyday',
      designatedDateSelected: false,
      designatedWeekdaySelected: false,
      selectedDesignatedDates: [],
      selectedDesignatedDays: [],
      designatedDates: [],
      selectedWeekdays: [],
      selectedDates: [],
      showErrorNotification: false,
      dateOptions: Array.from({ length: 31 }, (_, i) => ({
        code: i + 1,
        name: `Day ${i + 1}`,
      })),
      statusList: ([
        { name: 'Active', code: '1' },
        { name: 'Inactive', code: '0' }]),
      weekdayOptions: [
        { code: 1, name: 'Monday' },
        { code: 2, name: 'Tuesday' },
        { code: 3, name: 'Wednesday' },
        { code: 4, name: 'Thursday' },
        { code: 5, name: 'Friday' },
        { code: 6, name: 'Saturday' },
        { code: 7, name: 'Sunday' },
      ],
      isReadOnly: true,
      editingRule: {
        Name: '',
        TicketType: '',
        TicketAmount: '',
        IssueFrequency: 0,
        DesignatedDate: [],
        DesignatedDays: [],
        ExpireType: 0,
        ExpireTime: '',
        Template: null,
        parameterTemplate: null,
      },
      systemConfig: [],
      rules: [],
      showCreateModal: false,
      showEditModal: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalCount: 0,
      errors: {
        username: null,
        email: null,
        phone: null,
      },
      maxDate: null,
      expandedRuleId: null,
      selectedCities: [],
    };
  },

  watch:
  {
    'filters.toTime': 'getRules',
    'filters.fromTime': 'getRules',
    'filters.Name': 'getRules',
    'filters.TicketType': 'getRules',
    'filters.Status': 'getRules',
    'newRule.TicketType': function (newVal) {
      this.loadParameterTemplate();
    },
    items: {
            immediate: true, 
            handler(newItems) {
                if (!newItems || newItems.length === 0) {
                setTimeout(() => {
                    if (!this.items || this.items.length === 0) {
                        this.showNoData = true;
                    }
                }, 1000);
            } else {
                this.showNoData = false; 
            }
            },
        },

    editingRule: {
      handler(newVal) {
        if (newVal) {
          if (newVal.DesignatedDate != null) {
            this.designatedDateSelected = newVal.DesignatedDate.length > 0;
          }
          else {
            this.designatedDateSelected = false

          }
          if (newVal.DesignatedDays != null) {
            this.designatedWeekdaySelected = newVal.DesignatedDays.length > 0;
          }
          else {
            this.designatedWeekdaySelected = false
          }
        }


      },
      deep: true,
    },

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
    this.getRules();
    this.getSystemConfig();
    this.getRuleType();
  },

  computed: {
    selectedDaysValues() {
      return this.selectedDesignatedDays.map(day => day.code);
    },
    selectedDatesValues() {
      return this.selectedDesignatedDates.map(date => date.code);
    },
  },
  computed: {
    filteredExtendedItems() {
      if (!this.expandedRuleId) return [];
      return this.items.filter((item) => item.id === this.expandedRuleId);
    },
  },
  methods: {
    toggleDetails(ruleId) {
      this.expandedRuleId =
        this.expandedRuleId === ruleId ? null : ruleId;
      this.extendedTable = this.expandedRuleId === ruleId ? true : false;
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getTickets();
      }
    },

    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    addMore() {
      if (this.newRule.parameterTemplate && Array.isArray(this.newRule.parameterTemplate.amountList)) {
        const firstItem = this.newRule.parameterTemplate.amountList[0];

        const newItem = {};

        Object.keys(firstItem).forEach(key => {
          if (key === 'ticketAmount') {
            newItem[key] = 5;
          } else if (key === 'thresholdAmount') {
            newItem[key] = 500;
          } else {
            newItem[key] = 0;
          }
        });

        this.newRule.parameterTemplate.amountList.push(newItem);
      }
    },
    removeItem(index) {
      if (this.newRule.parameterTemplate.amountList.length > 1) {
        this.newRule.parameterTemplate.amountList.splice(index, 1);
      }
    },
    removeItemEdit(index) {
      if (this.editingRule.parameterTemplate.amountList.length > 1) {
        this.editingRule.parameterTemplate.amountList.splice(index, 1);
      }
    },
    addMoreEdit() {
      if (this.editingRule.parameterTemplate && Array.isArray(this.editingRule.parameterTemplate.amountList)) {
        const firstItem = this.editingRule.parameterTemplate.amountList[0];

        const newItem = {};

        Object.keys(firstItem).forEach(key => {
          if (key === 'ticketAmount') {
            newItem[key] = 5;
          } else if (key === 'thresholdAmount') {
            newItem[key] = 500;
          } else {
            newItem[key] = 0;
          }
        });

        this.editingRule.parameterTemplate.amountList.push(newItem);
      }
    },


    getMinValue(key) {
      if (key === 'ticketAmount') {
        return 5;
      } else if (key === 'thresholdAmount') {
        return 500;
      }
      return 0;
    },
    loadTicketFilter() {
      const selectedTicketType = this.filters.TicketType;
      const selectedTemplate = this.ticketTypeList.find(item => item.Type === selectedTicketType);
    },
    loadParameterTemplate() {
      const selectedTicketType = this.newRule.TicketType;
      const selectedTemplate = this.ticketTypeList.find(item => item.Type === selectedTicketType);
      if (selectedTemplate) {
        this.newRule.parameterTemplate = selectedTemplate.ParameterTemplate;
      } else {
        console.log('No template found for', selectedTicketType);
      }
    },
    async getRuleType() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/spinwin/ruleType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.parameterTemplates = response.data.ruleTypeList
        this.ticketTypeList = response.data.ruleTypeList
      } catch (error) {
        console.error("Error fetching rule type:", error);
      }
    },
    async getSystemConfig() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/systemConfig/spinwinRoutine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.systemConfig = {
          id: response.data.systemconfigList.Id,
          parameter: response.data.systemconfigList.Parameter,
          value: parseInt(response.data.systemconfigList.Value),
          comment: response.data.systemconfigList.Comment
        };

      } catch (error) {
        console.error("Error fetching rules:", error);
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
    validateForm(rule) {
      this.errors = {
        Id: null,
        Name: null,
        TicketType: null,
        TicketAmount: null,
        IssueFrequency: null,
        DesignatedDate: null,
        DesignatedDays: null,
        status: null
      };

      let isValid = true;

      if (!rule.Name) {
        this.errors.Name = "Name is required";
        isValid = false;
      }

      if (!rule.TicketType) {
        this.errors.TicketType = "TicketType is required";
        isValid = false;
      }

      if (!rule.TicketAmount) {
        this.errors.TicketAmount = "TicketAmount is required";
        isValid = false;
      }

      if (!rule.IssueFrequency) {
        this.errors.IssueFrequency = "IssueFrequency number is required";
        isValid = false;
      }

      return isValid;
    },
    async getRules() {
      const token = this.getAuthToken();
      if (!token) return;
      const offset = (this.currentPage - 1) * this.pageSize;
      try {
        const response = await axios.get("/api/spinwin/rules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          params: {
            Name: this.filters.Name,
            ...(this.filters.TicketType !== null && this.filters.TicketType.Type !== null
              ? { TicketType: this.filters.TicketType.Type }
              : {}),
            ...(this.filters.Status !== null && this.filters.Status.code !== null
              ? { Status: this.filters.Status.code }
              : {}),

            fromTime: this.filters.fromTime,
            toTime: this.filters.toTime,
            page: this.currentPage,
            pageSize: this.pageSize,
            offset: offset,
          },
        });
        const { ruleList, totalCount, totalPages } = response.data;
        this.rules = ruleList.map((rule) => ({
          id: rule.Id,
          status: rule.Status,
          name: rule.Name,
          type: rule.TicketType,
          issueTime: this.getIssueFrequencyLabel(rule.IssueFrequency),
          IssueFrequency: rule.IssueFrequency,
          issueThresholdAmount: rule.TicketAmount,
          sheets: 0,
          validPeriod: rule.ExpireTime,
          ExpireType: rule.ExpireType,
          DesignatedDate: rule.DesignatedDate,
          DesignatedDays: rule.DesignatedDays,
          parameterTemplate: rule.Template
        }));
        this.items = ruleList.map((rule) => ({
          id: rule.Id,
          status: rule.Status,
          name: rule.Name,
          type: rule.TicketType,
          issueTime: this.getIssueFrequencyLabel(rule.IssueFrequency),
          IssueFrequency: rule.IssueFrequency,
          issueThresholdAmount: rule.TicketAmount,
          sheets: 0,
          validPeriod: rule.ExpireTime,
          ExpireType: rule.ExpireType,
          DesignatedDate: rule.DesignatedDate,
          DesignatedDays: rule.DesignatedDays,
          parameterTemplate: rule.Template
        }));
        this.tableColumns = [
          { field: 'name', header: 'Name' },
          { field: 'type', header: 'Type' },
          { field: 'status', header: 'Status' },
          { field: 'action', header: 'Action' },
        ];
        this.expandedTableColumns = [
          { field: 'issueTime', header: 'Issue Frequency' },
          { field: 'issueThresholdAmount', header: 'Ticket Amount' },
          { field: 'DesignatedDate', header: 'DesignatedDate' },
          { field: 'DesignatedDays', header: 'DesignatedDays' },
          { field: 'validPeriod', header: 'Expire Time' },
        ];
        this.totalCount = totalCount;
        this.totalPages = totalPages;
      } catch (error) {
        console.error("Error fetching rules:", error);
      }
    },

    getIssueFrequencyLabel(issueFrequency) {
      if (issueFrequency === 0) {
        return 'Everyday';
      } else if (issueFrequency === 1) {
        return 'Specified Time';
      } else if (issueFrequency === 2) {
        return 'Manual';
      }
      return 'Unknown';
    },

    async createRule() {
      this.newRule.DesignatedDays = JSON.stringify(this.selectedDaysValues);
      this.newRule.DesignatedDate = JSON.stringify(this.selectedDatesValues);
      this.newRule.parameterTemplate = JSON.stringify(this.newRule.parameterTemplate)
      if (!this.validateForm(this.newRule)) return;
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.post(
          "/api/spinwin/rule/create",
          this.newRule,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success == true) {
          const createdRule = {
            id: response.data.rule.id,
            ...this.newRule,
            status: true,
          };
          this.rules.push(createdRule);
          this.closeModal();
          window.location.reload();
        }
        else {
          if (response.data.success == false) {
            this.errorMessage = response.data.message
            this.showErrorNotification = true;
          }
          console.error("Error creating rule:", response.data.message || "Unknown error");

          this.errorMessage = response.data.message || "Something went wrong, please try again.";

          this.showErrorNotification = true;
        }


        // window.location.reload();
        this.newRule = {
          Id: "",
          Name: "",
          TicketType: "",
          TicketAmount: "",
          IssueFrequency: "",
          DesignatedDate: "",
          DesignatedDays: "",
          status: ""
        };


      } catch (error) {
        console.error("Error creating Rule:", error);
        this.errorMessage = "An error occurred. Please try again later.";
        this.showErrorNotification = true;
      }
    },

    openEditModal(rule) {
      const designatedDate = rule.DesignatedDate
        ? JSON.parse(rule.DesignatedDate) // Parse JSON string into an array
        : [];

      const designatedDays = rule.DesignatedDays
        ? JSON.parse(rule.DesignatedDays) // Parse JSON string into an array
        : [];
      this.editingRule = {
        Id: rule.id,
        Name: rule.name,
        TicketType: rule.type,
        TicketAmount: rule.issueThresholdAmount,
        IssueFrequency: rule.IssueFrequency,
        DesignatedDate: designatedDate.map(d => ({
          code: d,
          name: `Day ${d}`
        })),
        // DesignatedDays: designatedDays.map(day => ({
        //   code: day,
        //   name: this.weekdayOptions[day], 
        // })),
        // this.weekdays.filter(day => this.selectedDays.includes(day.code))
        DesignatedDays: this.weekdayOptions.filter(day => designatedDays.includes(day.code)),

        ExpireType: rule.ExpireType,
        ExpireTime: rule.validPeriod,
        status: rule.status,
        parameterTemplate: JSON.parse(rule.parameterTemplate)
      }
      this.showEditModal = true;
      this.showCreateModal = false;
    },

    async updateRule() {
      const transformedDates = this.editingRule.DesignatedDate.map(item => {
        return parseInt(item.code);
      });
      const transformedDays = this.editingRule.DesignatedDays.map(item => {
        return parseInt(item.code);
      });

      this.editingRule.DesignatedDays = JSON.stringify(transformedDays);
      this.editingRule.DesignatedDate = JSON.stringify(transformedDates);
      this.editingRule.parameterTemplate = JSON.stringify(this.editingRule.parameterTemplate)
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.put(
          `/api/spinwin/rule/update/${this.editingRule.Id}`,
          this.editingRule,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const index = this.rules.findIndex((op) => op.id === this.editingRule.id);
        if (index !== -1) {
          this.rules.splice(index, 1, response.user);
        }
        // window.location.reload();
        // this.editingRule = null;
        // window.location.reload()
        this.closeModal();
        window.location.reload()
        this.rules()

      } catch (error) {
        console.error("Error updating rule:", error);
        this.errorMessage = "An error occurred. Please try again later.";
        this.showErrorNotification = true;
      }
    },

    async changeSettings(row) {
      row.status = !row.status;
      try {
        const token = this.getAuthToken();
        if (!token) return;

        const response = await axios.put(
          `/api/systemConfig/update/status/${row.id}`,
          { ...row },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.getRules();
        alert('Rule status updated successfully');
      }
      catch (error) {
        console.error("Error updating rule status:", error);
        alert('Failed to update rule status. Please try again.');
      }
    },
    getWeekdayNames(daysArray) {
      const parsedDays = JSON.parse(daysArray) 
      if (Array.isArray(parsedDays) && parsedDays?.length > 0) {
        const dayNames = this.weekdayOptions
          .filter(day => parsedDays?.includes(day.code))
          .map(day => day.name);
        return dayNames.join(', '); 
      }
    },
    getDesignatedDate(dateArray) {
      const parsedDate = JSON.parse(dateArray)  
      return (Array.isArray(parsedDate) && parsedDate.length) > 0 ? parsedDate.join(', ') : ''
    },
    async toggleStatus(row) {
      row.status = !row.status;
      try {
        const token = this.getAuthToken();
        if (!token) return;

        const response = await axios.put(
          `/api/spinwin/rule/updateStatus/${row.id}`,
          { ...row },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.getRules();
        alert('Rule status updated successfully');
      }
      catch (error) {
        console.error("Error updating rule status:", error);
        alert('Failed to update rule status. Please try again.');
      }
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
  }
};
</script>

<style scoped>
table {
  border-spacing: 0;
}

th {
  background-color: #f3f4f6;
  color: #3f3f46;
}

td {
  color: black;
  font-weight: 400;
  padding: 11.25px 15px;
}

tbody tr:hover {
  background-color: #f9fafb;
}
</style>