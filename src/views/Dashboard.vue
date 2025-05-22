<template>
  <AppLayout>
    <div class="p-6 hide-scrollbar">
      <!-- Bagian Atas: Statistik dan Grafik -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- KIRI: Statistik Penjualan Bulan Ini -->
        <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6">
          <h2 class="text-xl font-bold text-blue-900 border-b pb-2 mb-4 text-center">
            Total Penjualan
          </h2>
          <!-- Grid Statistik -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center mt-8">
            <!-- Total Penjualan -->
            <div class="bg-blue-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-blue-500 text-white p-2 rounded-full">
                <ChartBarIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-black">{{ formattedTotalSales }}</p>
                <p class="text-sm text-blue-900">Total Penjualan</p>
              </div>
            </div>

            <!-- Jumlah Transaksi -->
            <div class="bg-yellow-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-yellow-600 text-white p-2 rounded-full">
                <ArrowUturnLeftIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-black">{{ transactionCount }}</p>
                <p class="text-sm text-yellow-800">Jumlah Transaksi</p>
              </div>
            </div>

            <!-- Penjualan Produk -->
            <div class="bg-green-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-green-500 text-white p-2 rounded-full">
                <ShoppingBagIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-black">{{ productSalesTotal }}</p>
                <p class="text-sm text-green-800">Penjualan Produk</p>
              </div>
            </div>

            <!-- Laba -->
            <div class="bg-[#FFB6E7] p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-[#A83788] text-white p-2 rounded-full">
                <PresentationChartLineIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-xl font-bold text-balck">{{ formattedProfit }}</p>
                <p class="text-sm text-[#752359]">Laba Penjualan</p>
              </div>
            </div>
          </div>
        </div>

        <!-- KANAN: Grafik Penjualan -->
        <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6">
          <h2 class="text-xl font-bold text-blue-900 border-b pb-2 mb-4 text-center">
            Penjualan Bulan - {{ currentMonth }}
          </h2>
          <canvas id="salesChart" class="w-full h-64"></canvas>
        </div>
      </div>

      <!-- Bagian Bawah : Pesanan On Progress dan Map -->
      <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6 mt-6">
        <h2 class="text-xl font-bold text-blue-900 border-b pb-2 mb-4 text-center">
          Pesanan On Progress
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <!-- Kiri: Tabel Pesanan -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th class="px-4 py-2 text-left">Nama Pemesan</th>
                  <th class="px-4 py-2 text-left">Alamat</th>
                  <th class="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="order in paginatedOrders" :key="order.order_id">
              <td class="px-4 py-2 font-medium text-blue-600">{{ order.buyer_name }}</td>
              <td class="px-4 py-2">{{ order.address || '-' }}</td>
              <td class="px-4 py-2">
                <span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 8v4m8-8h-4m-8 0H4" />
                  </svg>
                  {{ order.order_status }}
                </span>
              </td>
            </tr>
          </tbody>
            </table>
            <!-- Pagination Controls -->
            <div class="flex justify-center space-x-4 mt-2">
              <button
                @click="goToPreviousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span class="flex items-center text-sm">
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
          <!-- Kanan: Peta Dinamis -->
          <div id="map" class="w-full h-64 mt-0 md:mt-0"></div>
        </div>
      </div>
    </div>
  </AppLayout>
  <transition name="notification-fade">
    <div v-if="showWelcomeModal" class="fixed top-5 right-5 z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg flex items-center space-x-3 border border-green-400 text-sm">
        <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p class="font-semibold mb-1">Selamat Datang</p>
          <p>Siap menghitung uang kembali?</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import AppLayout from "@/components/Layout.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import { ChartBarIcon, ArrowUturnLeftIcon, ShoppingBagIcon, PresentationChartLineIcon  } from "@heroicons/vue/24/solid";

export default {
  name: "DashboardPage",
  components: {
    AppLayout,
    ChartBarIcon,
    ArrowUturnLeftIcon,
    ShoppingBagIcon,
    PresentationChartLineIcon
  },
  setup() {
    const totalSales = ref(0);
    const transactionCount = ref(0);
    const productSalesTotal = ref(0);
    const profit = ref(0);
    const chartData = ref([]);
    const orders = ref([]);
    const currentPage = ref(1);
    const pageSize = 5;

    const showWelcomeModal = ref(true);

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return orders.value.slice(start, start + pageSize);
    });

    const totalPages = computed(() => {
      return Math.ceil(orders.value.length / pageSize);
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
    const mapData = ref([]);
    
    // Computed property untuk menampilkan nama bulan saat ini
    const currentMonth = computed(() => {
      const date = new Date();
      // Gunakan opsi sederhana untuk mengambil nama bulan (dalam bahasa Inggris; bisa diubah)
      return date.toLocaleString('default', { month: 'long' });
    });

    const formattedTotalSales = computed(() => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(totalSales.value);
    });

    const formattedProfit = computed(() => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(profit.value);
    });


    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("https://nurulfrozen.dgeo.id/api/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = response.data;
        totalSales.value = data.total_sales;
        transactionCount.value = data.transaction_count;
        productSalesTotal.value = data.product_sales.reduce((acc, item) => acc + Number(item.total_sold || 0), 0);
        profit.value = data.profit;
        chartData.value = data.chart_data;
        orders.value = data.orders_in_progress;
        mapData.value = data.map_data;
        updateChart();
        updateMap();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    // Update grafik menggunakan Chart.js
    const updateChart = () => {
      const ctx = document.getElementById("salesChart").getContext("2d");
      // Jika data chart kosong, gunakan array kosong
      const labels = chartData.value.map(item => item.date) || [];
      const dataSet = chartData.value.map(item => item.daily_total) || [];
      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Sales",
              data: dataSet,
              backgroundColor: "#1e3a8a",
              borderRadius: 8,
              barThickness: 40,
            },
          ],
        },
        options: {
          scales: { 
            y: { beginAtZero: true, ticks: { stepSize: 20 } }
          },
          plugins: { legend: { display: false } },
        },
      });
    };

    const updateMap = () => {
      // Inisialisasi peta walaupun mapData kosong
      const map = L.map("map").setView([-6.375, 106.829], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      
      if (mapData.value && mapData.value.length) {
        mapData.value.forEach(item => {
          L.marker([item.latitude, item.longitude])
            .addTo(map)
            .bindPopup(`<b>${item.buyer_name}</b><br/>Order: ${item.order_number}`);
        });
      }
    };

    onMounted(() => {
      fetchDashboardData();
      setTimeout(() => {
        showWelcomeModal.value = false;
      }, 4000);
    });

    return {
      totalSales,
      transactionCount,
      productSalesTotal,
      profit,
      orders,
      currentPage,
      totalPages,
      paginatedOrders,
      goToPreviousPage,
      goToNextPage,
      formattedTotalSales,
      formattedProfit,
      currentMonth,
      showWelcomeModal,
    };
  }
};
</script>

<style scoped>
#map {
  height: 300px;
  width: 100%;
}

.notification {
  position: fixed;
  bottom: 1.25rem; /* 20px */
  right: 1.25rem; /* 20px */
  background-color: white;
  border: 1px solid #34d399; /* green-400 */
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05);
  border-radius: 0.5rem; /* rounded-lg */
  padding: 1rem;
  max-width: 16rem; /* max-w-xs */
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 50;
  animation: slideIn 0.5s ease forwards;
}

.notification svg {
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
  color: #34d399; /* green-500 */
  flex-shrink: 0;
}

.notification-content {
  display: flex;
  flex-direction: column;
}

.notification-title {
  font-weight: 600;
  font-size: 1.125rem; /* text-lg */
  margin-bottom: 0.25rem; /* mb-1 */
}

.notification-text {
  font-size: 0.875rem; /* text-sm */
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-fade-enter-active, .notification-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.notification-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.notification-fade-enter-to, .notification-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>