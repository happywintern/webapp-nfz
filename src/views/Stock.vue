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

      <!-- Main Content -->
      <div class="flex-1 p-6">
        <!-- Top Filters and Search -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-4">
            <select v-model="selectedCategory" class="border px-4 py-2 rounded">
              <option value="all">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search product..." class="border px-4 py-2 rounded w-64">
            <span class="absolute right-3 top-2 text-gray-400">🔍</span>
          </div>
        </div>
  
        <!-- Stock Table -->
        <div class="bg-white rounded-lg shadow-lg p-4">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b">
                <th class="py-2 px-4 text-left">Product Name</th>
                <th class="py-2 px-4 text-left">Image</th>
                <th class="py-2 px-4 text-left">Category</th>
                <th class="py-2 px-4 text-left">Stock</th>
                <th class="py-2 px-4 text-left">Buy Price</th>
                <th class="py-2 px-4 text-left">Sell Price</th>
                <th class="py-2 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id" class="border-b">
                <td class="py-2 px-4">{{ product.name }}</td>
                <td class="py-2 px-4">
                  <img :src="product.image" alt="Product Image" class="w-16 h-16">
                </td>
                <td class="py-2 px-4">{{ product.category }}</td>
                <td class="py-2 px-4">{{ product.stock }}</td>
                <td class="py-2 px-4">Rp{{ product.buyPrice.toLocaleString() }}</td>
                <td class="py-2 px-4">Rp{{ product.sellPrice.toLocaleString() }}</td>
                <td class="py-2 px-4 flex space-x-2 justify-center">
                  <button @click="editProduct(product.id)" class="text-blue-500 hover:text-blue-700">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button @click="deleteProduct(product.id)" class="text-red-500 hover:text-red-700">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                  <button @click="viewProduct(product.id)" class="text-gray-500 hover:text-gray-700">
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import logoImage from "@/assets/image.png";
  import { PencilIcon, TrashIcon, EyeIcon, HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";
  
  export default {
    name: "StockPage",
    components: {
      PencilIcon,
      TrashIcon,
      EyeIcon,
    },
    setup() {
      const isSidebarOpen = ref(false);
      const activeMenu = ref("Stock");
      
      const logo = logoImage;
  
      const menuItems = [
        { name: "Dashboard", label: "Dashboard", icon: HomeIcon, link: "/dashboard" },
        { name: "Kasir", label: "Kasir", icon: ShoppingCartIcon, link: "/kasir" },
        { name: "Penjualan", label: "Penjualan", icon: BanknotesIcon, link: "/penjualan" },
        { name: "Stock", label: "Stock", icon: CubeIcon, link: "/stok" },
        { name: "Supplier", label: "Supplier", icon: StarIcon, link: "/supplier" }
      ];
  
      const selectedCategory = ref("all");
      const searchQuery = ref("");
  
      const products = ref([
        { id: 1, name: "Nuget Kanzler", category: "Frozen Food", stock: 20, buyPrice: 20000, sellPrice: 25000, image: "/images/nuget.png" },
        { id: 2, name: "Sosis Kanzler", category: "Frozen Food", stock: 30, buyPrice: 18000, sellPrice: 22000, image: "/images/sosis.png" },
        { id: 3, name: "Aqua 600ml", category: "Drinks", stock: 50, buyPrice: 5000, sellPrice: 7000, image: "/images/aqua.png" },
      ]);
  

      const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const setActiveMenu = (name) => {
      activeMenu.value = name;
    };

      const categories = computed(() => {
        const uniqueCategories = new Set(products.value.map(product => product.category));
        return Array.from(uniqueCategories);
      });
  
      const filteredProducts = computed(() => {
        return products.value.filter(product => {
          const matchesCategory = selectedCategory.value === "all" || product.category === selectedCategory.value;
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
          return matchesCategory && matchesSearch;
        });
      });
  
      const editProduct = (id) => {
        alert(`Edit product: ${id}`);
      };
  
      const deleteProduct = (id) => {
        if (confirm(`Are you sure you want to delete product ${id}?`)) {
          products.value = products.value.filter(product => product.id !== id);
        }
      };
  
      const viewProduct = (id) => {
        alert(`View product: ${id}`);
      };
  
      return {
        isSidebarOpen,
        activeMenu,
        logo,
        menuItems,
        selectedCategory,
        searchQuery,
        categories,
        products,
        filteredProducts,
        editProduct,
        deleteProduct,
        viewProduct,
        toggleSidebar,
        setActiveMenu
      };
    }
  };
  </script>
  
  