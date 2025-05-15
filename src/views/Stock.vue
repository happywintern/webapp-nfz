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
                <td class="py-2 px-4">Rp{{ product.buyPrice }}</td>
                <td class="py-2 px-4">Rp{{ product.sellPrice }}</td>
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
      </div>
      <!-- Add Product Modal -->

      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Edit Supplier</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold">ID</label>
            <input type="text" v-model="product.name" disabled class="w-full px-4 py-2 border rounded bg-gray-100" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Name</label>
            <input type="text" v-model="product.category " class="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Email</label>
            <input type="email" v-model="editedSupplier.email" class="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Contact</label>
            <input type="text" v-model="editedSupplier.contact" class="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button @click="saveSupplierEdit" class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800">Simpan</button>
        </div>
      </div>
    </div>

    
    <!-- Modal Tambah Product -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Tambah Produk</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold">Nama</label>
            <input type="text" v-model="newProduct.name" class="w-full px-4 py-2 border rounded" />
          </div>

          <div>
          <label class="block text-sm font-semibold">Kategori</label>
          <select v-model="newProduct.category" class="w-full px-4 py-2 border rounded">
            <option disabled value="">Pilih Kategori</option>
            <option value="daging">Daging</option>
            <option value="sayur">Sayur</option>
            <option value="minuman">Minuman</option>
          </select>
        </div>

          <div>
            <label class="block text-sm font-semibold">Harga</label>
            <input type="text" v-model="newProduct.sellPrice" class="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div>
            <label class="block text-sm font-semibold mt-7">Gambar</label>
            <input type="file" @change="handleImageUpload" class="w-full py-2" />
          </div>
        <div class="mt-6 flex justify-end space-x-2">
          <button @click="showAddModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button @click="addProduct" class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800">Tambah</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
    <h2 class="text-lg font-semibold text-red-600">Konfirmasi Hapus</h2>
    <p class="mt-2">Apakah kamu yakin ingin menghapus produk ini?</p>
    <div class="mt-4 flex justify-end space-x-2">
      <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
      <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Hapus</button>
    </div>
  </div>
</div>



  
  </AppLayout>

  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import logoImage from "@/assets/image.png";
  import { HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";
  import AppLayout from "@/components/Layout.vue";
  import { useRouter } from "vue-router";
  import axios from 'axios';



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
      return (products.value || []).filter(product => {
        const name = product.name ?? '';
        const category = product.category ?? '';
        const search = searchQuery.value ?? '';
        const selected = selectedCategory.value ?? 'all';

        const matchesCategory = selected === "all" || category === selected;
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
      });
    });

  
    const viewProduct = (id) => {
  if (!id) {
    console.error("Product ID is undefined!");
    return;
  }
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

      const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newProduct.value.image = file; // This must be a File object
  }
};


const addProduct = async () => {
  try {
    const token = localStorage.getItem('token'); // Bearer token for authentication
    const formData = new FormData();

    // Append required fields
    formData.append('product_name', newProduct.value.name);
    formData.append('description', newProduct.value.category);
    formData.append('price', parseFloat(newProduct.value.sellPrice));
    formData.append('status', 'active'); // Always active by default

    // Append image if provided
    if (newProduct.value.image) {
      formData.append('image', newProduct.value.image); // Must be a File object
    }

    const response = await axios.post('https://nurulfrozen.dgeo.id/api/products', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Product successfully added:', response.data);

    // Update product list or UI state
    products.value.push({
      ...newProduct.value,
      id: response.data.data.product_id,
      image: response.data.data.image,
    });

    // Reset form
    showAddModal.value = false;
    newProduct.value = {
      name: '',
      category: '',
      stock: 0,
      buyPrice: 0,
      sellPrice: 0,
      image: null,
    };
  } catch (error) {
    console.error('❌ Error adding product:', error.response?.data || error.message);
  }
};



onMounted(() => {
  fetchProducts();
});


const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (!token) {
      alert('No token found, please login first.');
      this.$router.push('/'); 
      return;
    }
    const fetchProducts = async () => {
  try {
    const response = await axios.get("https://nurulfrozen.dgeo.id/api/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Full API response:", response);

    if (response.data && Array.isArray(response.data.data)) {
      const rawProducts = response.data.data;

      const transformed = rawProducts.map(product => {
        const fullImageUrl = product.image ? `https://nurulfrozen.dgeo.id${product.image}` : null;

        if (fullImageUrl) {
          const img = new Image();
          img.src = fullImageUrl;
          img.onload = () => console.log(`✅ Image loaded: ${fullImageUrl}`);
          img.onerror = () => console.warn(`❌ Failed to load image: ${fullImageUrl}`);
        } else {
          console.warn(`⚠️ No image provided for product ID ${product.id}`);
        }

        return {
          id: product.product_id,
          name: product.product_name,
          image: fullImageUrl,
          category: product.description,
          stock: product.available_stock,
          buyPrice: product.inventory_entries?.[0]?.purchase_price ?? 0,
          sellPrice: product.price,
        };
      });

      products.value = transformed;
    } else {
      console.warn("Unexpected response structure:", response.data);
      products.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
    products.value = [];
  }
};

const showDeleteModal = ref(false)
const selectedProductId = ref(null)


function openDeleteModal(id) {
  console.log("🧪 openDeleteModal called with ID:", id)

  selectedProductId.value = id
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedProductId.value = null
}

async function confirmDelete() {
  const token = localStorage.getItem('token');

  try {
    console.log("🗑️ Deleting product with ID:", selectedProductId.value);

    const response = await axios.delete(`https://nurulfrozen.dgeo.id/api/products/${selectedProductId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    console.log("✅ Product deleted successfully:", response.data);
    // Optionally refresh the product list here
  } catch (error) {
    console.error("❌ Failed to delete product:", error.response?.data || error);
  }

  closeDeleteModal();
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
        showDeleteModal,
        closeDeleteModal,
      selectedProductId: null
      };
    }
  };
  </script>
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>  
  