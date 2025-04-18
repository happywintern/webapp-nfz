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
            <div class="bg-green-100 p-4 rounded-xl shadow flex items-start space-x-4 max-w-[360px] w-full md:col-span-2">
              <div class="bg-green-500 text-white p-2 rounded-full">
                <ShoppingBagIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xl font-bold text-green-800">300</p>
                <p class="text-sm text-green-800">Penjualan Produk</p>
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
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/Layout.vue";
import { onMounted } from "vue";
import Chart from "chart.js/auto";
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
    ShoppingBagIcon,
  },
  setup() {
    onMounted(() => {
      const ctx = document.getElementById("salesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["WEEK 01", "WEEK 02", "WEEEK 03", "WEEK 04"],
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
    });
  },
};
</script>
