<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen relative">
      <!-- Overlay Loading -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-white bg-opacity-60 flex flex-col items-center justify-center z-50"
      >
        <img :src="logo" alt="Logo" class="w-16 h-16 animate-pulse mb-4" />
        <p class="text-[#1A327B] font-semibold">Memuat data transaksi...</p>
      </div>

      <!-- Search Input -->
      <div class="relative mb-4 w-1/6">
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
        />
      </div>

      <!-- Table Container -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="text-left">
            <tr class="text-gray-700">
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">ID</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Date</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Time</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Status</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Amount</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Payment</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Distribution</th>
              <th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Action</th>
            </tr>
          </thead>
          <tbody class="text-gray-800">
            <tr
              v-for="transaction in filteredTransactions"
              :key="transaction.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-2 px-4">{{ transaction.id }}</td>
              <td class="py-2 px-4">{{ transaction.date }}</td>
              <td class="py-2 px-4">{{ transaction.time }}</td>
              <td class="py-2 px-4">
                <span 
                  class="status-label"
                  :class="{
                    'done': transaction.status === 'Done',
                    'on-progress': transaction.status === 'On Progress'
                  }"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td class="py-2 px-4">{{ transaction.amount }} LKR</td>
              <td class="py-2 px-4">{{ transaction.payment }}</td>
              <td class="py-2 px-4">{{ transaction.distribution }}</td>
              <td class="py-4 px-6">
                <div class="flex justify-center items-center space-x-4">
                  <button @click="showReceipt(transaction)" class="text-gray-600 hover:text-indigo-600">
                    <i class="fas fa-receipt"></i>
                  </button>
                  <button @click="deleteTransaction(transaction.id)" class="text-gray-600 hover:text-red-600">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Struk -->
      <div v-if="showReceiptModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-[350px] shadow-xl text-sm relative max-h-[90vh] overflow-y-auto border border-gray-300">
          <button @click="closeReceipt" class="absolute top-2 right-2 text-gray-500 hover:text-red-500">
            <i class="fas fa-times"></i>
          </button>

          <div class="text-center">
            <h2 class="font-bold text-[#1A327B] text-md">CO - 001</h2>
            <p class="font-semibold text-[#1A327B] text-md">Staff : {{ selectedReceipt.staff || 'Lina' }}</p>
            <p class="text-xs text-gray-600">{{ selectedReceipt.date }} &nbsp; {{ selectedReceipt.time }}</p>
          </div>

          <div class="mt-4 border-t border-b border-gray-300 py-2">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="text-gray-800 border-b border-gray-300">
                  <th class="py-1">Nama Barang</th>
                  <th class="py-1 text-center">Jumlah</th>
                  <th class="py-1 text-right">Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedReceipt.items" :key="index" class="border-b border-gray-200">
                  <td class="py-1">{{ item.name }}</td>
                  <td class="py-1 text-center">{{ item.quantity }}</td>
                  <td class="py-1 text-right">{{ (item.price * item.quantity).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 space-y-1 text-sm text-gray-800 font-semibold">
            <div class="flex justify-between">
              <span>Total</span>
              <span>{{ selectedReceipt.amount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tunai</span>
              <span>{{ selectedReceipt.amount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span>Kembali</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import logoImage from "@/assets/image.png";
import AppLayout from "@/components/Layout.vue";
import { HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";

export default {
  name: "SalesPage",
  components: {
    AppLayout,
  },
  setup() {
    const selectedFilter = ref("all");
    const selectedDate = ref("today");
    const searchQuery = ref("");
    const isSidebarOpen = ref(false);
    const activeMenu = ref("Sales");
    const logo = logoImage;

    const menuItems = [
      { name: "Dashboard", label: "Dashboard", icon: HomeIcon, link: "/dashboard" },
      { name: "Kasir", label: "Kasir", icon: ShoppingCartIcon, link: "/kasir" },
      { name: "Penjualan", label: "Penjualan", icon: BanknotesIcon, link: "/penjualan" },
      { name: "Stock", label: "Stock", icon: CubeIcon, link: "/stok" },
      { name: "Supplier", label: "Supplier", icon: StarIcon, link: "/supplier" }
    ];

    const transactions = ref([]);
    const showReceiptModal = ref(false);
    const selectedReceipt = ref({});
    const isLoading = ref(true);

    const fetchSalesOrders = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get("https://nurulfrozen.dgeo.id/api/sales-orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data && response.data.data) {
          transactions.value = response.data.data.map((order, index) => {
            const dateObj = new Date(order.created_at);
            const date = dateObj.toLocaleDateString('en-GB');
            const time = dateObj.toLocaleTimeString('en-GB');
            const status = order.order_status === 'pending' ? 'On Progress' : order.order_status;
            const items = order.items ? order.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })) : [];

            return {
              id: `ORD-${index + 1}`,
              date,
              time,
              status,
              amount: Number(order.total_amount),
              payment: order.payment_method,
              distribution: order.distribution,
              createdAt: dateObj.toLocaleString('en-GB'),
              updatedAt: new Date(order.updated_at).toLocaleString('en-GB'),
              paidStatus: order.is_paid ? 'Paid' : 'Unpaid',
              items
            };
          });
        }
      } catch (error) {
        console.error("Error fetching sales orders:", error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchSalesOrders();
    });

    const filteredTransactions = computed(() => {
      return transactions.value.filter((transaction) => {
        const matchesFilter = selectedFilter.value === "all" || transaction.status === (selectedFilter.value === "done" ? "Done" : "On Progress");
        const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesFilter && matchesSearch;
      });
    });

    const deleteTransaction = (id) => {
      if (confirm(`Are you sure you want to delete transaction ${id}?`)) {
        transactions.value = transactions.value.filter(transaction => transaction.id !== id);
      }
    };

    const showReceipt = (transaction) => {
      selectedReceipt.value = transaction;
      showReceiptModal.value = true;
    };

    const closeReceipt = () => {
      showReceiptModal.value = false;
    };

    return {
      selectedFilter,
      selectedDate,
      searchQuery,
      transactions,
      filteredTransactions,
      deleteTransaction,
      showReceiptModal,
      selectedReceipt,
      showReceipt,
      closeReceipt,
      isSidebarOpen,
      activeMenu,
      menuItems,
      logo,
      isLoading
    };
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.status-label {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 20px;
  text-align: center;
  width: max-content;
}

.done {
  background-color: #28a745;
  color: #ffffff;
}

.on-progress {
  background-color: #ffc107;
  color: #000000;
}
</style>
