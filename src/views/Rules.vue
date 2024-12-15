<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">List of Rules</h3>
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
            <th class="border px-4 py-2 text-left">Name</th>
            <th class="border px-4 py-2 text-left">Type of Condition</th>
            <th class="border px-4 py-2 text-left">Issue Time</th>
            <th class="border px-4 py-2 text-left">Issue Threshold Amount</th>
            <th class="border px-4 py-2 text-left">Sheets</th>
            <th class="border px-4 py-2 text-left">Valid Period</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rules" :key="index" class="hover:bg-gray-50">
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
            <td class="border px-4 py-2">{{ row.name }}</td>
            <td class="border px-4 py-2">{{ row.type }}</td>
            <td class="border px-4 py-2">{{ row.issueTime }}</td>
            <td class="border px-4 py-2">{{ row.issueThresholdAmount }}</td>
            <td class="border px-4 py-2">{{ row.sheets }}</td>
            <td class="border px-4 py-2">{{ row.validPeriod }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Create Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
          <h3 class="text-2xl font-bold mb-4">Create New Rule</h3>
          <div v-if="showErrorNotification" class="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-80 p-4 bg-red-600 text-white rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-300">
            <!-- Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>

            <!-- Error message text -->
            <div class="flex-1">
              <p class="text-sm font-semibold">{{ errorMessage }}</p>
            </div>

            <!-- Close button -->
            <button @click="showErrorNotification = false" class="text-white hover:text-gray-300 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="createRule" class="space-y-4">
            <!-- Rule Name -->
            <div>
              <label class="block text-gray-700">Rule Name</label>
              <input
                v-model="newRule.Name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <!-- Ticket Type -->
            <div>
              <label class="block text-gray-700">Rule Type</label>
              <select
                v-model="newRule.TicketType"
                class="form-select block w-full px-4 py-2 border rounded-lg"
              >
                <option v-for="ticket in ticketTypeList" :key="ticket.Type" :value="ticket.Type" @change="loadParameterTemplate()">{{ capitalizeFirstLetter(ticket.Type) }}</option>
              </select>
            </div>
               
            <div v-if="newRule.parameterTemplate">
              <div v-for="(field, fieldName) in newRule.parameterTemplate" :key="fieldName" class="space-y-4">
                
                <div v-if="Array.isArray(field) && fieldName === 'amountList'">
                  <div v-for="(item, index) in field" :key="index" class="flex items-center space-x-4">
                    
                    <div v-for="(value, key) in item" :key="key" class="flex-1">
                      <label class="block text-gray-700">{{ capitalizeFirstLetter(key) }}</label>
                      <input
                        v-model="newRule.parameterTemplate[fieldName][index][key]"
                        type="number"
                        :min="getMinValue(key)" 
                        class="w-full px-4 py-2 border rounded-lg"
                        :placeholder="key"
                      />
                    </div>

                    <!-- Remove button (only if more than 1 item) -->
                    <div v-if="newRule.parameterTemplate[fieldName].length > 1">
                      <button
                        type="button"
                        class="bg-red-500 text-white py-2 px-4 rounded-lg"
                        @click="removeItem(index)"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <!-- Add More functionality: Only add to the amountList -->
                  <div v-if="newRule.parameterTemplate[fieldName].length < 5" class="flex items-center space-x-4 mt-2">
                    <button
                      type="button"
                      class="bg-blue-500 text-white py-2 px-4 rounded-lg"
                      @click="addMore()"
                    >
                      Add More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ticket Amount -->
            <div>
              <label class="block text-gray-700">Ticket Amount</label>
              <input
                v-model="newRule.TicketAmount"
                type="number"
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <!-- Issue Frequency Radio Buttons -->
            <div>
              <label class="block text-gray-700">Issue Frequency</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newRule.IssueFrequency"
                    value=0
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Everyday</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newRule.IssueFrequency"
                    value=1
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Designated Time</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newRule.IssueFrequency"
                    value=2
                    class="form-radio text-blue-600"
                  />
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
                <multiselect
                  v-if="designatedDateSelected"
                  v-model="selectedDesignatedDates"
                  :options="dateOptions"
                  :multiple="true"
                  :close-on-select="false"
                  placeholder="Select Dates"
                  label="label"
                  track-by="value"
                  class="block w-full mt-2"
                />
              </div>

              <!-- Designated Weekday -->
              <div>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="designatedWeekdaySelected" class="form-checkbox" />
                  <span class="ml-2">Designated Weekday</span>
                </label>
                <multiselect
                  v-if="designatedWeekdaySelected"
                  v-model="selectedDesignatedDays"
                  :options="weekdayOptions"
                  :multiple="true"
                  :close-on-select="false"
                  placeholder="Select Weekdays"
                  label="label"
                  track-by="value"
                  class="block w-full mt-2"
                />
              </div>
            
            </div>
            <div>
              <label class="block text-gray-700">Expiry Type</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newRule.ExpireType"
                    value=0
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Never</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newRule.ExpireType"
                    value=1
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Days</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newRule.ExpireType"
                    value=2
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Hours</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-gray-700">Expiry Time</label>
              <input
                v-model="newRule.ExpireTime"
                type="number"
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="button"
                @click="closeModal"
                class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-screen overflow-y-auto">
          <h3 class="text-2xl font-bold mb-4">Update Rule</h3>
          
          <!-- Error Notification -->
          <div v-if="showErrorNotification" class="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-80 p-4 bg-red-600 text-white rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-300">
            <!-- Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>

            <!-- Error message text -->
            <div class="flex-1">
              <p class="text-sm font-semibold">{{ errorMessage }}</p>
            </div>

            <!-- Close button -->
            <button @click="showErrorNotification = false" class="text-white hover:text-gray-300 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateRule" class="space-y-4">
            <!-- Rule Name -->
            <div>
              <label class="block text-gray-700">Rule Name</label>
              <input
                v-model="editingRule.Name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <!-- Ticket Type -->
            <div>
              <label class="block text-gray-700">Rule Type</label>
              <select
                v-model="editingRule.TicketType"
                class="form-select block w-full px-4 py-2 border rounded-lg"
                @change="loadParameterTemplate()"
                disabled
              >
                <option
                  v-for="ticket in ticketTypeList"
                  :key="ticket.Type"
                  :value="ticket.Type"
                >
                  {{ capitalizeFirstLetter(ticket.Type) }}
                </option>
              </select>
            </div>

            <!-- Parameter Template -->
            <div v-if="editingRule.parameterTemplate">
              <div
                v-for="(field, fieldName) in editingRule.parameterTemplate"
                :key="fieldName"
                class="space-y-4"
              >
                <div v-if="Array.isArray(field) && fieldName === 'amountList'">
                  <div v-for="(item, index) in field" :key="index" class="flex items-center space-x-4">
                    <div v-for="(value, key) in item" :key="key" class="flex-1">
                      <label class="block text-gray-700">{{ capitalizeFirstLetter(key) }}</label>
                      <input
                        v-model="editingRule.parameterTemplate[fieldName][index][key]"
                        type="number"
                        :min="getMinValue(key)"
                        class="w-full px-4 py-2 border rounded-lg"
                        :placeholder="key"
                      />
                    </div>

                    <!-- Remove button (only if more than 1 item) -->
                    <div v-if="editingRule.parameterTemplate[fieldName].length > 1">
                      <button
                        type="button"
                        class="bg-red-500 text-white py-2 px-4 rounded-lg"
                        @click="removeItemEdit(index)"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <!-- Add More functionality -->
                  <div v-if="editingRule.parameterTemplate[fieldName].length < 5" class="flex items-center space-x-4 mt-2">
                    <button
                      type="button"
                      class="bg-blue-500 text-white py-2 px-4 rounded-lg"
                      @click="addMoreEdit()"
                    >
                      Add More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ticket Amount -->
            <div>
              <label class="block text-gray-700">Ticket Amount</label>
              <input
                v-model="editingRule.TicketAmount"
                type="number"
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <!-- Issue Frequency Radio Buttons -->
            <div>
              <label class="block text-gray-700">Issue Frequency</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editingRule.IssueFrequency"
                    value="0"
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Everyday</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editingRule.IssueFrequency"
                    value="1"
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Designated Time</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editingRule.IssueFrequency"
                    value="2"
                    class="form-radio text-blue-600"
                  />
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
                <multiselect
                  v-if="designatedDateSelected"
                  v-model="editingRule.DesignatedDate"
                  :options="dateOptions"
                  :multiple="true"
                  :close-on-select="false"
                  placeholder="Select Dates"
                  label="label"
                  track-by="value"
                  class="block w-full mt-2"
                />
              </div>

              <div>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="designatedWeekdaySelected" class="form-checkbox" />
                  <span class="ml-2">Designated Weekday</span>
                </label>
                <multiselect
                  v-if="designatedWeekdaySelected"
                  v-model="editingRule.DesignatedDays"
                  :options="weekdayOptions"
                  :multiple="true"
                  :close-on-select="false"
                  placeholder="Select Weekdays"
                  value="label"
                  track-by="value"
                  class="block w-full mt-2"
                />
              </div>
            </div>

            <!-- Expiry Type -->
            <div>
              <label class="block text-gray-700">Expiry Type</label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editingRule.ExpireType"
                    value="0"
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Never</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editingRule.ExpireType"
                    value="1"
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Days</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editingRule.ExpireType"
                    value="2"
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Hours</span>
                </label>
              </div>
            </div>

            <!-- Expiry Time -->
            <div>
              <label class="block text-gray-700">Expiry Time</label>
              <input
                v-model="editingRule.ExpireTime"
                type="number"
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end">
              <button
                type="button"
                @click="closeModal"
                class="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg"
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
import Multiselect from 'vue-multiselect';
export default {
  components: {
    Multiselect
  },
  name: 'AdminSettings',
  data() {
    return {
      activeTab: 'settings', 
      statisticalProcedureEnabled: false,
      memberDisplayEnabled: false,
      newRule: {
        Id:"",
        Name: "",
        TicketType: "",
        TicketAmount: "",
        IssueFrequency: "",
        DesignatedDate: [], 
        DesignatedDays: [],
        ExpireType:"",
        ExpireTime:"",
        Status:1,
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
      dateOptions: Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: `Day ${i + 1}` })), 
      weekdayOptions: [
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
        { value: 7, label: 'Sunday' },
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
      errors: { 
        username: null,
        email: null,
        phone: null,
      },
    };
  },


  watch: 
    { 'newRule.TicketType': function (newVal) {
      console.log('newVal', newVal)
      this.loadParameterTemplate();
    },
    editingRule: {
      handler(newVal) {
        console.log('newVal', newVal)
          if(newVal){
            if(newVal.DesignatedDate != null){
            this.designatedDateSelected = newVal.DesignatedDate.length > 0;
            }
          else{
            this.designatedDateSelected = false
            
          }
          if(newVal.DesignatedDays != null)
          {
            this.designatedWeekdaySelected = newVal.DesignatedDays.length > 0;
          }
          else{
            this.designatedWeekdaySelected = false
          }
        }
     
        
      },
      deep: true,
    },
   
  },
  mounted() {
    this.getRules();
    this.getSystemConfig();
    this.getRuleType();
  },



  computed: {
    selectedDaysValues() {
      return this.selectedDesignatedDays.map(day => day.value);
    },
    selectedDatesValues() {
      return this.selectedDesignatedDates.map(date => date.value);
    },
  },
  methods: {
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

    loadParameterTemplate() {
      const selectedTicketType = this.newRule.TicketType; 
      console.log('selectedTicketType:', selectedTicketType);
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
          console.log('response',response)
          this.parameterTemplates = response.data.ruleTypeList
          this.ticketTypeList = response.data.ruleTypeList
      } catch (error) {
          console.error("Error fetching rule type:", error);
      }
      },
    async getSystemConfig(){
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/systemConfig/spinwinRoutine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response',response)
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
        Id:null,
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
      try {
        const response = await axios.get("/api/spinwin/rules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response',response)
        this.rules = response.data.ruleList.map((rule) => ({
          id: rule.Id,
          status: rule.Status,
          name: rule.Name,
          type: rule.TicketType,
          issueTime: this.getIssueFrequencyLabel(rule.IssueFrequency),
          IssueFrequency: rule.IssueFrequency,
          issueThresholdAmount: rule.TicketAmount,
          sheets: 0,
          validPeriod: rule.ExpireTime,
          ExpireType:rule.ExpireType,
          DesignatedDate: rule.DesignatedDate,
          DesignatedDays: rule.DesignatedDays,
          parameterTemplate: rule.Template
        }));
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
        console.log('response',response)
       
        if(response.data.success == true)
        {
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
          if(response.data.success == false){
            this.errorMessage = response.data.message 
            this.showErrorNotification = true;
          }
          console.error("Error creating rule:", response.data.message || "Unknown error");
          
          this.errorMessage = response.data.message || "Something went wrong, please try again.";
          
          this.showErrorNotification = true;
        }

        
        // window.location.reload();
        this.newRule = { 
          Id:"",
          Name: "",
          TicketType: "",
          TicketAmount: "",
          IssueFrequency: "",
          DesignatedDate: "",
          DesignatedDays: "",
          status: "" };
        
        
      } catch (error) {
        console.error("Error creating Rule:", error);
        this.errorMessage = "An error occurred. Please try again later.";
        this.showErrorNotification = true;
      }
    },
  
    openEditModal(rule) {
      console.log('rule',rule)
      this.editingRule = { 
          Id:rule.id,
          Name: rule.name,
          TicketType: rule.type,
          TicketAmount: rule.issueThresholdAmount,
          IssueFrequency: rule.IssueFrequency,
          DesignatedDate:this.dateOptions.filter((o) => {
            const parsedDate = rule.DesignatedDate ? JSON.parse(rule.DesignatedDate) : [];
            return Array.isArray(parsedDate) && parsedDate.includes(o.value);
          }),
          DesignatedDays:this.weekdayOptions.filter((o) => {
            const parsedDay = rule.DesignatedDays ? JSON.parse(rule.DesignatedDays) : [];
            return Array.isArray(parsedDay) && parsedDay.includes(o.value);
          }),

          ExpireType:rule.ExpireType,
          ExpireTime:rule.validPeriod,
          status: rule.status,
          parameterTemplate: JSON.parse(rule.parameterTemplate) }
      this.showEditModal = true;
      this.showCreateModal = false; 
    },

   async updateRule() {
      // if (!this.validateForm(this.editingRule)) return; // Validate before proceeding
      
      const transformedDates = this.editingRule.DesignatedDate.map(item => {
        return parseInt(item.value);
      });
      const transformedDays = this.editingRule.DesignatedDays.map(item => {
        return parseInt(item.value);
      });

      this.editingRule.DesignatedDays = JSON.stringify(transformedDays); // Store only `value` in DesignatedDays
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
        console.log('response',response)
        const index = this.rules.findIndex((op) => op.id === this.editingRule.id);
        if (index !== -1) {
          this.rules.splice(index, 1, response.user);
        }
        // window.location.reload();
        // this.editingRule = null;
        // window.location.reload()
        this.closeModal();
        this.rules()
        window.location.reload()
      } catch (error) {
        console.error("Error updating rule:", error);
      }
    },

    async changeSettings(row){
      row.status = !row.status;
      console.log('here',row)
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
        console.log('Rule status updated successfully:', response.data);
        this.getRules();
        alert('Rule status updated successfully');
        } 
          catch (error) {
          console.error("Error updating rule status:", error);
          alert('Failed to update rule status. Please try again.');
        }
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
        console.log('Rule status updated successfully:', response.data);
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
