<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Topbar -->
      <nav class="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="text-gray-700 hover:text-gray-900 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <img :src="logo" alt="Logo" class="h-10 ml-4">
        </div>
      </nav>
  
      <!-- Sidebar -->
      <div 
        :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
        class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 border-r"
      >
        <div class="p-6 flex items-center border-b">
          <img :src="logo" alt="Logo" class="h-8 mr-2">
          <span class="text-xl font-bold text-[#112D7C]">NFZ</span>
        </div>
  
        <ul class="mt-4 space-y-1">
          <li v-for="item in menuItems" :key="item.name">
            <router-link 
              :to="item.link" 
              class="block rounded-xl transition"
              :class="{
                'bg-[#112D7C] text-white mx-3': activeMenu === item.name,
                'hover:bg-gray-100 text-[#6E6A7C]': activeMenu !== item.name
              }"
            >


              <div class="flex items-center space-x-3 py-3 pl-6 pr-4">
                <component 
                  :is="item.icon" 
                  class="w-5 h-5" 
                  :class="activeMenu === item.name ? 'text-white' : 'text-[#6E6A7C]'"
                />
                <span class="font-normal">{{ item.label }}</span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
  
      <!-- Overlay -->
      <div 
        v-if="isSidebarOpen" 
        @click="toggleSidebar" 
        class="fixed top-0 left-64 w-[calc(100%-16rem)] h-full bg-black opacity-50 z-40"
      ></div>
  
      <!-- Page Content -->
      <main class="p-6">
        <slot></slot>
      </main>
    </div>
  </template>
  <script>
  import { ref, computed } from "vue";
  import { useRoute } from 'vue-router';
  import logoImage from "@/assets/image.png";
  import { 
    HomeIcon, 
    ShoppingCartIcon, 
    BanknotesIcon, 
    CubeIcon, 
    StarIcon, 
    UserGroupIcon 
  } from "@heroicons/vue/24/solid";
  
  export default {
    name: "AppLayout",
    setup() {
      const isSidebarOpen = ref(false);
      const route = useRoute();
      const activeMenu = computed(() => route.name);
      const logo = logoImage;
  
      const menuItems = [
        { name: "Dashboard", label: "Dashboard", icon: HomeIcon, link: "/dashboard" },
        { name: "Kasir", label: "Kasir", icon: ShoppingCartIcon, link: "/kasir" },
        { name: "Penjualan", label: "Penjualan", icon: BanknotesIcon, link: "/penjualan" },
        { name: "Stock", label: "Stock", icon: CubeIcon, link: "/stok" },
        { name: "Supplier", label: "Supplier", icon: StarIcon, link: "/supplier" },
        { name: "Staff", label: "Staff", icon: UserGroupIcon, link: "/staff" },
      ];
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      return { isSidebarOpen, toggleSidebar, activeMenu, menuItems, logo };
    },
  };
  </script>
  