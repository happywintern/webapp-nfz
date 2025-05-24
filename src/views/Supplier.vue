<template> 
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
     <!-- Search + Tambah + Export -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            placeholder="Search"
            v-model="searchQuery"
            class="pl-10 pr-4 py-2 border border-[#1A327B] text-black rounded-lg w-full"
          />
        </div>

        <!-- Buttons aligned right -->
        <div class="flex gap-2 mt-2 sm:mt-0">
          <button
            @click="exportToExcel"
            class="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 h-[42px]"
          >
            <i class="fas fa-file-excel"></i>
            Unduh Excel
          </button>

          <button
            @click="showAddModal = true"
            class="flex items-center gap-2 px-4 py-2 text-sm bg-[#1A327B] text-white rounded-lg hover:bg-blue-800 h-[42px]"
          >
            <i class="fas fa-address-book"></i>
            Tambah
          </button>
        </div>
      </div>
      <div class="bg-white rounded-xl shsadow-md overflow-x-auto hide-scrollbar mt-4">
        <table class="w-full min-w-[800px] text-sm text-center">
          <thead class="text-gray-700">
            <tr>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">No.</th>
        <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Nama</th>
        <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Kontak</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-gray-800">
            <tr
              v-for="(supplier, index) in paginatedSuppliers"
              :key="supplier.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-4 px-6">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="py-4 px-6">{{ supplier.name }}</td>
              <td class="py-4 px-6">{{ supplier.contact }}</td>
              <td class="py-4 px-6">
                <div class="flex justify-center items-center space-x-4">
                  <button @click="openEditModal(supplier)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click.prevent="deleteSupplier(supplier.id)" class="text-gray-600 hover:text-red-600">
                    <i class="fas fa-trash"></i>
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
          <label class="block text-sm font-semibold">Contact</label>
          <input type="tel" inputmode="numeric" pattern="^08[0-9]{8,12}$" v-model="newSupplier.contact" class="w-full px-4 py-2 border rounded"/>
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
              <label class="block text-sm font-semibold">No.</label>
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

    </div>
  </AppLayout>
  <!-- Delete Confirmation Modal -->
  <Transition name="fade">
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus supplier <strong>{{ supplierToDelete && supplierToDelete.name }}</strong>?</p>
        <div class="mt-6 flex justify-end space-x-2">
          <button @click.prevent="cancelDelete" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button @click.prevent="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Hapus</button>
        </div>
      </div>
    </div>
  </Transition>
  <transition name="notification-fade">
  <div
    v-if="notification.visible"
    :class="['fixed bottom-5 right-5 z-50 p-4 rounded shadow-lg text-white',
             notification.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
    {{ notification.message }}
  </div>
</transition>

</template>

<script>
import AppLayout from "@/components/Layout.vue";
import { ref, computed, onMounted } from "vue";
import * as XLSX from "xlsx";

export default {
  name: "SupplierPage",
  components: { AppLayout },
  setup() {
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteConfirm = ref(false);
    const notification = ref({
      message: '',
      type: 'success',
      visible: false
    });

    const showNotification = (message, type = 'success') => {
      notification.value.message = message;
      notification.value.type = type;
      notification.value.visible = true;
      setTimeout(() => {
        notification.value.visible = false;
      }, 3000);
    };

    const suppliers = ref([]);

    // Fetch suppliers from API
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, please login first.');
          return;
        }
        
        const response = await fetch('https://nurulfrozen.dgeo.id/api/suppliers', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        suppliers.value = data.map(supplier => ({
          id: supplier.supplier_id.toString(),
          name: supplier.supplier_name || '',
          contact: supplier.phone || '',
          address: supplier.address || ''
        }));
        suppliers.value.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };

    onMounted(() => {
      fetchSuppliers();
    });

    const searchQuery = ref('');
    const currentPage = ref(1);
    const pageSize = ref(5);

    const filteredSuppliers = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return suppliers.value.filter(s =>
        (s.name || '').toLowerCase().includes(query) ||
        (s.email || '').toLowerCase().includes(query) ||
        (s.contact || '').toLowerCase().includes(query)
      );
    });


    const paginatedSuppliers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredSuppliers.value.slice(start, start + pageSize.value);
    });

    const totalPages = computed(() => Math.ceil(filteredSuppliers.value.length / pageSize.value));
    const newSupplier = ref({ name: '', contact: '' });
    const editedSupplier = ref({ id: '', name: '', email: '', contact: '' });
    const supplierToDelete = ref(null);

    const addSupplier = async () => {
    const phonePattern = /^08[0-9]{8,12}$/;

    if (!newSupplier.value.name) {
      showNotification("Nama supplier wajib diisi", 'error');
      return;
    }

    if (!newSupplier.value.contact || !phonePattern.test(newSupplier.value.contact)) {
      showNotification("Nomor HP wajib diisi, hanya angka, minimal 10 digit dan harus diawali dengan 08", 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://nurulfrozen.dgeo.id/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          supplier_name: newSupplier.value.name,
          phone: newSupplier.value.contact,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gagal menambah supplier. Status: ${response.status}`);
      }
      await fetchSuppliers();

      newSupplier.value = { name: '', contact: '' };
      showAddModal.value = false;
      showNotification("Supplier berhasil ditambahkan", 'success');
    } catch (error) {
      console.error("Error saat menambahkan supplier:", error);
      showNotification(error.message, 'error');
    }
  };



    const openEditModal = supplier => {
      editedSupplier.value = { ...supplier };
      showEditModal.value = true;
    };

    const saveSupplierEdit = () => {
      const index = suppliers.value.findIndex(s => s.id === editedSupplier.value.id);
      if (index !== -1) {
        suppliers.value[index] = { ...editedSupplier.value };
        showNotification("Data supplier berhasil disimpan", 'success');
      }
      showEditModal.value = false;
    };

    const deleteSupplier = id => {
      const supplier = suppliers.value.find(s => s.id === id);
      if (supplier) {
        supplierToDelete.value = supplier;
        showDeleteConfirm.value = true;
      }
    };

const confirmDelete = async () => {
  if (!supplierToDelete.value) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification("Token tidak ditemukan. Harap login ulang.", 'error');
      return;
    }

    const response = await fetch(`https://nurulfrozen.dgeo.id/api/suppliers/${supplierToDelete.value.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Gagal menghapus supplier. Status: ${response.status}`);
        }

        suppliers.value = suppliers.value.filter(s => s.id !== supplierToDelete.value.id);
        showNotification("Supplier berhasil dihapus", 'success');
      } catch (error) {
        console.error("Error saat menghapus supplier:", error);
        showNotification("Gagal menghapus supplier", 'error');
      } finally {
        supplierToDelete.value = null;
        showDeleteConfirm.value = false;
      }
    };


    const cancelDelete = () => {
      supplierToDelete.value = null;
      showDeleteConfirm.value = false;
    };

    const goToPreviousPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(filteredSuppliers.value.map(s => ({
        ID: s.id, Nama: s.name, Email: s.email, Contact: s.contact,
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');
      XLSX.writeFile(workbook, 'suppliers.xlsx');
    };

    return {
      notification,
      showNotification,
      showAddModal,
      showEditModal,
      showDeleteConfirm,
      supplierToDelete,
      suppliers,
      searchQuery,
      paginatedSuppliers,
      totalPages,
      currentPage,
      pageSize,
      newSupplier,
      editedSupplier,
      addSupplier,
      openEditModal,
      saveSupplierEdit,
      deleteSupplier,
      confirmDelete,
      cancelDelete,
      goToPreviousPage,
      goToNextPage,
      exportToExcel
    };
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
