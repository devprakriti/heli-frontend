<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="border-b border-gray-300 mb-6">
      <nav class="flex space-x-4">
         <h3 class="text-2xl font-semibold mb-4">Settings</h3>
      </nav>
    </div>

    <!-- Tab Content -->
      <!-- Settings Section -->
      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <!-- <h2 class="text-lg font-semibold mb-4">Spinwin Routine Status</h2> -->

        <!-- Toggle Options -->
        <div class="flex justify-between items-center mb-4">
          <div>
            <!-- <span class="font-semibold text-gray-700">Spinwin Routine  Status</span> -->
            <h2 class="text-lg font-semibold mb-4">Spinwin Routine Status</h2>
           
          </div>
          <div>
               <label class="flex items-center justify-center cursor-pointer">
                  
                  <input type="checkbox" v-model="systemConfig.value" class="sr-only"
                    :checked="systemConfig.value" @click= "changeSettings(systemConfig)"
                  >
                  <span class="ml-2">Disable</span> &nbsp; 
                 <div
                   :class="{
                     'bg-blue-500': systemConfig.value,
                     'bg-gray-300': !systemConfig.value
                   }"
                   class="relative inline-block h-6 w-12 rounded-full"
                 >
                   <span
                     :class="{
                       'translate-x-6': systemConfig.value,
                       'translate-x-1': !systemConfig.value
                     }"
                     class="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition transform"
                   ></span>
                 </div>
                 <span class="ml-2">Enable</span>
               </label>
          </div>
        </div>     
      </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'AdminSettings',
  data() {
    return {
      activeTab: 'settings', 
      statisticalProcedureEnabled: false,
      memberDisplayEnabled: false,
      systemConfig: [],
    };
  },
  watch: {
  },
  mounted() {
    this.getSystemConfig();
  },
  computed: {
  },
  methods: {
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
  }
};
</script>
