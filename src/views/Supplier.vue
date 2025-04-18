<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
      <!-- Search Input -->
      <!-- Search Input -->
      <div class="relative mb-4 w-1/6">
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        <input
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
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Name</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Email</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Contact</th>
              <th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Action</th>
            </tr>
          </thead>
          <tbody class="text-gray-800">
            <tr
              v-for="supplier in suppliers"
              :key="supplier.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-4 px-6">{{ supplier.id }}</td>
              <td class="py-4 px-6">{{ supplier.name }}</td>
              <td class="py-4 px-6">{{ supplier.email }}</td>
              <td class="py-4 px-6">{{ supplier.contact }}</td>
              <td class="py-4 px-6">
                <div class="flex justify-center items-center space-x-4">
                  <button @click="editSupplier(supplier.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="deleteSupplier(supplier.id)" class="text-gray-600 hover:text-red-600">
                    <i class="fas fa-trash"></i>
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
import AppLayout from "@/components/Layout.vue";

export default {
  name: "SupplierPage",
  components: {
    AppLayout,
  },
  data() {
    return {
      suppliers: [
        { id: "CO-001", name: "Nisal Wimalasooriya", email: "nisalwsy981@gmail.com", contact: "070 123 0999" },
        { id: "CO-001", name: "Nisal Wimalasooriya", email: "nisalwsy981@gmail.com", contact: "070 123 0999" },
        { id: "CO-001", name: "Nisal Wimalasooriya", email: "nisalwsy981@gmail.com", contact: "070 123 0999" },
        { id: "CO-001", name: "Nisal Wimalasooriya", email: "nisalwsy981@gmail.com", contact: "070 123 0999" },
      ],
    };
  },
  methods: {
    editSupplier(id) {
      alert(`Edit supplier: ${id}`);
    },
    deleteSupplier(id) {
      if (confirm(`Are you sure you want to delete supplier ${id}?`)) {
        this.suppliers = this.suppliers.filter((supplier) => supplier.id !== id);
      }
    },
    viewSupplier(id) {
      alert(`View supplier: ${id}`);
    },
  },
};
</script>

<!-- Tambahkan ini di index.html atau main.js -->
<!-- Font Awesome CDN -->
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
