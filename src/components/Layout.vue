<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Fixed Sidebar -->
    <div
      class="fixed left-0 top-0 h-screen bg-white shadow-lg border-r transition-all duration-300 ease-in-out flex flex-col z-10"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <!-- Menu Items -->
      <ul class="mt-4 space-y-1 flex-grow overflow-y-auto">
        <li v-for="item in filteredMenuItems" :key="item.name">
          <router-link
            :to="item.link"
            class="block transition-colors duration-200 mx-2 rounded-xl relative"
            :class="{
              'bg-[#112D7C] text-white': activeMenu === item.name,
              'hover:bg-gray-100 text-[#6E6A7C]': activeMenu !== item.name && isMenuItemAccessible(item),
              'opacity-50 cursor-not-allowed': !isMenuItemAccessible(item)
            }"
            @click.prevent="handleMenuClick(item)"
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
              <!-- Lock icon for inaccessible menu items -->
              <i v-if="!isMenuItemAccessible(item) && isSidebarOpen" class="fas fa-lock text-gray-400 ml-auto"></i>
            </div>
          </router-link>
        </li>
      </ul>

      <!-- Logout Button at Bottom -->
      <div class="p-4 border-t">
        <button
          @click="logout"
          class="flex items-center space-x-3 py-3 px-4 rounded-xl transition-colors duration-200
                 text-[#6E6A7C] hover:bg-red-100 hover:text-red-600 w-full text-left"
        >
          <ArrowLeftOnRectangleIcon class="w-5 h-5" />
          <transition name="fade">
            <span v-if="isSidebarOpen">Keluar</span>
          </transition>
        </button>
      </div>
    </div>

    <!-- Main Content with margin to account for fixed sidebar -->
    <div class="flex flex-col flex-grow min-h-screen" :class="isSidebarOpen ? 'ml-64' : 'ml-20'">
      <!-- Fixed Topbar -->
      <nav class="fixed top-0 right-0 bg-white shadow-sm py-4 px-6 flex items-center justify-between z-10"
           :class="isSidebarOpen ? 'left-64' : 'left-20'">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="text-gray-700 hover:text-gray-900 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="text-3xl font-extrabold text-[#112D7C] ml-4">NFZ</span>
        </div>
        <div class="text-gray-700 font-semibold">
          {{ username }}
        </div>
      </nav>

      <!-- Main Content Area with padding for fixed navbar -->
      <div class="flex flex-col flex-grow">
        <main class="flex-grow p-6 mt-16">
          <slot></slot>
        </main>

        <!-- Footer -->
        <footer class="bg-[#112D7C] text-white py-2 px-6 text-center text-sm mt-auto">
          Copyright © 2025. Produced by MenujuA
        </footer>
      </div>
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
  components: {
    ArrowLeftOnRectangleIcon
  },
  setup() {
    const isSidebarOpen = ref(true);
    const route = useRoute();
    const router = useRouter();
    const activeMenu = computed(() => route.name);
    const logo = logoImage;
    const userRole = ref(localStorage.getItem('role')?.toLowerCase() || '');

    const menuItems = [
      { name: "Dashboard", label: "Beranda", icon: HomeIcon, link: "/dashboard", roles: ['admin'] },
      { name: "Kasir", label: "Kasir", icon: ShoppingCartIcon, link: "/kasir", roles: ['admin', 'cashier'] },
      { name: "Penjualan", label: "Penjualan", icon: BanknotesIcon, link: "/penjualan", roles: ['admin'] },
      { name: "Stock", label: "Persediaan", icon: CubeIcon, link: "/stock", roles: ['admin'] },
      { name: "Supplier", label: "Pemasok", icon: StarIcon, link: "/supplier", roles: ['admin'] },
      { name: "Staff", label: "Pegawai", icon: UserGroupIcon, link: "/staff", roles: ['admin'] }
    ];

    const filteredMenuItems = computed(() => {
      return menuItems;
    });

    const isMenuItemAccessible = (item) => {
      return item.roles.includes(userRole.value);
    };

    const handleMenuClick = (item) => {
      if (isMenuItemAccessible(item)) {
        router.push(item.link);
      }
    };

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
      filteredMenuItems,
      logo,
      logout,
      username,
      isMenuItemAccessible,
      handleMenuClick
    };
  },
};
</script>

<style scoped>
@import '@/assets/css/hide-scrollbar.css';

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-leave-from, .fade-enter-to {
  opacity: 1;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
