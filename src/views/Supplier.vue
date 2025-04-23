<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
      <!-- Search + Tambah -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            placeholder="Search"
            class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
          />
        </div>

        <!-- Tambah Button -->
        <button
          @click="showAddModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-[#1A327B] text-white rounded-lg hover:bg-blue-800 h-[42px]"
        >
          <i class="fas fa-address-book"></i>
          Tambah
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table class="w-full min-w-[800px] text-sm text-center">
          <thead class="text-gray-700">
            <tr>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">ID</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Name</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Email</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Contact</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Action</th>
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
                  <button @click="openEditModal(supplier)" class="text-gray-600 hover:text-blue-600">
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

    <!-- Modal Tambah Supplier -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Tambah Supplier</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold">Name</label>
            <input type="text" v-model="newSupplier.name" class="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Email</label>
            <input type="email" v-model="newSupplier.email" class="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Contact</label>
            <input type="text" v-model="newSupplier.contact" class="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="showAddModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button @click="addSupplier" class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800">Tambah</button>
        </div>
      </div>
    </div>

    <!-- Modal Edit Supplier -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Edit Supplier</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold">ID</label>
            <input type="text" v-model="editedSupplier.id" disabled class="w-full px-4 py-2 border rounded bg-gray-100" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Name</label>
            <input type="text" v-model="editedSupplier.name" class="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Email</label>
            <input type="email" v-model="editedSupplier.email" class="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-semibold">Contact</label>
            <input type="text" v-model="editedSupplier.contact" class="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button @click="saveSupplierEdit" class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800">Simpan</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/Layout.vue";
import { ref } from "vue";

export default {
  name: "SupplierPage",
  components: {
    AppLayout,
  },
  setup() {
    const showAddModal = ref(false);
    const showEditModal = ref(false);

    const suppliers = ref([
      { id: "SUP-001", name: "Nisal Wimalasooriya", email: "nisalwsy981@gmail.com", contact: "070 123 0999" },
      { id: "SUP-002", name: "Jane Smith", email: "jane@example.com", contact: "071 456 7890" },
      { id: "SUP-003", name: "John Doe", email: "john@example.com", contact: "072 987 6543" },
      { id: "SUP-004", name: "Sarah Johnson", email: "sarah@example.com", contact: "073 321 9876" },
    ]);

    const newSupplier = ref({
      name: '',
      email: '',
      contact: ''
    });

    const editedSupplier = ref({
      id: '',
      name: '',
      email: '',
      contact: ''
    });

    const addSupplier = () => {
      if (newSupplier.value.name) {
        const lastId = suppliers.value.length
          ? Math.max(...suppliers.value.map(s => parseInt(s.id.replace('SUP-', ''))))
          : 0;
        const nextId = `SUP-${String(lastId + 1).padStart(3, '0')}`;
        const supplierToAdd = { id: nextId, ...newSupplier.value };

        suppliers.value.push(supplierToAdd);
        newSupplier.value = { name: '', email: '', contact: '' };
        showAddModal.value = false;
      } else {
        alert("Nama wajib diisi");
      }
    };

    const openEditModal = (supplier) => {
      editedSupplier.value = { ...supplier };
      showEditModal.value = true;
    };

    const saveSupplierEdit = () => {
      const index = suppliers.value.findIndex(s => s.id === editedSupplier.value.id);
      if (index !== -1) {
        suppliers.value[index] = { ...editedSupplier.value };
      }
      showEditModal.value = false;
    };

    const deleteSupplier = (id) => {
  const supplier = suppliers.value.find(s => s.id === id);
  if (confirm(`Yakin ingin menghapus supplier "${supplier.name}"?`)) {
    suppliers.value = suppliers.value.filter(s => s.id !== id);
  }
};

    return {
      showAddModal,
      showEditModal,
      suppliers,
      newSupplier,
      editedSupplier,
      addSupplier,
      openEditModal,
      saveSupplierEdit,
      deleteSupplier
    };
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
