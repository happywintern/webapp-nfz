<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
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
                  <button @click="editTransaction(transaction.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="deleteTransaction(transaction.id)" class="text-gray-600 hover:text-red-600">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click="viewTransaction(transaction.id)" class="text-gray-600 hover:text-green-600">
                    <img src="'assets/icons/vertical_split.svg'" alt="View" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const setActiveMenu = (name) => {
      activeMenu.value = name;
    };

    const transactions = ref([]);

    const fetchSalesOrders = async () => {
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
            return {
              id: `ORD-${index + 1}`,
              date,
              time,
              status,
              amount: Number(order.total_amount),
              payment: order.payment_method,
              distribution: order.distribution
            };
          });
        }
      } catch (error) {
        console.error("Error fetching sales orders:", error);
      }
    };

    onMounted(() => {
      fetchSalesOrders();
    });

    const totalRevenue = computed(() => {
      return transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    const filteredTransactions = computed(() => {
      return transactions.value.filter((transaction) => {
        const matchesFilter = selectedFilter.value === "all" || transaction.status === (selectedFilter.value === "done" ? "Done" : "On Progress");
        const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesFilter && matchesSearch;
      });
    });

    const editTransaction = (id) => {
      alert(`Edit transaction: ${id}`);
    };

    const deleteTransaction = (id) => {
      if (confirm(`Are you sure you want to delete transaction ${id}?`)) {
        transactions.value = transactions.value.filter(transaction => transaction.id !== id);
      }
    };

    const viewTransaction = (id) => {
      alert(`View transaction: ${id}`);
    };

    return {
      selectedFilter,
      selectedDate,
      searchQuery,
      transactions,
      filteredTransactions,
      totalRevenue,
      editTransaction,
      deleteTransaction,
      viewTransaction,
      isSidebarOpen,
      toggleSidebar,
      activeMenu,
      setActiveMenu,
      menuItems,
      logo
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
  background-color: #28a745; /* Green */
}

.done {
  background-color: #28a745; /* Green */
  color: #ffffff; /* White */
}

.on-progress {
  background-color: #ffc107; /* Yellow */
  color: #000000; /* Black */
}

</style>
