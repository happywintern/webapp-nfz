<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
      <!-- Search Input -->
      <!-- Search Input -->
      <div class="relative mb-4 w-1/6">
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        <input
          type="text"
          placeholder="Search"
          class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
        />
      </div>       <!-- Stock Table -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="text-left">
            <tr class="text-gray-700">
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Product Name</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Image</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Category</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Stock</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Buy Price</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Sell Price</th>
              <th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Action</th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr v-for="product in filteredProducts" :key="product.id" class="border-b">
                <td class="py-2 px-4">{{ product.name }}</td>
                <td class="py-2 px-4">
                  <img :src="product.image" alt="Product Image" class="w-16 h-16">
                </td>
                <td class="py-2 px-4">{{ product.category }}</td>
                <td class="py-2 px-4">{{ product.stock }}</td>
                <td class="py-2 px-4">Rp{{ product.buyPrice.toLocaleString() }}</td>
                <td class="py-2 px-4">Rp{{ product.sellPrice.toLocaleString() }}</td>
                <td class="py-2 px-6 flex space-x-2 justify-center">
                  <button @click="editProduct(product.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="deleteProduct(product.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click="viewProduct(product.id)" class="text-gray-600 hover:text-blue-600">
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
  </AppLayout>

  </template>
  
  <script>
  import { ref, computed } from "vue";
  import logoImage from "@/assets/image.png";
  import { EyeIcon, HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";
  import AppLayout from "@/components/Layout.vue";

  export default {
    name: "StockPage",
    components: {
      EyeIcon,
      AppLayout
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
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>  
  