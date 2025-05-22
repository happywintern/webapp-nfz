<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
      <!-- Search Input and Export Button -->
      <div class="relative mb-4 flex items-center space-x-4 w-1/6">
        <div class="relative flex-grow">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
          />
        </div>
        <button
          @click="exportPDF"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Export to PDF
        </button>
      </div>

      <!-- Loading and Error Messages -->
      <div v-if="isLoading" class="bg-white rounded-xl shadow-md p-8 text-center mb-4">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A327B]"></div>
        </div>
        <p class="mt-2 text-gray-600">Loading sales data...</p>
      </div>
      
      <div v-if="errorMessage && !isLoading" class="bg-white rounded-xl shadow-md p-4 mb-4 border-l-4 border-yellow-400">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-gray-700">{{ errorMessage }}</p>
        </div>
        <div class="mt-2">
          <p class="text-sm text-gray-600">Showing demo data instead. You can still interact with the table.</p>
        </div>
      </div>

      <div v-if="!isLoading" class="bg-white rounded-xl shadow-md overflow-hidden hide-scrollbar">
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
                  <button @click="viewTransaction(transaction.id)" class="text-gray-600 hover:text-green-600">
                    <img src="@/assets/icons/vertical_split.svg" alt="View" class="w-5 h-5" />
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
import { exportPDF } from "./exporttopdf.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    const isLoading = ref(false);
    const errorMessage = ref("");

    const fetchSalesOrders = async () => {
      isLoading.value = true;
      errorMessage.value = "";
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
        errorMessage.value = "Failed to load sales data.";
        transactions.value = [
          { id: "ORD-1", date: "01/01/2025", time: "10:00", status: "Done", amount: 1000, payment: "Cash", distribution: "Store" },
          { id: "ORD-2", date: "02/01/2025", time: "11:00", status: "On Progress", amount: 2000, payment: "Card", distribution: "Online" }
        ];
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

    const currentPage = ref(1);
    const pageSize = ref(5);

    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredTransactions.value.slice(start, start + pageSize.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / pageSize.value);
    });

    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const viewTransaction = (id) => {
      alert(`View transaction: ${id}`);
    };

    const exportToPDF = async () => {
      const doc = new jsPDF();

      const now = new Date();
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();

      doc.setFontSize(14);
      doc.text(`Laporan Keuangan Bulan ${month} ${year}`, 14, 15);
      let productSales = [];
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://nurulfrozen.dgeo.id/api/product-sales-summary?month=${now.getMonth() + 1}&year=${year}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data && Array.isArray(response.data.data)) {
          productSales = response.data.data.map(item => ({
            product: item.product_name,
            buyPrice: `Rp ${item.buy_price.toLocaleString()}`,
            sellPrice: `Rp ${item.sell_price.toLocaleString()}`,
            soldStock: item.sold_stock,
            profitPercent: `${item.profit_percent}%`
          }));
        }
      } catch (error) {
        console.error("Error fetching product sales summary:", error);
        productSales = [
          { product: 'Produk A', buyPrice: 'Rp 10,000', sellPrice: 'Rp 15,000', soldStock: 100, profitPercent: '50%' },
          { product: 'Produk B', buyPrice: 'Rp 20,000', sellPrice: 'Rp 25,000', soldStock: 50, profitPercent: '25%' },
          { product: 'Produk C', buyPrice: 'Rp 5,000', sellPrice: 'Rp 7,000', soldStock: 200, profitPercent: '40%' }
        ];
      }

      const columns = [
        { header: 'List Product', dataKey: 'product' },
        { header: 'Harga Belinya', dataKey: 'buyPrice' },
        { header: 'Harga Jual', dataKey: 'sellPrice' },
        { header: 'Jumlah Stok Terjual', dataKey: 'soldStock' },
        { header: 'Keuntungan (%)', dataKey: 'profitPercent' }
      ];

      autoTable(doc, {
        columns,
        body: productSales,
        startY: 25,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [26, 50, 123] }, // match border color #1A327B
        theme: 'striped'
      });

        doc.save(`laporan_keuangan_${month}_${year}.pdf`);
    };

    return {
      selectedFilter,
      selectedDate,
      searchQuery,
      transactions,
      filteredTransactions,
      paginatedTransactions,
      totalPages,
      currentPage,
      pageSize,
      goToPreviousPage,
      goToNextPage,
      totalRevenue,
      viewTransaction,
      isSidebarOpen,
      activeMenu,
      menuItems,
      logo,
      exportToPDF,
      exportPDF,
      isLoading,
      errorMessage
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
