<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold mb-6 text-center">Dashboard Overview</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <p-card class="shadow-md hover:shadow-lg transition-shadow duration-300">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Operators</h3>
            <i class="pi pi-users text-blue-500 text-3xl"></i>
          </div>
        </template>
        <template #content>
          <div class="text-center">
            <p class="text-5xl font-bold text-gray-800 mb-2">{{totalList.operatorList}}</p>
            <p class="text-sm text-gray-500">Total Operators</p>
          </div>
        </template>
      </p-card>

      <!-- Card 2 -->
      <p-card class="shadow-md hover:shadow-lg transition-shadow duration-300">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Accounts</h3>
            <i class="pi pi-ticket text-green-500 text-3xl"></i>
          </div>
        </template>
        <template #content>
          <div class="text-center">
            <p class="text-5xl font-bold text-gray-800 mb-2">{{totalList.accountList}}</p>
            <p class="text-sm text-gray-500">Total Accounts</p>
          </div>
        </template>
      </p-card>

      <!-- Card 3 -->
      <p-card class="shadow-md hover:shadow-lg transition-shadow duration-300">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Rules</h3>
            <i class="pi pi-sliders-h text-purple-500 text-3xl"></i>
          </div>
        </template>
        <template #content>
          <div class="text-center">
            <p class="text-5xl font-bold text-gray-800 mb-2">{{totalList.ruleList}}</p>
            <p class="text-sm text-gray-500">Active Rules</p>
          </div>
        </template>
      </p-card>
    </div>
  </div>
</template>

<script>
import Card from "primevue/card";
import axios from "axios";
export default {
  name: "AdminDashboard",
  components: {
    "p-card": Card
  },
  data(){
    return{
      totalList: {
        accountList: 0,
        ruleList: 0,
        operatorList: 0
      }
    }
  },
  watch: 
  {
    'totalList': 'getAccounts'
  },
  mounted(){
    this.getAccounts()
  },
  methods:{
    getAuthToken() {
        const token = localStorage.getItem("authToken"); 
        if (!token) {
          console.error("Authorization token not found");
          return null;
        }
        return token;
    },
    async getAccounts() {
      const token = this.getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get("/api/users/totalCount", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.totalList.accountList = response.data.totalList.accountList
        this.totalList.ruleList = response.data.totalList.ruleList
        this.totalList.operatorList = response.data.totalList.operatorList
      } catch (error) {
        console.error("Error fetching total list:", error);
      }
    }

  }
};
</script>

<style scoped>
.p-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out;
}
.p-card:hover {
  transform: scale(1.02);
}
</style>
