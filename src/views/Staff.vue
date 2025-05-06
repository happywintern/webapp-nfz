<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search"
              @input="searchStaff"
              class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
            />
          </div>


        <!-- Tambah Button -->
        <button
          @click="showAddModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-[#1A327B] text-white rounded-lg hover:bg-blue-800 h-[42px]"
        >
          <i class="fas fa-user-plus"></i>
          Tambah
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table class="w-full min-w-[800px] text-sm text-center">
          <thead class="text-gray-700">
            <tr>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">No.</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Name</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Role</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Email</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Phone</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Action</th>
            </tr>
          </thead>
          <tbody class="text-gray-800">
            <tr
              v-for="(staff, index) in filteredStaffList"
              :key="staff.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-4 px-6">{{ index + 1 }}</td>
              <td class="py-4 px-6">{{ staff.name }}</td>
              <td class="py-4 px-6">{{ staff.role }}</td>
              <td class="py-4 px-6">{{ staff.email }}</td>
              <td class="py-4 px-6">{{ staff.phone }}</td>
              <td class="py-4 px-6">
                <div class="flex justify-center items-center space-x-4">
                  <button @click="editStaff(staff.id)" class="text-gray-600 hover:text-blue-600">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="deleteStaff(staff.id)" class="text-gray-600 hover:text-red-600">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah/Edit Staff -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B] text-center">
          {{ isEditMode ? 'Edit Staff' : 'Tambah Staff' }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold">Name</label>
            <input
              type="text"
              v-model="newStaff.name"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold">Role</label>
            <select
              v-model="newStaff.role"
              class="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold">Email</label>
            <input
              type="email"
              v-model="newStaff.email"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold">Phone Number</label>
            <input
              type="text"
              v-model="newStaff.phone"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div v-if="!isEditMode">
            <label class="block text-sm font-semibold">Password</label>
            <input
              type="password"
              v-model="newStaff.password"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-2">
          <button @click="resetModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button
            @click="isEditMode ? updateStaff() : addStaff()"
            class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800"
          >
            {{ isEditMode ? 'Simpan Perubahan' : 'Tambah' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="showNotification" class="fixed inset-0 flex items-center justify-center z-50">
      <div :class="['p-4 rounded-lg shadow-md text-center text-sm max-w-xs w-full', notificationClass]">
        <p>{{ notificationMessage }}</p>
      </div>
    </div>

        <!-- Confirm Delete Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-lg font-semibold text-[#1A327B] text-center mb-4">Confirm Deletion</h2>
        <p class="text-center">Are you sure you want to delete this staff member?</p>
        <div class="mt-6 flex justify-center space-x-4">
          <button @click="cancelDelete" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>

  </AppLayout>
</template>

<script>
import axios from "axios";
import AppLayout from "@/components/Layout.vue";

export default {
  name: "StaffPage",
  components: { AppLayout },
  data() {
    return {
      staffList: [],
      showAddModal: false,
      isEditMode: false,
      editStaffId: null,
      newStaff: {
        name: "",
        role: "",
        email: "",
        phone: "",
        password: "",
      },
      searchQuery: "",
      showNotification: false,
      notificationMessage: "",
      notificationClass: "", // Class untuk styling notifikasi
      showDeleteConfirmation: false,
      deleteStaffId: null,
    };
  },
  mounted() {
    this.fetchStaff();
  },
  computed: {
    filteredStaffList() {
      return this.staffList.filter(staff =>
        staff.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchStaff() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No token found, please login first.');
          this.$router.push('/');
          return;
        }
        const response = await axios.get('https://nurulfrozen.dgeo.id/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        this.staffList = response.data.map(user => ({
          id: user.user_id,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        }));
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        this.showNotificationMessage('Gagal mengambil data staff.', 'error');
      }
    },
    resetModal() {
      this.newStaff = { name: "", role: "", email: "", phone: "", password: "" };
      this.showAddModal = false;
      this.isEditMode = false;
      this.editStaffId = null;
    },
    editStaff(id) {
      const staff = this.staffList.find(s => s.id === id);
      if (!staff) return alert('Staff not found.');
      this.newStaff = { name: staff.name, role: staff.role, email: staff.email, phone: staff.phone, password: "" };
      this.editStaffId = id;
      this.isEditMode = true;
      this.showAddModal = true;
    },
    async deleteStaff(id) {
      this.deleteStaffId = id;
      this.showDeleteConfirmation = true;
    },
    cancelDelete() {
      this.showDeleteConfirmation = false;
      this.deleteStaffId = null;
    },
    async confirmDelete() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login first.');
        this.$router.push('/login');
        return;
      }
      try {
        await axios.delete(`https://nurulfrozen.dgeo.id/api/users/${this.deleteStaffId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.staffList = this.staffList.filter(s => s.id !== this.deleteStaffId);
        this.showDeleteConfirmation = false;
        this.showNotificationMessage('Staff berhasil dihapus.', 'success');
      } catch (error) {
        console.error('Gagal menghapus staff:', error);
        this.showDeleteConfirmation = false;
        this.showNotificationMessage('Gagal menghapus staff dari server.', 'error');
      }
    },
    async addStaff() {
      if (!this.newStaff.name || !this.newStaff.role || !this.newStaff.email) {
        return this.showNotificationMessage("Semua field harus diisi.", "error");
      }
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login first.');
        this.$router.push('/');
        return;
      }
      const data = {
        name: this.newStaff.name,
        role: this.newStaff.role,
        email: this.newStaff.email,
        phone: this.newStaff.phone || '',
        password: this.newStaff.password,
      };

      try {
        await axios.post('https://nurulfrozen.dgeo.id/api/users', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        this.showAddModal = false;
        this.fetchStaff();
        this.showNotificationMessage("Staff berhasil ditambahkan.", "success");
      } catch (error) {
        console.error("Failed to add staff:", error);
        this.showNotificationMessage("Gagal menambahkan staff.", "error");
      }
    },
    async updateStaff() {
      if (!this.newStaff.name || !this.newStaff.role || !this.newStaff.email) {
        return this.showNotificationMessage("Semua field harus diisi.", "error");
      }
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login first.');
        this.$router.push('/');
        return;
      }
      const data = {
        name: this.newStaff.name,
        role: this.newStaff.role,
        email: this.newStaff.email,
        phone: this.newStaff.phone || '',
      };

      try {
        await axios.put(`https://nurulfrozen.dgeo.id/api/users/${this.editStaffId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        this.showAddModal = false;
        this.fetchStaff();
        this.showNotificationMessage("Staff berhasil diperbarui.", "success");
      } catch (error) {
        console.error("Failed to update staff:", error);
        this.showNotificationMessage("Gagal memperbarui staff.", "error");
      }
    },
    showNotificationMessage(message, type) {
      this.notificationMessage = message;
      this.notificationClass = type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white";
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },
    searchStaff() {
      // Search is done in the computed property filteredStaffList.
    },
  },
};
</script>
