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
                  <button @click="editStock(item)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="deleteStock(item)" class="text-gray-600 hover:text-blue-600">
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

  </AppLayout>
</template>

  <script>

  import AppLayout from "@/components/Layout.vue";

  export default {
    name: "EditPage",
    components: {
      AppLayout
    },
    props: {

      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
    showEditModal: false,
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
      image: ''
    },
    stockData: []
  };

    },
    created() {
      // Fetch the product data when the component is created
      this.fetchProductData();
    },
    methods: {
      fetchProductData() {
        // Here you would typically make an API call to get the product data
        // For example:
        // axios.get(`/api/products/${this.id}`)
        //   .then(response => {
        //     this.product = response.data.product;
        //     this.stockData = response.data.stockData;
        //   })
        //   .catch(error => {
        //     console.error('Error fetching product data:', error);
        //   });
        
        // For now, we'll just simulate this with mock data
        this.product = {
          name: 'Sample Product',
          category: 'Daging',
          buyPrice: 'Rp 50.000',
          sellPrice: 'Rp 75.000',
          image: 'https://via.placeholder.com/400'
        };
        
        this.stockData = [
          { tanggalMasuk: '13-11-2023', stok: 20, tanggalKadaluarsa: '13-11-2023' },
          { tanggalMasuk: '14-11-2023', stok: 15, tanggalKadaluarsa: '14-11-2023' }
        ];
      },
      updateProduct() {
        // Show modal and copy product data to edit form
    this.editedProduct = { ...this.product };
    this.showEditModal = true;
      },
      editStock(item) {
        // Handle editing stock item
        console.log('Editing stock item:', item);
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
  