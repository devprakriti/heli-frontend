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
              <p class="text-sm text-gray-500 text-left">Total Users</p>
            </div>
          </template>
        </p-card>
      </router-link>

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
      userCurrency: [],
      totalList: {
        operatorList: 0
      }
    }
  },
  watch: 
  {
 
  },
  mounted(){
    const userCurrency = localStorage.getItem("userCurrency")
    const operatorList = localStorage.getItem("operatorList");
    if(userCurrency){
      this.userCurrency = userCurrency
    }
  
    if (operatorList) {
      this.totalList.operatorList = operatorList;
    }

  },
  methods:{
    goToLinkOperator() {
      window.location.href = '/operators';
    },
    getAuthToken() {
        const token = localStorage.getItem("authToken"); 
        if (!token) {
          console.error("Authorization token not found");
          return null;
        }
        return token;
    },
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
