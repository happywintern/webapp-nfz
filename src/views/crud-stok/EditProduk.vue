<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div class="container max-w-6xl mx-auto p-4 flex space-x-6">
        <!-- Left Container: Product Details -->
        <div class="w-2/5 bg-white p-8 rounded-2xl shadow-md">
          <h2 class="text-xl text-center font-semibold mb-6">Detail Produk</h2>
          <img
            :src="product.image"
            alt="Product Image"
            class="w-full h-48 object-cover mb-6 rounded-lg"
          />
          <div class="text-sm space-y-4 px-12">
            <p><strong>Nama       </strong>: {{ product.name }}</p>
            <p><strong>Kategori   </strong>: {{ product.category }}</p>
            <p><strong>Harga Beli </strong>: {{ product.buyPrice }}</p>
            <p><strong>Harga Jual </strong>: {{ product.sellPrice }}</p>
          </div>
          <div class="text-center mt-8">
            <button
            @click="updateProduct"
            class="bg-[#1A327B] text-white font-semibold py-2 px-5 rounded-full hover:bg-[#16296A] transition w-48"
          >
            Edit
    </button>
          </div>
        </div>

        <!-- Right Container: Stock Table -->
        <div class="w-3/5 bg-white p-6 rounded-2xl shadow-md">
          <h2 class="text-xl text-center font-semibold mb-4">Stok Produk</h2>

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">

          <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            placeholder="Search"
            class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
          />
        </div>

        <!-- Tambah Button -->
        <button
          @click="showAddStock = true"
          class="flex items-center gap-2 px-4 py-2 bg-[#1A327B] text-white rounded-lg hover:bg-blue-800 h-[42px]"
        >
        <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
        Tambah
        </button>
      </div>

          <table class="w-full text-sm">
          <thead class="text-left">
            <tr class="text-gray-700">
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Tanggal Masuk</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Stock</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Tanggal Kadaluwarsa</th>
              <th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Aksi</th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr
                v-for="(item, index) in stockData"
                :key="index"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-2 px-6">{{ item.tanggalMasuk }}</td>
                <td class="py-2 px-6">{{ item.stok }}</td>
                <td class="py-2 px-6">{{ item.tanggalKadaluarsa }}</td>
                <td class="py-2 px-6 flex space-x-2 justify-center">
                  <button @click="editStock(item.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="deleteStock(item.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for Editing Product -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-lg w-[400px]">
    <h2 class="text-xl font-bold text-[#1A327B] mb-4">Edit Produk</h2>
    
    <div class="space-y-3">
      <input v-model="editedProduct.name" type="text" placeholder="Nama Produk" class="w-full border rounded px-3 py-2" />
      <input v-model="editedProduct.category" type="text" placeholder="Kategori" class="w-full border rounded px-3 py-2" />
      <input v-model="editedProduct.buyPrice" type="number" placeholder="Stok" class="w-full border rounded px-3 py-2" />
      <input v-model="editedProduct.sellPrice" type="number" placeholder="Harga Beli" class="w-full border rounded px-3 py-2" />
      <input type="file" @change="handleImageUpload" class="w-full" />
    </div>

    <div class="flex justify-end mt-4 space-x-2">
      <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 text-black rounded">Batal</button>
      <button @click="saveProductUpdate" class="px-4 py-2 bg-[#1A327B] text-white rounded">Simpan</button>
    </div>
  </div>
</div>
<!-- <div
  v-if="showEditModal"
  class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-lg p-6 w-full max-w-md">
    <h2 class="text-xl font-semibold mb-4">Edit Produk</h2>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Nama</label>
      <input
        v-model="editedProduct.name"
        type="text"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Kategori</label>
      <input
        v-model="editedProduct.category"
        type="text"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Harga Beli</label>
      <input
        v-model="editedProduct.buyPrice"
        type="text"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Harga Jual</label>
      <input
        v-model="editedProduct.sellPrice"
        type="text"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Ganti Gambar</label>
      <input
        type="file"
        @change="handleImageUpload"
        class="w-full"
      />
    </div>

    <div class="flex justify-end space-x-3">
      <button
        @click="showEditModal = false"
        class="bg-gray-300 text-black px-4 py-2 rounded-lg"
      >
        Batal
      </button>
      <button
        @click="saveProductUpdate"
        class="bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Simpan
      </button>
    </div>
  </div>
</div> -->

<!-- Modal Tambah Stok -->
<div v-if="showAddStock" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Tambah Stok</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold">Tanggal Masuk</label>
        <input type="date" v-model="newStock.entryDate" class="w-full px-4 py-2 border rounded" />
      </div>

      <div>
        <label class="block text-sm font-semibold">Tanggal Kadaluarsa</label>
        <input type="date" v-model="newStock.expiredDate" class="w-full px-4 py-2 border rounded" />
      </div>

      <div>
        <label class="block text-sm font-semibold">Stok</label>
        <input type="number" v-model="newStock.quantity" class="w-full px-4 py-2 border rounded" />
      </div>

      <div>
        <label class="block text-sm font-semibold">Harga Beli</label>
        <input type="number" v-model.number="newStock.purchase_price" class="w-full px-4 py-2 border rounded" />
      </div>
    </div>

    <div class="mt-6 flex justify-end space-x-2">
      <button @click="showAddStock = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
      <button @click="addStock" class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800">Tambah</button>
    </div>
  </div>
</div>


  </AppLayout>
</template>
<script>
import AppLayout from "@/components/Layout.vue";
import axios from 'axios';

export default {
  name: "EditPage",
  components: {
    AppLayout
  },

  data() {
    return {
      showEditModal: false,
      showAddStock: false,
      product: {
        name: '',
        category: '',
        buyPrice: '',
        sellPrice: '',
        image: ''
      },
      editedProduct: {
  name: '',
  category: '',
  buyPrice: '',
  sellPrice: '',
  image: '',
  imageFile: null // <-- for uploaded image
},
      newStock: {
        entryDate: '',
        expiredDate: '',
        quantity: '',
        purchase_price: ''
      },
      stockData: [],
      products: [] // Added to prevent 'products is not defined' error
    };
  },

  created() {
    this.fetchProductData();
  },

  methods: {
    fetchProductData() {
      const productId = this.$route.params.id;
      const token = localStorage.getItem('token');

      console.log("🔍 Fetching product with ID:", productId);

      axios.get(`https://nurulfrozen.dgeo.id/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('✅ Product data fetched:', response.data);

        const data = response.data.data;
        const fullImageUrl = data.image ? `https://nurulfrozen.dgeo.id${data.image}` : null;

        if (fullImageUrl) {
          const img = new Image();
          img.src = fullImageUrl;
          img.onload = () => console.log(`✅ Image loaded: ${fullImageUrl}`);
          img.onerror = () => console.warn(`❌ Failed to load image: ${fullImageUrl}`);
        }

        this.product = {
          name: data.product_name,
          category: data.description,
          buyPrice: data.purchase_price || '-',
          sellPrice: data.price,
          image: fullImageUrl
        };

        this.stockData = (data.inventory_entries || []).map(entry => ({
          tanggalMasuk: new Date(entry.entry_date).toLocaleDateString(),
          stok: entry.quantity,
          tanggalKadaluarsa: new Date(entry.expired_date).toLocaleDateString(),
          id: entry.inventory_entry_id // For deleting specific stock
        }));
      })
      .catch(error => {
        console.error('❌ Error fetching product data:', error);
      });
    },

    updateProduct() {
      this.editedProduct = { ...this.product };
      this.showEditModal = true;
    },

    editStock(item) {
      console.log('Editing stock item:', item);
    },

    addStock() {
      const productId = this.$route.params.id;
      const token = localStorage.getItem('token');

      const payload = {
        quantity: this.newStock.quantity,
        entry_date: this.newStock.entryDate,
        expired_date: this.newStock.expiredDate,
        purchase_price: this.newStock.purchase_price
      };

      console.log("📦 Submitting new stock:", payload);

      axios.post(`https://nurulfrozen.dgeo.id/api/inventory-entries/product/${productId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      .then(response => {
        console.log("✅ Stock added successfully:", response.data);
        this.showAddStock = false;
        this.fetchProductData(); // Refresh stock list

        // Reset form
        this.newStock = {
          entryDate: '',
          expiredDate: '',
          quantity: '',
          purchase_price: ''
        };
      })
      .catch(error => {
        console.error("❌ Failed to add stock:", error.response?.data || error);
        alert("Gagal menambahkan stok. Pastikan semua data benar.");
      });
    },

    async saveProductUpdate() {
    const productId = this.$route.params.id;
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('product_name', this.editedProduct.name);
    formData.append('description', this.editedProduct.category);
    formData.append('price', this.editedProduct.sellPrice);
    formData.append('status', 'active'); // assuming default status is active

    if (this.editedProduct.imageFile) {
      formData.append('image', this.editedProduct.imageFile);
    }

    try {
      const response = await axios.post(
        `https://nurulfrozen.dgeo.id/api/products/${productId}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json'
          }
        }
      );

      console.log("✅ Product updated:", response.data);
      alert("Produk berhasil diperbarui!");
      this.showEditModal = false;
      this.fetchProductData(); // refresh display
    } catch (error) {
      console.error("❌ Gagal update produk:", error.response?.data || error);
      alert("Gagal memperbarui produk. Periksa input dan coba lagi.");
    }
  },

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.editedProduct.imageFile = file;
    }
  },



    async deleteStock(id) {
      const token = localStorage.getItem('token');
      if (!id) {
        console.warn("❌ No ID provided for deleteStock.");
        return;
      }

      try {
        console.log("🗑️ Attempting to delete stock with ID:", id);

        const response = await axios.delete(`https://nurulfrozen.dgeo.id/api/inventory-entries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        });

        console.log("✅ Stock item deleted:", response.data);

        // Remove from local stockData array
        this.stockData = this.stockData.filter(p => p.id !== id);

      } catch (error) {
        console.error("❌ Error deleting stock:", error.response?.data || error.message);
        alert("Gagal menghapus stok.");
      }
    }
  }
};
</script>

<style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  
  .container {
    max-width: 1200px;
  }
  
  h2 {
    font-size: 1.25rem;
  }
  
  table {
    border-collapse: collapse;
  }
  
  th, td {
    border-bottom: 1px solid #ddd;
  }
  </style>
  