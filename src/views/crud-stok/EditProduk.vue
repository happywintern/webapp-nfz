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
        product: {
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
        // Here you would typically make an API call to update the product
        // For example:
        // axios.put(`/api/products/${this.id}`, this.product)
        //   .then(response => {
        //     // Show success message
        //     alert('Product updated successfully!');
        //     // Return to stock page
        //     this.$router.push('/stock');
        //   })
        //   .catch(error => {
        //     console.error('Error updating product:', error);
        //   });
        
        // For now, we'll just simulate success
        alert('Product updated successfully!');
        this.$router.push('/stock');
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
  