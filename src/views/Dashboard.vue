<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">Dashboard Overview</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Operators</h3>
        <p class="text-4xl font-bold">1500</p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Tickers</h3>
        <p class="text-4xl font-bold">120</p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Rules</h3>
        <p class="text-4xl font-bold">30</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
};
</script>
