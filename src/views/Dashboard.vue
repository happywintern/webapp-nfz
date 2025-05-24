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
                <p class="text-xl font-bold text-blue-900">{{ formattedTotalSales }}</p>
                <p class="text-sm text-blue-900">Total Penjualan</p>
              </div>
            </div>

            <!-- Jumlah Transaksi -->
            <div class="bg-yellow-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-yellow-600 text-white p-2 rounded-full">
                <ArrowUturnLeftIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-yellow-800">{{ transactionCount }}</p>
                <p class="text-sm text-yellow-800">Jumlah Transaksi</p>
              </div>
            </div>

            <!-- Penjualan Produk -->
            <div class="bg-green-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-green-500 text-white p-2 rounded-full">
                <ShoppingBagIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-green-800">{{ productSalesTotal }}</p>
                <p class="text-sm text-green-800">Penjualan Produk</p>
              </div>
            </div>

            <!-- Laba -->
            <div class="bg-[#FFB6E7] p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-[#A83788] text-white p-2 rounded-full">
                <PresentationChartLineIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="text-xl font-bold text-[#A83788]">{{ formattedProfit }}</p>
                <p class="text-sm text-[#752359]">Laba Penjualan</p>
              </div>
            </div>
            <!-- <div class="bg-green-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-green-500 text-white p-2 rounded-full">
                <ShoppingBagIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-green-800">{{ formattedProfit }}</p>
                <p class="text-sm text-green-800">Laba</p>
              </div>
            </div> -->
          </div>
        </div>

        <!-- KANAN: Grafik Penjualan -->
        <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6">
          <h2 class="text-xl font-bold text-blue-900 border-b pb-2 mb-4 text-center">
            Penjualan Bulan - {{ currentMonth }}
          </h2>
          <div class="h-48">
            <canvas id="salesChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Bagian Bawah : Pesanan On Progress dan Map -->
      <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6 mt-6">
        <div class="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
          <h2 class="text-xl font-bold text-blue-900">
            Pesanan On Progress
          </h2>
          <input
            v-model="searchQuery"
            @input="filterMarkersByName(searchQuery)"
            type="text"
            placeholder="Search by customer name"
            class="border border-gray-300 rounded px-3 py-1 w-full max-w-xs"
          />
        </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <!-- Kiri: Tabel Pesanan -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th class="px-4 py-2 text-left">Nama Pemesan</th>
                  <th class="px-4 py-2 text-center">Alamat</th>
                  <th class="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="order in paginatedOrders" :key="order.order_id">
              <td class="px-4 py-2 font-medium text-blue-600">
              {{ order.buyer_name !== '-' ? order.buyer_name : 'Customer #' + order.order_id }}
              </td>
              <!-- <td class="px-4 py-2 font-medium text-blue-600">{{ order.buyer_name }}</td> -->
              <!-- <td class="px-4 py-2">{{ order.address || '-' }}</td> -->
              <td class="px-4 py-2 cursor-pointer text-center hover:text-blue-600 hover:underline" @click="focusOnMarker(order)">
                <template v-if="order.address === 'Loading...'">
                  <div class="flex items-center space-x-2">
                    <div class="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    <span>Loading...</span>
                  </div>
                </template>
                <template v-else-if="order.address === 'No location data' || order.address === 'Address unavailable'">
                  {{ order.address }}
                </template>
                <template v-else>
                  {{ truncateAddress(order.address) }}
                  <span class="text-xs text-blue-500 ml-1">(click to view)</span>
                </template>
              </td>
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
          <div id="map" class="w-full h-64 mt-0 md:mt-0 relative"></div>
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
import { ChartBarIcon, ArrowUturnLeftIcon, ShoppingBagIcon, PresentationChartLineIcon } from "@heroicons/vue/24/solid";

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
    

    const currentMonth = computed(() => {
      const date = new Date();
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


    // Helper function for reverse geocoding using Nominatim OpenStreetMap API
    const reverseGeocode = async (lat, lon) => {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            lat,
            lon,
            format: 'json'
          }
        });
        return response.data.display_name || '-';
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        return '-';
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("https://nurulfrozen.dgeo.id/api/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.data?.data) {
          throw new Error('Invalid response format');
        }

        const data = response.data.data;

        // Set basic statistics
        totalSales.value = parseFloat(data.total_sales || 0);
        transactionCount.value = parseInt(data.transaction_count || 0);
        profit.value = parseFloat(data.profit || 0);

        // Handle product sales
        if (Array.isArray(data.product_sales)) {
          productSalesTotal.value = data.product_sales.reduce((acc, item) => 
            acc + parseInt(item.total_sold || 0), 0);
        } else {
          productSalesTotal.value = 0;
        }

        // Handle chart data
        chartData.value = Array.isArray(data.chart_data) ? data.chart_data : [];

        // Handle orders and map data
        const ordersInProgress = data.orders_in_progress || [];
        const mapDataArray = data.map_data || [];

        // Create map data lookup
        const mapDataByOrderId = {};
        mapDataArray.forEach(item => {
          if (item?.order_id) {
            mapDataByOrderId[item.order_id] = item;
          }
        });

        // Process orders with location data
        orders.value = ordersInProgress.map(order => {
          const mapItem = mapDataByOrderId[order.order_id];
          return {
            ...order,
            latitude: mapItem?.latitude || null,
            longitude: mapItem?.longitude || null,
            address: 'Loading...',
            buyer_name: mapItem?.recipient_name || `Customer #${order.order_number}`
          };
        });

        mapData.value = mapDataArray;

        // Update visualizations
        updateChart();
        updateMap();
        
        // Fetch addresses in background
        fetchAddressesForOrders();

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default values on error
        totalSales.value = 0;
        transactionCount.value = 0;
        productSalesTotal.value = 0;
        profit.value = 0;
        chartData.value = [];
        orders.value = [];
        mapData.value = [];
      }
    };
    
        // Function to truncate long addresses
    const truncateAddress = (address) => {
      if (!address) return '-';
      if (address.length <= 30) return address;
      return address.substring(0, 30) + '...';
    };

    // Function to focus on a marker when an address is clicked
    const focusOnMarker = (order) => {
      if (!order.latitude || !order.longitude) return;
      
      // Find the corresponding marker
      const markerItem = allMarkers.find(marker => {
        const markerLatLng = marker.marker.getLatLng();
        return markerLatLng.lat === parseFloat(order.latitude) && 
              markerLatLng.lng === parseFloat(order.longitude);
      });
      
      if (markerItem) {
        // Center the map on the marker location
        mapInstance.setView([order.latitude, order.longitude], 15);
        
        // Open the popup
        markerItem.marker.openPopup();
      }
    };

    // Add a new function to fetch addresses for all orders with coordinates
    const fetchAddressesForOrders = async () => {
      for (const order of orders.value) {
        if (order.latitude && order.longitude) {
          try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const address = await reverseGeocode(order.latitude, order.longitude);
            order.address = address;
          } catch (error) {
            console.error(`Error fetching address for order ${order.order_id}:`, error);
            order.address = 'Address unavailable';
          }
        } else {
          order.address = 'No location data';
        }
      }
    };

    const updateChart = () => {
      const canvas = document.getElementById("salesChart");
      if (!canvas) {
        console.warn("Sales chart canvas not found");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("Could not get 2D context for sales chart");
        return;
      }

      // Urutkan data berdasarkan tanggal
      const sortedData = chartData.value
        .map(item => ({
          date: new Date(item.date),
          value: parseFloat(item.daily_total || 0)
        }))
        .sort((a, b) => a.date - b.date);

      const dataSet = sortedData.map(item => item.value);
      const sortedLabels = sortedData.map(item => item.date.getDate());

      // Get the chart instance from the canvas
      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }

      // Create new chart
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: sortedLabels,
          datasets: [{
            label: "Penjualan",
            data: dataSet,
            backgroundColor: "#1e3a8a",
            borderRadius: 8,
            barThickness: 20, // Mengecilkan ketebalan bar
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(value);
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Tanggal'
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: function(context) {
                  const date = new Date(chartData.value[context[0].dataIndex].date);
                  return date.toLocaleDateString('id-ID', { 
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  });
                },
                label: function(context) {
                  return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(context.raw);
                }
              }
            }
          }
        }
      });
    };

    let mapInstance = null;
    let markersLayer = null;
    let allMarkers = [];

    const updateMap = (filteredMapData = null) => {
      if (mapInstance) {
        mapInstance.remove();
      }
      mapInstance = L.map("map").setView([-6.375, 106.829], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      if (markersLayer) {
        markersLayer.clearLayers();
      } else {
        markersLayer = L.layerGroup().addTo(mapInstance);
      }

      // Create a map from order_id to order info (address and buyer_name)
      const orderInfoMap = {};
      orders.value.forEach(order => {
        orderInfoMap[order.order_id] = {
          address: order.address || '-',
          buyer_name: order.buyer_name || '-'
        };
      });

      const dataToUse = filteredMapData || mapData.value;

      allMarkers = [];

      if (dataToUse && dataToUse.length) {
        dataToUse.forEach(item => {
          if (item.latitude && item.longitude) {
            const info = orderInfoMap[item.order_id] || { address: '-', buyer_name: '-' };
            const marker = L.marker([item.latitude, item.longitude]);
            marker.orderId = item.order_id; // Add a reference to the order ID
            marker.addTo(markersLayer);

            // Lazy load address on popup open
            marker.on('popupopen', async () => {
              if (info.address === '-' || info.address === 'Loading...') {
                const address = await reverseGeocode(item.latitude, item.longitude);
                info.address = address;
                
                // Update the marker popup
                marker.setPopupContent(
                  `<b>${info.buyer_name}</b><br/>Order: ${item.order_number}<br/>Address: ${info.address}`
                );
                
                // Also update the order object if it exists
                const orderToUpdate = orders.value.find(o => o.order_id === item.order_id);
                if (orderToUpdate) {
                  orderToUpdate.address = address;
                }
              }
            });

            marker.bindPopup(
              `<b>${info.buyer_name}</b><br/>Order: ${item.order_number}<br/>Address: ${info.address}`
            );
            allMarkers.push({ 
              marker, 
              buyer_name: info.buyer_name.toLowerCase(),
              order_id: item.order_id
            });
          }
        });
      }

      // if (dataToUse && dataToUse.length) {
      //   dataToUse.forEach(item => {
      //     const info = orderInfoMap[item.order_id] || { address: '-', buyer_name: '-' };
      //     const marker = L.marker([item.latitude, item.longitude]);
      //     marker.addTo(markersLayer);

      //     // Lazy load address on popup open
      //     marker.on('popupopen', async () => {
      //       if (info.address === '-' && item.latitude && item.longitude) {
      //         const address = await reverseGeocode(item.latitude, item.longitude);
      //         info.address = address;
      //         marker.setPopupContent(
      //           `<b>${info.buyer_name}</b><br/>Order: ${item.order_number}<br/>Address: ${info.address}`
      //         );
      //       }
      //     });

      //     marker.bindPopup(
      //       `<b>${info.buyer_name}</b><br/>Order: ${item.order_number}<br/>Address: ${info.address}`
      //     );
      //     allMarkers.push({ marker, buyer_name: info.buyer_name.toLowerCase() });
      //   });
      // }
    };

    const filterMarkersByName = (searchTerm) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      markersLayer.clearLayers();
      allMarkers.forEach(({ marker, buyer_name }) => {
        if (buyer_name.includes(lowerSearchTerm)) {
          marker.addTo(markersLayer);
        }
      });
    };

    const searchQuery = ref('');

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
      searchQuery,
      filterMarkersByName,
      updateMap,
      truncateAddress,
      focusOnMarker,
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
