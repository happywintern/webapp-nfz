<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">

      <div class="flex justify-between items-center mb-4">
    <!-- Left side: Filter Button -->
    <select class="border border-[#1A327B] text-black font-semibold px-3 py-2 rounded-lg w-40">
      <option>Daging</option>
              <option>Sayur</option>
              <option>Minuman</option>
    </select>

    <!-- Right side: Add Button and Search Bar -->
    <div class="flex items-center space-x-2">
      <!-- Add Button -->
      <button  @click="showAddModal = true" class="add-btn flex items-center justify-center w-10 h-10 text-white rounded-lg">
        <img src="@/assets/icons/add_button.svg" alt="Add" class="w-5 h-5" />
      </button>

      <!-- Search Input -->
      <div class="relative w-1/6">
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        <input
          type="text"
          placeholder="Search"
          class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-40"
        />
      </div>
    </div>
  </div>


      <!-- Stock Table -->
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
                <td class="py-2 px-6 flex space-x-2 justify-center py-2">
                  <button @click="viewProduct(product.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-folder-open"></i>
                  </button>
                  <button @click="openDeleteModal(product.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-trash"></i>
                  </button>


                                  </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Delete Confirmation Modal -->
<div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-lg p-6 w-80">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Hapus</h2>
    <p class="text-gray-600 mb-6">Apakah kamu yakin ingin menghapus item ini?</p>
    <div class="flex justify-end gap-2">
      <button @click="closeDeleteModal" class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded">
        Batal
      </button>
      <button @click="confirmDelete" class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded">
        Hapus
      </button>
    </div>
  </div>
</div>

      </div>
      <!-- Add Product Modal -->
<div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-lg w-[400px]">
    <h2 class="text-xl font-bold text-[#1A327B] mb-4">Tambah Produk</h2>
    
    <div class="space-y-3">
      <input v-model="newProduct.name" type="text" placeholder="Nama Produk" class="w-full border rounded px-3 py-2" />
      <input v-model="newProduct.category" type="text" placeholder="Kategori" class="w-full border rounded px-3 py-2" />
      <input v-model="newProduct.stock" type="number" placeholder="Stok" class="w-full border rounded px-3 py-2" />
      <input v-model="newProduct.buyPrice" type="number" placeholder="Harga Beli" class="w-full border rounded px-3 py-2" />
      <input v-model="newProduct.sellPrice" type="number" placeholder="Harga Jual" class="w-full border rounded px-3 py-2" />
      <input type="file" @change="handleImageUpload" class="w-full" />
    </div>

    <div class="flex justify-end mt-4 space-x-2">
      <button @click="showAddModal = false" class="px-4 py-2 bg-gray-300 text-black rounded">Batal</button>
      <button @click="addProduct" class="px-4 py-2 bg-[#1A327B] text-white rounded">Simpan</button>
    </div>
  </div>
</div>


  
  </AppLayout>

  </template>
  
  <script>
  import { ref, computed } from "vue";
  import logoImage from "@/assets/image.png";
  import { HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";
  import AppLayout from "@/components/Layout.vue";
  import { useRouter } from "vue-router";


  export default {
    name: "StockPage",
    components: {
      AppLayout
    },
    setup() {

      const router = useRouter();

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
        { id: 1, name: "Nuget Kanzler", category: "Frozen Food", stock: 20, buyPrice: 20000, sellPrice: 25000, image: require('@/assets/Product.jpeg')},
        { id: 1, name: "Nuget Kanzler", category: "Frozen Food", stock: 20, buyPrice: 20000, sellPrice: 25000, image: require('@/assets/Product.jpeg')},
        { id: 1, name: "Nuget Kanzler", category: "Frozen Food", stock: 20, buyPrice: 20000, sellPrice: 25000, image: require('@/assets/Product.jpeg')},
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
  
      const viewProduct = (id) => {
      router.push({ name: 'ViewProduct', params: { id: id.toString() } });
    };
  
      

      const showAddModal = ref(false);

      const newProduct = ref({
        name: '',
        category: '',
        stock: 0,
        buyPrice: 0,
        sellPrice: 0,
        image: null
      });

      const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        newProduct.value.image = URL.createObjectURL(file);
      }
    };

    const addProduct = () => {
      const id = products.value.length + 1;
      products.value.push({ id, ...newProduct.value });
      showAddModal.value = false;
      newProduct.value = {
        name: '',
        category: '',
        stock: 0,
        buyPrice: 0,
        sellPrice: 0,
        image: null
      };
    };

    const showDeleteModal = ref(false)
const selectedProductId = ref(null)

function openDeleteModal(id) {
  selectedProductId.value = id
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedProductId.value = null
}

function confirmDelete() {
  // Your delete logic here
  console.log("Deleting product with ID:", selectedProductId.value)
  // Example: await axios.delete(`/api/products/${selectedProductId.value}`)
  closeDeleteModal()
}

  

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
        viewProduct,
        toggleSidebar,
        setActiveMenu,
        showAddModal,
        newProduct,
        handleImageUpload,
        addProduct,
        openDeleteModal,
        confirmDelete,
        showDeleteModal: false,
      selectedProductId: null
      };
    }
  };
  </script>
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>  
  