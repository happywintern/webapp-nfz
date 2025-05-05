<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <div
      class="bg-white w-64 min-h-screen shadow-lg border-r transition-all duration-300 ease-in-out flex flex-col justify-between"
      :class="{ 'w-20': !isSidebarOpen }"
    >
      <ul class="mt-4 space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          
          <!-- Jika ini item logout, render button khusus -->
          <button
            v-if="item.logout"
            @click="logout"
            class="flex items-center space-x-3 py-3 pl-6 pr-4 mx-3 rounded-xl transition-colors duration-200
                   text-[#6E6A7C] hover:bg-red-100 hover:text-red-600 w-5/6 text-left"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span v-if="isSidebarOpen">{{ item.label }}</span>
          </button>

          <!-- Selain itu, render router-link biasa -->
          <router-link
            v-else
            :to="item.link"
            class="block transition-colors duration-200 mx-3 rounded-xl"
            :class="{
              'bg-[#112D7C] text-white': activeMenu === item.name,
              'hover:bg-gray-100 text-[#6E6A7C]': activeMenu !== item.name
            }"
          >
            <div class="flex items-center space-x-3 py-3 pl-6 pr-4">
              <component
                :is="item.icon"
                class="w-5 h-5"
                :class="activeMenu === item.name ? 'text-white' : 'text-[#6E6A7C]'"
              />
              <span v-if="isSidebarOpen">{{ item.label }}</span>
            </div>
          </router-link>

        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-full">
      <!-- Topbar -->
      <nav class="bg-white shadow-md py-4 px-6 flex items-center justify-between mb-2">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="text-gray-700 hover:text-gray-900 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img :src="logo" alt="Logo" class="h-10 ml-4">
        </div>
      </nav>

      <!-- Page Content -->
      <main class="p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import logoImage from "@/assets/logo.png";
import {
  HomeIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CubeIcon,
  StarIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/solid";

export default {
  name: "AppLayout",
  setup() {
    const isSidebarOpen = ref(true);
    const route = useRoute();
    const router = useRouter();
    const activeMenu = computed(() => route.name);
    const logo = logoImage;

    const menuItems = [
      { name: "Dashboard", label: "Dashboard", icon: HomeIcon, link: "/dashboard" },
      { name: "Kasir",      label: "Kasir",      icon: ShoppingCartIcon, link: "/kasir" },
      { name: "Penjualan",  label: "Penjualan",  icon: BanknotesIcon,    link: "/penjualan" },
      { name: "Stock",      label: "Stock",      icon: CubeIcon,         link: "/stok" },
      { name: "Supplier",   label: "Supplier",   icon: StarIcon,         link: "/supplier" },
      { name: "Staff",      label: "Staff",      icon: UserGroupIcon,    link: "/staff" },
      // Logout item
      { name: "Logout",     label: "Keluar",     icon: ArrowLeftOnRectangleIcon, logout: true }
    ];

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const logout = () => {
  // Hapus semua data lokal
    localStorage.clear();

  // Redirect ke halaman login & reload
  router.replace({ path: "/" }).then(() => {
    location.reload();
  });
};

    
    return {
      isSidebarOpen,
      toggleSidebar,
      activeMenu,
      menuItems,
      logo,
      logout
    };
  },
};
</script>

<style scoped>
</style>
