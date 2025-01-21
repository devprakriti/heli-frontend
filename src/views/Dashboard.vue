<template>
  <div class="p-6">

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <router-link to="/operators">
        <p-card class="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-medium">Operators</h3>
              <i class="pi pi-user text-blue-500" :style="{ fontSize: '1.2rem' }"></i>
            </div>
          </template>
          <template #content>
            <div class="text-left mt-4">
              <p class="text-4xl font-bold text-gray-800 mb-1 text-left">{{totalList.operatorList}}</p>
              <p class="text-sm text-gray-500 text-left">Total Operators</p>
            </div>
          </template>
        </p-card>
      </router-link>

      <!-- Card 2 -->
      <router-link to="/accounts">
        <p-card class="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-medium">Accounts</h3>
              <i class="pi pi-users text-green-500" :style="{ fontSize: '1.2rem' }"></i>
            </div>
          </template>
          <template #content>
            <div class="text-left mt-4">
              <p class="text-4xl font-bold text-gray-800 mb-1">{{totalList.accountList}}</p>
              <p class="text-sm text-gray-500">Total Accounts</p>
            </div>
          </template>
        </p-card>
      </router-link>

      <!-- Card 3 -->
      <router-link to="/rules">
        <p-card class="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-medium">Rules</h3>
              <i class="pi pi-sliders-h text-yellow-500" :style="{ fontSize: '1.2rem' }"></i>
            </div>
          </template>
          <template #content>
            <div class="text-left mt-4">
              <p class="text-4xl font-bold text-gray-800 mb-1">{{totalList.ruleList}}</p>
              <p class="text-sm text-gray-500">Active Rules</p>
            </div>
          </template>
        </p-card>
      </router-link>
      <!-- Card 4 -->
      <router-link to="/tickets">
        <p-card class="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-medium">Tickets</h3>
              <i class="pi pi-ticket text-purple-500" :style="{ fontSize: '1.2rem' }"></i>
            </div>
          </template>
          <template #content>
            <div class="text-left mt-4">
              <p class="text-4xl font-bold text-gray-800 mb-1">{{totalList.ticketList}}</p>
              <p class="text-sm text-gray-500">Active Tickets</p>
            </div>
          </template>
        </p-card>
      </router-link>

      <!-- <router-view /> -->
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
        operatorList: 0,
        ticketList: 0
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
    goToLinkOperator() {
      window.location.href = '/operators'; // Replace with your desired URL
    },
    goToLinkAccounts() {
      window.location.href = '/accounts'; // Replace with your desired URL
    },
    goToLinkRules() {
      window.location.href = '/rules'; // Replace with your desired URL
    },
    goToLinkRules() {
      window.location.href = '/tickets'; // Replace with your desired URL
    },
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
        this.totalList.ticketList = response.data.totalList.ticketList;
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
