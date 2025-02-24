<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div class="flex items-center">
        <!-- Menu Button -->
        <button @click="toggleSidebar" class="text-gray-700 hover:text-gray-900 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <!-- Logo -->
        <img :src="logo" alt="Logo" class="h-10 ml-4">
      </div>
    </nav>

    <!-- Sidebar Navigation -->
    <div 
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
      class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 border-r"
    >
      <div class="p-6 flex items-center border-b">
        <img :src="logo" alt="Logo" class="h-8 mr-2">
        <span class="text-xl font-bold text-blue-700">NFZ</span>
      </div>

      <ul class="mt-4 space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <router-link 
            :to="item.link" 
            class="flex items-center px-6 py-3 space-x-3 rounded-lg transition"
            :class="{'bg-blue-700 text-white': activeMenu === item.name, 'hover:bg-gray-100 text-gray-700': activeMenu !== item.name}"
            @click="setActiveMenu(item.name)"
          >
            <component :is="item.icon" class="w-5 h-5" :class="{'text-white': activeMenu === item.name, 'text-gray-500': activeMenu !== item.name}"/>
            <span class="font-medium">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Overlay to close sidebar when clicking outside -->
    <div 
      v-if="isSidebarOpen" 
      @click="toggleSidebar" 
      class="fixed top-0 left-64 w-[calc(100%-16rem)] h-full bg-black opacity-50 z-40"
    ></div>

    <!-- Main Dashboard Content -->
    <div class="p-6 flex justify-center items-center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <!-- Left Card (Summary) -->
        <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-96">
          <h2 class="text-xl font-bold mb-4 text-center">Dashboard Summary</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <!-- Blue Card: Total Items Sold -->
            <div class="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 class="text-lg font-semibold">Total Items Sold</h3>
              <p class="text-2xl font-bold">1,250</p>
            </div>
            <!-- Red Card: Total Transactions -->
            <div class="bg-red-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 class="text-lg font-semibold">Total Transactions</h3>
              <p class="text-2xl font-bold">320</p>
            </div>
            <!-- Green Card: Gross Amount -->
            <div class="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 class="text-lg font-semibold">Gross Amount</h3>
              <p class="text-2xl font-bold">$5,800</p>
            </div>
          </div>
        </div>

        <!-- Right Card (Statistic Graph) -->
        <div class="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center h-96">
          <canvas id="chart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import logoImage from "@/assets/image.png"; // Import the image

// Importing icons
import { HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";

export default {
  name: "DashboardPage",
  setup() {
    const isSidebarOpen = ref(false);
    const activeMenu = ref("Dashboard"); // Default selected menu
    const logo = logoImage;

    const menuItems = [
      { name: "Dashboard", label: "Dashboard", icon: HomeIcon, link: "/dashboard" },
      { name: "Kasir", label: "Kasir", icon: ShoppingCartIcon, link: "/kasir" },
      { name: "Penjualan", label: "Penjualan", icon: BanknotesIcon, link: "/penjualan" },
      { name: "Stock", label: "Stock", icon: CubeIcon, link: "/stock" },
      { name: "Supplier", label: "Supplier", icon: StarIcon, link: "/supplier" }
    ];

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const setActiveMenu = (name) => {
      activeMenu.value = name;
    };

    onMounted(() => {
      const ctx = document.getElementById("chart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Sales ($)",
              data: [500, 700, 800, 550],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
      });
    });

    return { isSidebarOpen, toggleSidebar, activeMenu, setActiveMenu, menuItems, logo };
  },
};
</script>

<style scoped>
/* Sidebar */
</style>
