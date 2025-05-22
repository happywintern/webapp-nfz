<template>
  <div class="min-h-screen bg-gray-100 flex">

    <div
      class="bg-white min-h-screen shadow-lg border-r transition-all duration-300 ease-in-out flex flex-col justify-between"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <ul class="mt-4 space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <button
            v-if="item.logout"
            @click="logout"
            class="flex items-center space-x-3 py-3 px-4 mx-2 rounded-xl transition-colors duration-200
                   text-[#6E6A7C] hover:bg-red-100 hover:text-red-600 w-5/6 text-left"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <transition name="fade">
              <span v-if="isSidebarOpen">{{ item.label }}</span>
            </transition>
          </button>

          <router-link
            v-else
            :to="item.link"
            class="block transition-colors duration-200 mx-2 rounded-xl"
            :class="{
              'bg-[#112D7C] text-white': activeMenu === item.name,
              'hover:bg-gray-100 text-[#6E6A7C]': activeMenu !== item.name
            }"
          >
            <div class="flex items-center space-x-3 py-3 px-4">
              <component
                :is="item.icon"
                class="w-5 h-5"
                :class="activeMenu === item.name ? 'text-white' : 'text-[#6E6A7C]'"
              />
              <transition name="fade">
                <span v-if="isSidebarOpen">{{ item.label }}</span>
              </transition>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-full">
      <!-- Topbar -->
      <nav class="bg-white shadow-sm py-4 px-6 flex items-center justify-between mb-2">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="text-gray-700 hover:text-gray-900 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img :src="logo" alt="Logo" :class="[isSidebarOpen ? 'h-10 ml-4' : 'h-10 ml-2']">
        </div>
        <div class="text-gray-700 font-semibold">
          {{ username }}
        </div>
      </nav>

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
      { name: "Logout",     label: "Keluar",     icon: ArrowLeftOnRectangleIcon, logout: true }
    ];

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const logout = () => {
      localStorage.clear();
      router.replace({ path: "/" }).then(() => {
        location.reload();
      });
    };

    const username = ref(localStorage.getItem('username') || '');

    return {
      isSidebarOpen,
      toggleSidebar,
      activeMenu,
      menuItems,
      logo,
      logout,
      username
    };
  },
};
</script>

<style scoped>
@import '@/assets/css/hide-scrollbar.css';

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
