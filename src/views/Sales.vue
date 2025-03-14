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

      <!-- Top Row: Filters & Search -->
      <div class="flex justify-between items-center mb-4 flex-1 p-6">
        <div class="flex space-x-4">
          <select v-model="selectedFilter" class="border px-4 py-2 rounded">
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="progress">On Progress</option>
          </select>
          <select v-model="selectedDate" class="border px-4 py-2 rounded">
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search" class="border px-4 py-2 rounded w-64">
          <span class="absolute right-3 top-2 text-gray-400">
            🔍
          </span>
        </div>
      </div>
  
      <!-- Total Revenue -->
      <div class="text-right mb-4 text-lg font-semibold">
        Total Pendapatan : Rp{{ totalRevenue.toLocaleString() }}
      </div>
  
      <!-- Transaction Table -->
      <div class="bg-white rounded-lg shadow-lg p-4">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b">
              <th class="py-2 px-4 text-left">ID</th>
              <th class="py-2 px-4 text-left">Date</th>
              <th class="py-2 px-4 text-left">Time</th>
              <th class="py-2 px-4 text-left">Status</th>
              <th class="py-2 px-4 text-left">Amount</th>
              <th class="py-2 px-4 text-left">Payment</th>
              <th class="py-2 px-4 text-left">Distribution</th>
              <th class="py-2 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="border-b">
              <td class="py-2 px-4">{{ transaction.id }}</td>
              <td class="py-2 px-4">{{ transaction.date }}</td>
              <td class="py-2 px-4">{{ transaction.time }}</td>
              <td class="py-2 px-4">
                <span 
                  class="px-3 py-1 text-sm rounded font-semibold"
                  :class="{
                    'bg-green-500 text-white': transaction.status === 'Done',
                    'bg-yellow-400 text-white': transaction.status === 'On Progress'
                  }"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td class="py-2 px-4">{{ transaction.amount }} LKR</td>
              <td class="py-2 px-4">{{ transaction.payment }}</td>
              <td class="py-2 px-4">{{ transaction.distribution }}</td>
              <td class="py-2 px-4 flex space-x-2 justify-center">
                <button @click="editTransaction(transaction.id)" class="text-blue-500 hover:text-blue-700">
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button @click="deleteTransaction(transaction.id)" class="text-red-500 hover:text-red-700">
                  <TrashIcon class="w-5 h-5" />
                </button>
                <button @click="viewTransaction(transaction.id)" class="text-gray-500 hover:text-gray-700">
                  <EyeIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import logoImage from "@/assets/image.png";

  import { PencilIcon, TrashIcon, EyeIcon, HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid"; // Import Heroicons
  
  export default {
    name: "TransactionsPage",
    components: {
      PencilIcon,
      TrashIcon,
      EyeIcon,
    },
    setup() {
      const selectedFilter = ref("all");
      const selectedDate = ref("today");
      const searchQuery = ref("");
      const isSidebarOpen = ref(false);
    const activeMenu = ref("Sales"); // Default selected menu
    const logo = logoImage;

    const menuItems = [
      { name: "Dashboard", label: "Dashboard", icon: HomeIcon, link: "/dashboard" },
      { name: "Kasir", label: "Kasir", icon: ShoppingCartIcon, link: "/kasir" },
      { name: "Penjualan", label: "Penjualan", icon: BanknotesIcon, link: "/penjualan" },
      { name: "Stock", label: "Stock", icon: CubeIcon, link: "/stok" },
      { name: "Supplier", label: "Supplier", icon: StarIcon, link: "/supplier" }
    ];

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const setActiveMenu = (name) => {
      activeMenu.value = name;
    };

  
      const transactions = ref([
        { id: "CO-001", date: "13-11-2023", time: "10:45:12", status: "Done", amount: 1500, payment: "Cash", distribution: "NFZ" },
        { id: "CO-002", date: "13-11-2023", time: "10:45:12", status: "On Progress", amount: 1500, payment: "Qr", distribution: "NFZ" },
        { id: "CO-003", date: "13-11-2023", time: "10:45:12", status: "On Progress", amount: 1500, payment: "Qr", distribution: "NFZ" },
        { id: "CO-004", date: "13-11-2023", time: "10:45:12", status: "On Progress", amount: 1500, payment: "Qr", distribution: "NFZ" },
      ]);
  
      const totalRevenue = computed(() => {
        return transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);
      });
  
      const filteredTransactions = computed(() => {
        return transactions.value.filter((transaction) => {
          const matchesFilter = selectedFilter.value === "all" || transaction.status === (selectedFilter.value === "done" ? "Done" : "On Progress");
          const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.value.toLowerCase());
          return matchesFilter && matchesSearch;
        });
      });
  
      const editTransaction = (id) => {
        alert(`Edit transaction: ${id}`);
      };
  
      const deleteTransaction = (id) => {
        if (confirm(`Are you sure you want to delete transaction ${id}?`)) {
          transactions.value = transactions.value.filter(transaction => transaction.id !== id);
        }
      };
  
      const viewTransaction = (id) => {
        alert(`View transaction: ${id}`);
      };
  
      return {
        selectedFilter,
        selectedDate,
        searchQuery,
        transactions,
        filteredTransactions,
        totalRevenue,
        editTransaction,
        deleteTransaction,
        viewTransaction,
        isSidebarOpen, 
        toggleSidebar, 
        activeMenu, 
        setActiveMenu, 
        menuItems,
        logo
      };
    }
  };
  </script>
  
  