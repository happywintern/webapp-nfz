<template>
  <AppLayout>
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- KIRI: Penjualan Bulan Ini -->
        <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6">
          <h2 class="text-xl font-bold text-blue-900 border-b pb-2 mb-4 text-center">
            Penjualan Bulan Ini
          </h2>
          <!-- Grid Penjualan Bulan Ini -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center mt-8">
            <!-- Total Penjualan -->
            <div class="bg-blue-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-blue-500 text-white p-2 rounded-full">
                <ChartBarIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-blue-900">Rp15.000.000</p>
                <p class="text-sm text-blue-900">Total Penjualan</p>
              </div>
            </div>

            <!-- Jumlah Transaksi -->
            <div class="bg-yellow-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-yellow-600 text-white p-2 rounded-full">
                <ArrowUturnLeftIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-yellow-800">0</p>
                <p class="text-sm text-yellow-800">Jumlah Transaksi</p>
              </div>
            </div>

            <!-- Penjualan Produk -->
            <div class="bg-green-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-green-500 text-white p-2 rounded-full">
                <ShoppingBagIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-green-800">300</p>
                <p class="text-sm text-green-800">Penjualan Produk</p>
              </div>
            </div>

            <!-- Laba -->
            <div class="bg-green-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full">
              <div class="bg-green-500 text-white p-2 rounded-full">
                <ShoppingBagIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-green-800">Rp500.0000</p>
                <p class="text-sm text-green-800">Laba</p>
              </div>
            </div>
          </div>
        </div>

        <!-- KANAN: Chart -->
        <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6">
          <h2 class="text-xl font-bold text-blue-900 border-b pb-2 mb-4 text-center">
            Sales - Februari
          </h2>
          <canvas id="salesChart" class="w-full h-64"></canvas>
        </div>
      </div>

      <!-- Bawah : Pesanan On Progress -->
      <div class="bg-white rounded-2xl shadow px-6 pt-7 pb-6 col-span-2 mt-6">
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
              <tr v-for="order in orders" :key="order.id">
                <td class="px-4 py-2 font-medium text-blue-600">{{ order.name }}</td>
                <td class="px-4 py-2">{{ order.address }}</td>
                <td class="px-4 py-2">
                  <span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 8v4m8-8h-4m-8 0H4" />
                    </svg>
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
    </div>
          <!-- Kanan: Peta Dinamis -->
          <div id="map" class="w-full h-64 mt-6 md:mt-0"></div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from "@/components/Layout.vue";
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import L from "leaflet";  // Import Leaflet for maps
import {
  ChartBarIcon,
  ArrowUturnLeftIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/24/solid";

export default {
  name: "DashboardPage",
  components: {
    AppLayout,
    ChartBarIcon,
    ArrowUturnLeftIcon,
    ShoppingBagIcon
    
  },
  setup() {
    const orders = ref([
      { id: 1, name: "John Doe", address: "Jl. Merdeka No. 10, Depok", status: "Belum Dikirim", lat: -6.375, lng: 106.829 },
      { id: 2, name: "Jane Smith", address: "Jl. Raya No. 20, Jakarta", status: "Belum Dikirim", lat: -6.200, lng: 106.830 },
    ]);

    // Initialize Chart.js for Sales data
    onMounted(() => {
      const ctx = document.getElementById("salesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["WEEK 01", "WEEK 02", "WEEK 03", "WEEK 04"],
          datasets: [
            {
              label: "Sales",
              data: [60, 100, 30, 65],
              backgroundColor: "#1e3a8a",
              borderRadius: 8,
              barThickness: 40,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 20,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      // Initialize Leaflet map
      const map = L.map("map").setView([-6.375, 106.829], 13);  // Set default center

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      }).addTo(map);

      // Add marker for each order's location
      orders.value.forEach((order) => {
        L.marker([order.lat, order.lng])
          .addTo(map)
          .bindPopup(`<b>${order.name}</b><br/>${order.address}`);
      });
    });

    return {
      orders,
    };
  },
};
</script>
<style scoped>
#map {
  height: 300px;
  width: 100%;
}
</style>
