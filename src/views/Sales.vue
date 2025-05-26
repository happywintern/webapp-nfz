<template>
  <AppLayout>
    <Toast 
      :show="showToast"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
    <div class="p-6 bg-gray-100 min-h-screen">
      <div class="flex items-center mb-4 w-full">
        <!-- Filter Button -->
        <button 
          @click="showFilters = true"
          class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
        >
          <i class="fas fa-filter text-gray-600"></i>
          <span class="text-gray-700">Filters</span>
          <span v-if="activeFiltersCount > 0" class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {{ activeFiltersCount }}
          </span>
        </button>

        <!-- Filter tanggal -->
        <!-- <select
          v-model="selectedDateRange"
          class="border border-[#1A327B] rounded-xl px-3 py-2 mr-4 text-base w-[140px] min-w-[110px] max-w-[180px]"
        >
          <option value="all">Semua</option>
          <option value="week">Seminggu</option>
          <option value="month">Bulan ini</option>
        </select> -->

        <!-- Filter Status -->
        <!-- <select
          v-model="selectedStatus"
          class="border border-[#1A327B] rounded-xl px-3 py-2 mr-4 text-base w-[160px] min-w-[130px] max-w-[180px]"
        >
          <option value="all">Semua Status</option>
          <option value="Selesai">Selesai</option>
          <option value="Sedang Berjalan">Sedang Berjalan</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select> -->

        <!-- Search bar -->
        <div class="relative ml-4" style="width: 320px;">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="pl-10 pr-3 py-2 border border-[#1A327B] text-black font-semibold rounded-2xl text-base w-full"
          />
        </div>
        <div class="flex-1"></div>
        <button
          @click="handleExportPDF"
          class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Unduh PDF
        </button>
      </div>

      <!-- Filter Modal -->
      <div v-if="showFilters" class="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-start justify-center pt-20">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-md flex flex-col max-h-[80vh]">
          <!-- Header - Fixed -->
          <div class="flex items-center justify-between p-4 border-b bg-white rounded-t-xl">
            <div class="flex items-center space-x-2">
              <button @click="showFilters = false" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-arrow-left"></i>
              </button>
              <h2 class="text-lg font-semibold">Filters</h2>
            </div>
            <button @click="clearAllFilters" class="text-sm text-gray-500 hover:text-gray-700">
              Clear all
            </button>
          </div>

          <!-- Filter Content - Scrollable -->
          <div class="p-4 space-y-6 overflow-y-auto flex-1">
            <!-- Time Filter -->
            <div class="space-y-3">
              <div class="flex justify-between">
                <h3 class="font-semibold">Waktu</h3>
                <button 
                  @click="selectedDateRange = 'all'" 
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div class="space-y-2">
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedDateRange" 
                    value="all"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Semua</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedDateRange" 
                    value="month"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Bulan ini</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedDateRange" 
                    value="week"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Seminggu</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedDateRange" 
                    value="custom"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Rentan Waktu</span>
                </label>

                <!-- Custom Date Range Inputs -->
                <div v-if="selectedDateRange === 'custom'" class="mt-3 space-y-3">
                  <div class="space-y-2">
                    <label class="text-sm text-gray-600">Dari Tanggal</label>
                    <input 
                      type="datetime-local" 
                      v-model="customDateRange.start"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1A327B] focus:border-[#1A327B]"
                    >
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-gray-600">Sampai Tanggal</label>
                    <input 
                      type="datetime-local" 
                      v-model="customDateRange.end"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1A327B] focus:border-[#1A327B]"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Filter -->
            <div class="space-y-3">
              <div class="flex justify-between">
                <h3 class="font-semibold">Status</h3>
                <button 
                  @click="selectedStatus = 'all'" 
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div class="space-y-2">
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedStatus" 
                    value="all"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Semua</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedStatus" 
                    value="Selesai"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Selesai</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedStatus" 
                    value="Sedang Berjalan"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Sedang Berjalan</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedStatus" 
                    value="Dibatalkan"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Gagal</span>
                </label>
              </div>
            </div>

            <!-- Distribution Filter -->
            <div class="space-y-3">
              <div class="flex justify-between">
                <h3 class="font-semibold">Distribusi</h3>
                <button 
                  @click="selectedDistribution = 'all'" 
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div class="space-y-2">
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedDistribution" 
                    value="all"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Semua</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedDistribution" 
                    value="langsung"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Di Tempat</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    v-model="selectedDistribution" 
                    value="delivery"
                    class="form-radio text-[#1A327B] focus:ring-[#1A327B]"
                  >
                  <span>Di Antar</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Apply Button - Fixed -->
          <div class="p-4 border-t bg-white rounded-b-xl">
            <button 
              @click="applyFilters" 
              class="w-full py-2 bg-[#1A327B] text-white rounded-lg hover:bg-blue-900 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
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
              <th class="py-4 px-6 font-semibold border-b-2 text-center border-[#1A327B]">No.</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Tanggal</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Waktu</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Jumlah</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Pembayaran</th>
              <th class="py-4 px-6 text-center font-semibold border-b-2 border-[#1A327B]">Distribusi</th>
              <th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Status</th>
              <th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-gray-800">
            <tr
              v-for="(transaction, index) in paginatedTransactions"
              :key="transaction.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-2 px-4 text-center">{{ index + 1 }}</td>
              <td class="py-2 px-4">{{ transaction.date }}</td>
              <td class="py-2 px-4">{{ transaction.time }}</td>
              <td class="py-2 px-4">Rp{{ formatRupiah(transaction.amount) }} </td>
              <td class="py-2 px-4">{{ transaction.payment }}</td>
              <td class="py-2 px-4 text-center">{{ distributionLabel(transaction.distribution) }}</td>
              <td class="py-2 px-4 text-center">
                <div v-if="transaction.status === 'Sedang Berjalan'" class="relative">
                  <button 
                    @click="toggleStatusDropdown(transaction.id)"
                    class="status-label on-progress cursor-pointer hover:bg-orange-50 transition-colors"
                  >
                    {{ transaction.status }}
                  </button>
                  <!-- Dropdown Menu -->
                  <div 
                    v-if="activeDropdownId === transaction.id"
                    class="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div class="py-1">
                      <button
                        @click="updateOrderStatus(transaction.id, 'Selesai')"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Selesai
                      </button>
                      <button
                        @click="updateOrderStatus(transaction.id, 'Dibatalkan')"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dibatalkan
                      </button>
                    </div>
                  </div>
                </div>
                <span 
                  v-else
                  class="status-label"
                  :class="{
                    'done': transaction.status === 'Selesai',
                    'cancelled': transaction.status === 'Dibatalkan'
                  }"
                >
                  {{ transaction.status }}
                </span>
              </td>
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
      <div class="flex justify-end p-4 border-t border-gray-200">
        <button
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 mr-2"
        >
          Previous
        </button>
        <span class="flex items-center text-sm mr-2">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </div>

      <!-- Transaction Details Modal -->
      <div v-if="showTransactionDetails" class="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center">
        <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold mb-1">{{ selectedTransaction?.order_number || 'ORD-000000000' }}</h2>
            <p class="text-gray-600">Staff: {{ selectedTransaction?.staff?.name || 'Admin' }}</p>
            <p class="text-gray-600">{{ formatDateTime(selectedTransaction?.created_at) }}</p>
          </div>

          <!-- Items Table -->
          <div class="border-y border-gray-200 py-4 mb-4">
            <table class="w-full text-sm">
              <thead class="text-left">
                <tr>
                  <th class="py-2">Nama Barang</th>
                  <th class="py-2 text-center">Jumlah</th>
                  <th class="py-2 text-right">Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedTransaction?.items || []" :key="item.orderitem_id">
                  <td class="py-2">{{ item.product.product_name }}</td>
                  <td class="py-2 text-center">{{ item.quantity }}</td>
                  <td class="py-2 text-right">{{ formatRupiah(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Transaction Summary -->
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="font-semibold">Total</span>
              <span>Rp{{ formatRupiah(selectedTransaction?.total_amount || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold text-capitalize">{{ selectedTransaction?.payment_method || 'Tunai' }}</span>
              <span>Rp{{ formatRupiah(selectedTransaction?.total_amount || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Kembali</span>
              <span>Rp0</span>
            </div>
          </div>

          <!-- Close Button -->
          <div class="mt-6 flex justify-center">
            <button 
              @click="closeTransactionDetails" 
              class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import logoImage from "@/assets/image.png";
import AppLayout from "@/components/Layout.vue";
import { HomeIcon, ShoppingCartIcon, BanknotesIcon, CubeIcon, StarIcon } from "@heroicons/vue/24/solid";
import { exportToPDF } from "./exporttopdf.js";
import NotificationToast from "@/components/Toast.vue";

export default {
  name: "SalesPage",
  components: {
    AppLayout,
    Toast: NotificationToast
  },
  setup() {
    const selectedFilter = ref("all");
    const selectedDate = ref("today");
    const searchQuery = ref("");
    const selectedStatus = ref("all");
    const isSidebarOpen = ref(false);
    const activeMenu = ref("Sales");
    const logo = logoImage;
    const selectedDateRange = ref("all");
    const showFilters = ref(false);
    const selectedDistribution = ref('all');
    const customDateRange = ref({
      start: '',
      end: ''
    });
    const showTransactionDetails = ref(false);
    const selectedTransaction = ref(null);

    const statusMap = {
      processing: 'Sedang Berjalan',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };

    // Add reverse status map
    const reverseStatusMap = {
      'Selesai': 'completed',
      'Dibatalkan': 'cancelled',
      'Sedang Berjalan': 'processing'
    };

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
          transactions.value = response.data.data.map((order) => {
            const dateObj = new Date(order.created_at);
            const date = dateObj.toLocaleDateString('en-GB');
            const time = dateObj.toLocaleTimeString('en-GB');
            return {
              id: order.order_id,
              date,
              time,
              status: statusMap[order.order_status] || order.order_status,
              amount: Number(order.total_amount),
              payment: order.payment_method,
              distribution: order.pickup_method,
              pickup_method: order.pickup_method
            };
          });
        }
      } catch (error) {
        console.error("Error fetching sales orders:", error);
        errorMessage.value = "Failed to load sales data.";
      } finally {
        isLoading.value = false;
      }
    };

    const activeDropdownId = ref(null);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (activeDropdownId.value && !event.target.closest('.relative')) {
        activeDropdownId.value = null;
      }
    };

    onMounted(() => {
      fetchSalesOrders();
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    const toggleStatusDropdown = (id) => {
      activeDropdownId.value = activeDropdownId.value === id ? null : id;
    };

    // Add toast state
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastType = ref("success");

    // Function to show toast
    const showNotification = (message, type = "success") => {
      toastMessage.value = message;
      toastType.value = type;
      showToast.value = true;
      // Auto hide after 3 seconds
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
      try {
        // Cek apakah ini pesanan langsung
        const order = transactions.value.find(t => t.id === orderId);
        if (order && order.pickup_method === 'langsung') {
          showNotification('Pesanan di tempat otomatis selesai', 'info');
          return;
        }

        const apiStatus = reverseStatusMap[newStatus];
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `https://nurulfrozen.dgeo.id/api/sales-orders/${orderId}/next-status`,
          {
            order_status: apiStatus
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.status === 200) {
          const orderIndex = transactions.value.findIndex(t => t.id === orderId);
          if (orderIndex !== -1) {
            transactions.value[orderIndex].status = newStatus;
          }
          
          activeDropdownId.value = null;
          showNotification('Status berhasil diperbarui');
          await fetchSalesOrders();
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Gagal mengubah status. Silakan coba lagi.', 'error');
      }
    };

    const totalRevenue = computed(() => {
      return transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    // Compute active filters count
    const activeFiltersCount = computed(() => {
      let count = 0;
      if (selectedDateRange.value !== 'all') count++;
      if (selectedStatus.value !== 'all') count++;
      if (selectedDistribution.value !== 'all') count++;
      return count;
    });

    // Clear all filters
    const clearAllFilters = () => {
      selectedDateRange.value = 'all';
      selectedStatus.value = 'all';
      selectedDistribution.value = 'all';
      customDateRange.value = {
        start: '',
        end: ''
      };
    };

    // Apply filters and close modal
    const applyFilters = () => {
      showFilters.value = false;
    };

    // Update filteredTransactions to include custom date range
    const filteredTransactions = computed(() => {
      const now = new Date();

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      return transactions.value.filter((transaction) => {
        // Date filter
        let matchDate = true;
        const [day, month, year] = transaction.date.split("/").map(Number);
        const transactionDate = new Date(year, month - 1, day);

        if (selectedDateRange.value === "week") {
          matchDate = transactionDate >= startOfWeek && transactionDate <= now;
        } else if (selectedDateRange.value === "month") {
          matchDate = transactionDate >= startOfMonth && transactionDate <= now;
        } else if (selectedDateRange.value === "custom" && customDateRange.value.start && customDateRange.value.end) {
          const start = new Date(customDateRange.value.start);
          const end = new Date(customDateRange.value.end);
          matchDate = transactionDate >= start && transactionDate <= end;
        }

        // Status filter
        const matchStatus = selectedStatus.value === "all" || transaction.status === selectedStatus.value;

        // Distribution filter
        const matchDistribution = selectedDistribution.value === "all" || 
                                transaction.distribution === selectedDistribution.value;

        // Search
        const searchTerm = searchQuery.value.toLowerCase();
        const matchesSearch = searchTerm === '' || 
          String(transaction.id).includes(searchTerm) ||
          transaction.date.toLowerCase().includes(searchTerm) ||
          transaction.payment.toLowerCase().includes(searchTerm);

        return matchDate && matchStatus && matchDistribution && matchesSearch;
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
    function distributionLabel(val) {
      if (val === "langsung") return "Di Tempat";
      if (val === "delivery") return "Antar ke Rumah";
      return val;
    }
    
    function formatRupiah(value) {
      if (typeof value !== "number") value = Number(value) || 0;
      return value.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return '';
      const date = new Date(dateTimeStr);
      const formattedDate = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `Tgl. ${formattedDate} ${formattedTime}`;
    };

    const viewTransaction = async (id) => {
      try {
        const response = await axios.get(`https://nurulfrozen.dgeo.id/api/sales-orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.data) {
          selectedTransaction.value = response.data.data;
          showTransactionDetails.value = true;
        }
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        alert('Failed to load transaction details. Please try again.');
      }
    };

    const closeTransactionDetails = () => {
      showTransactionDetails.value = false;
      selectedTransaction.value = null;
    };

    const handleExportPDF = async () => {
      const filters = {
        dateRange: selectedDateRange.value,
        customDateRange: customDateRange.value,
        status: selectedStatus.value
      };
      await exportToPDF(filters);
    };

    return {
      selectedDateRange,
      selectedStatus,
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
      toggleSidebar,
      activeMenu,
      setActiveMenu,
      menuItems,
      logo,
      exportToPDF,
      isLoading,
      errorMessage,
      formatRupiah,
      distributionLabel,
      activeDropdownId,
      toggleStatusDropdown,
      updateOrderStatus,
      showFilters,
      selectedDistribution,
      activeFiltersCount,
      clearAllFilters,
      applyFilters,
      customDateRange,
      showTransactionDetails,
      selectedTransaction,
      formatDateTime,
      closeTransactionDetails,
      showToast,
      toastMessage,
      toastType,
      showNotification,
      handleExportPDF,
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
  border-radius: 20px;
  text-align: center;
  width: max-content;
  transition: all 0.2s;
}
.done {
  color: green;
  background-color: #f0fdf4;
}
.on-progress { 
  color: #f97316;
  background-color: #fff7ed;
}
.cancelled {
  color: red;
  background-color: #fef2f2;
}

/* Add styles for radio buttons */
.form-radio {
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  outline: none;
  transition: all 0.2s ease;
}

.form-radio:checked {
  border-color: #1A327B;
  background-color: #1A327B;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.form-radio:focus {
  box-shadow: 0 0 0 3px rgba(26, 50, 123, 0.2);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
