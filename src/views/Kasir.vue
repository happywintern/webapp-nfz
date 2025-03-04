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
      <div class="flex-1 flex p-6">
        <!-- Left Side: Product List -->
        <div class="w-2/3 pr-4">
          <div class="flex items-center justify-between mb-4">
            <select class="border p-2 rounded">
              <option>Daging</option>
              <option>Sayur</option>
              <option>Minuman</option>
            </select>
            <input type="text" placeholder="Search" class="border p-2 rounded w-1/3">
          </div>
  
          <div class="grid grid-cols-3 gap-4">
            <div 
              v-for="product in products" :key="product.id"
              class="bg-white p-4 rounded-lg shadow-lg cursor-pointer"
              @click="addToCart(product)"
            >
              <img :src="product.image" alt="Product Image" class="w-full h-28 object-cover rounded">
              <h3 class="mt-2 font-semibold">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm">{{ product.weight }}</p>
              <p class="text-blue-600 font-bold">Rp{{ product.price }}</p>
            </div>
          </div>
        </div>
  
        <!-- Right Side: Shopping Cart -->
        <div class="w-1/3 bg-white p-4 rounded-lg shadow-lg">
          <h2 class="font-bold text-lg flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M3 8h18M3 13h18M3 18h18"></path>
            </svg>
            Order Menu
          </h2>
  
          <div v-if="cart.length === 0" class="text-gray-500 mt-4">Your cart is empty</div>
  
          <div v-for="(item, index) in cart" :key="index" class="flex items-center justify-between p-2 border-b">
            <div class="flex items-center">
              <img :src="item.image" alt="Product" class="w-12 h-12 rounded">
              <div class="ml-3">
                <h4 class="font-semibold">{{ item.name }}</h4>
                <p class="text-gray-500 text-sm">Rp{{ item.price }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <button @click="decreaseQty(index)" class="px-2 py-1 bg-gray-200 rounded">-</button>
              <span class="mx-2">{{ item.qty }}</span>
              <button @click="increaseQty(index)" class="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>
  
          <div class="flex justify-between items-center mt-6 border-t pt-4">
            <h3 class="font-bold text-lg">Rp{{ totalPrice }}</h3>
            <button class="bg-blue-700 text-white px-4 py-2 rounded">Bayar</button>
          </div>
        </div>
      </div>
      </div>
    
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import logoImage from "@/assets/image.png";
  import { HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";
  
  export default {
    name: "KasirPage",
    setup() {
      const isSidebarOpen = ref(false);
      const activeMenu = ref("Kasir");
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

  
      const products = ref([
        { id: 1, name: "Nuget Kanzler", weight: "450g", price: 25000, image: "/images/nuget.png" },
        { id: 2, name: "Nuget Kanzler", weight: "450g", price: 25000, image: "/images/nuget.png" },
        { id: 3, name: "Nuget Kanzler", weight: "450g", price: 25000, image: "/images/nuget.png" },
        // Add more products...
      ]);
  
      const cart = ref([]);
  
      const addToCart = (product) => {
        const existingItem = cart.value.find((item) => item.id === product.id);
        if (existingItem) {
          existingItem.qty++;
        } else {
          cart.value.push({ ...product, qty: 1 });
        }
      };
  
      const increaseQty = (index) => {
        cart.value[index].qty++;
      };
  
      const decreaseQty = (index) => {
        if (cart.value[index].qty > 1) {
          cart.value[index].qty--;
        } else {
          cart.value.splice(index, 1);
        }
      };
  
      const totalPrice = computed(() => {
        return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0);
      });
  
      return { isSidebarOpen, toggleSidebar, setActiveMenu, activeMenu, logo, products, cart, addToCart, increaseQty, decreaseQty, totalPrice, menuItems };
    },
  };
  </script>
  
  