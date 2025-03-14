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

      <div class="flex-1 p-6">
        <div class="bg-white rounded-lg shadow-lg p-4">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b">
                <th class="py-2 px-4 text-left">ID</th>
                <th class="py-2 px-4 text-left">Name</th>
                <th class="py-2 px-4 text-left">Email</th>
                <th class="py-2 px-4 text-left">Contact</th>
                <th class="py-2 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="supplier in suppliers" :key="supplier.id" class="border-b">
                <td class="py-2 px-4">{{ supplier.id }}</td>
                <td class="py-2 px-4">{{ supplier.name }}</td>
                <td class="py-2 px-4">{{ supplier.email }}</td>
                <td class="py-2 px-4">{{ supplier.contact }}</td>
                <td class="py-2 px-4 flex space-x-2 justify-center">
                  <button @click="editSupplier(supplier.id)" class="text-blue-500 hover:text-blue-700">Edit</button>
                  <button @click="deleteSupplier(supplier.id)" class="text-red-500 hover:text-red-700">Delete</button>
                  <button @click="viewSupplier(supplier.id)" class="text-gray-500 hover:text-gray-700">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import logoImage from "@/assets/image.png";
  import { PencilIcon, TrashIcon, EyeIcon, HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";

  
  export default {
    name: "SupplierPage",
    components: {
      PencilIcon,
      TrashIcon,
      EyeIcon,
    },
    setup() {
        const isSidebarOpen = ref(false);
      const activeMenu = ref("Supplier");
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

  
      const selectedCategory = ref("all");
      const searchQuery = ref("");
  

      const suppliers = ref([
        { id: 1, name: "Supplier A", email: "suppliera@example.com", contact: "123-456-7890" },
        { id: 2, name: "Supplier B", email: "supplierb@example.com", contact: "987-654-3210" },
        { id: 3, name: "Supplier C", email: "supplierc@example.com", contact: "555-666-7777" },
      ]);
  
      const editSupplier = (id) => {
        alert(`Edit supplier: ${id}`);
      };
  
      const deleteSupplier = (id) => {
        if (confirm(`Are you sure you want to delete supplier ${id}?`)) {
          suppliers.value = suppliers.value.filter(supplier => supplier.id !== id);
        }
      };
  
      const viewSupplier = (id) => {
        alert(`View supplier: ${id}`);
      };
  
      return {
        isSidebarOpen,
        activeMenu,
        menuItems,
        selectedCategory,
        searchQuery,
        logo,
        suppliers,
        editSupplier,
        deleteSupplier,
        viewSupplier,
        toggleSidebar,
        setActiveMenu
      };
    },
  };
  </script>