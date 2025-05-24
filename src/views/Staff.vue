<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <!-- Search Input -->
				<div class="relative w-full sm:w-48">
						<i class="fas fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
						<input
						type="text"
						placeholder="Search"
						v-model="searchQuery"
						class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-40"
						/>
				</div>
        <!-- Tambah Button -->
        <button
          @click="showAddModal = true"
          class="flex items-center gap-1 px-3 py-1.5 bg-[#1A327B] text-white rounded-lg hover:bg-blue-800 h-8 text-sm"
        >
          <i class="fas fa-user-plus text-sm"></i>
          Tambah
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white rounded-xl shadow-md overflow-x-auto hide-scrollbar">
        <table class="w-full min-w-[700px] text-sm text-center">
          <thead class="text-gray-700 mt-4">
            <tr>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">No.</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Nama</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Role</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Email</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Nomor Telepon</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-gray-800">
            <tr
              v-for="(staff, index) in paginatedStaffList"
              :key="staff.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-4 px-6">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="py-4 px-6">{{ staff.name }}</td>
              <td class="py-4 px-6">
                <span :class="getRoleBadgeClass(staff.role)" class="px-1 py-0.5 rounded text-white text-xs font-semibold">
                  {{ staff.role }}
                </span>
              </td>
              <td class="py-4 px-6">{{ staff.email }}</td>
              <td class="py-4 px-6">{{ staff.phone }}</td>
              <td class="py-4 px-6">
                <div class="flex justify-center items-center space-x-3">
                  <button @click="editStaff(staff.id)" class="text-gray-600 hover:text-blue-600 text-sm">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="confirmDeleteStaff(staff.id)" class="text-gray-600 hover:text-red-600 text-sm">
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
            class="px-3 py-1 text-xs bg-gray-200 rounded disabled:opacity-50 mr-2"
          >
            Previous
          </button>
          <span class="flex items-center text-xs mr-2">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="goToNextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Staff -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">
          {{ isEditMode ? 'Edit Staff' : 'Tambah Staff' }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold">Name</label>
            <input type="text" v-model="newStaff.name" class="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold">Role</label>
            <select v-model="newStaff.role" class="w-full px-4 py-2 border rounded bg-white">
              <option value="" disabled>Select role</option>
              <option value="admin">admin</option>
              <option value="cashier">cashier</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold">Email</label>
            <input type="email" v-model="newStaff.email" class="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold">Phone Number</label>
            <input type="tel" v-model="newStaff.phone" class="w-full px-4 py-2 border rounded" placeholder="081234567890" />
          </div>
          <div>
            <label class="block text-sm font-semibold">Password</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="newStaff.password" class="w-full px-4 py-2 border rounded pr-10" />
              <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
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
  </AppLayout>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h3 class="text-lg font-semibold mb-4 text-[#1A327B]">Konfirmasi Hapus</h3>
      <p class="mb-6">Yakin ingin menghapus staff ini?</p>
      <div class="flex justify-end space-x-4">
        <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
        <button @click="deleteStaff" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Hapus</button>
      </div>
    </div>
  </div>

  <transition name="notification-fade">
    <div v-if="notification.visible" :class="['fixed bottom-5 right-5 z-50 p-4 rounded shadow-lg text-white', notification.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
      {{ notification.message }}
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import AppLayout from "@/components/Layout.vue";

export default {
  name: "StaffPage",
  components: {
    AppLayout,
  },
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
      currentPage: 1,
      pageSize: 10,
      searchQuery: "",
      showPassword: false,
      showDeleteModal: false,
      deleteStaffId: null,
      notification: {
        visible: false,
        message: '',
        type: '', // 'success' or 'error'
  },
};
  },
  mounted() {
    this.fetchStaff();
  },
  computed: {
    filteredStaffList() {
      if (!this.searchQuery) {
        return this.staffList;
      }
      const query = this.searchQuery.toLowerCase();
      return this.staffList.filter(staff =>
        staff.name.toLowerCase().includes(query) ||
        staff.role.toLowerCase().includes(query) ||
        staff.email.toLowerCase().includes(query) ||
        (staff.phone && staff.phone.toLowerCase().includes(query))
      );
    },
    paginatedStaffList() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredStaffList.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredStaffList.length / this.pageSize);
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.visible = true;
      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    },
    getRoleBadgeClass(role) {
      if (!role) return '';
      const roleLower = role.toLowerCase();
      if (roleLower === 'admin') {
        return 'bg-green-600';
      } else if (roleLower === 'staff') {
        return 'bg-yellow-800';
      } else {
        return 'bg-gray-600';
      }
    },
    
    async fetchStaff() {
      
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          this.showNotification('No token found, please login first.', 'error');
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('https://nurulfrozen.dgeo.id/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          console.error('Received HTML instead of JSON. Probably not authenticated.');
          this.showNotification('Session expired or unauthorized. Please login again.', 'error');
          this.$router.push('/');
          return;
        }

        this.staffList = response.data.map(user => ({
          id: user.user_id,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastActive: user.updated_at,
          isOnline: false,
        }));

      } catch (error) {
        console.error('Failed to fetch staff:', error);
        this.showNotification('Gagal mengambil data staff.', 'error');
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
      if (!staff) {
        this.showNotification('Staff not found.', 'error');
        return;
      }

      this.newStaff = {
        name: staff.name,
        role: staff.role,
        email: staff.email,
        phone: staff.phone,
        password: "",
      };

      this.editStaffId = id;
      this.isEditMode = true;
      this.showAddModal = true;
    },
    confirmDeleteStaff(id) {
      this.deleteStaffId = id;
      this.showDeleteModal = true;
    },
    async deleteStaff() {
      const id = this.deleteStaffId;
      this.showDeleteModal = false;
      this.deleteStaffId = null;

      const token = localStorage.getItem('token');
      if (!token) {
        this.showNotification('No token found, please login first.', 'error');
        this.$router.push('/login');
        return;
      }

      try {
        const response = await axios.delete(`https://nurulfrozen.dgeo.id/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        console.log('Delete response:', response.data);

        this.staffList = this.staffList.filter((staff) => staff.id !== id);

        this.showNotification('Staff berhasil dihapus.', 'success');

      } catch (error) {
        console.error('Gagal menghapus staff:', error);
        this.showNotification('Gagal menghapus staff dari server.', 'error');
      }
    },
    async addStaff() {
      if (!this.newStaff.name || !this.newStaff.role || !this.newStaff.email || !this.newStaff.password) {
        this.showNotification("Semua field harus diisi.", 'error');
        return;
      }
      
      if (!this.newStaff.phone || !/^08[0-9]{8,12}$/.test(this.newStaff.phone)) {
        this.showNotification("Nomor HP wajib diisi, minimal 10 digit dan awali 08.", 'error');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        this.showNotification('No token found, please login first.', 'error');
        this.$router.push('/');
        return;
      }

      try {
        await axios.post('https://nurulfrozen.dgeo.id/api/users', {
          name: this.newStaff.name,
          role: this.newStaff.role,
          email: this.newStaff.email,
          phone: this.newStaff.phone || '',
          password: this.newStaff.password,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        this.fetchStaff();
        this.newStaff = { name: "", role: "", email: "", phone: "", password: "" };
        this.showAddModal = false;
        this.showNotification('Staff berhasil ditambahkan.', 'success');

      } catch (error) {
        console.error('Failed to create staff:', error);
        this.showNotification('Gagal menambahkan staff.', 'error');
      }
    },
    async updateStaff() {
      if (!this.newStaff.name || !this.newStaff.role || !this.newStaff.email) {
        this.showNotification("Semua field harus diisi.", 'error');
        return;
      }
      if (!this.newStaff.phone || !/^08[0-9]{8,12}$/.test(this.newStaff.phone)) {
        this.showNotification("Nomor HP wajib diisi, minimal 10 digit dan awali 08.", 'error');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        this.showNotification('No token found, please login first.', 'error');
        this.$router.push('/');
        return;
      }

      try {
        await axios.put(`https://nurulfrozen.dgeo.id/api/users/${this.editStaffId}`, {
          name: this.newStaff.name,
          role: this.newStaff.role,
          email: this.newStaff.email,
          phone: this.newStaff.phone || '',
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        this.fetchStaff();
        this.newStaff = { name: "", role: "", email: "", phone: "", password: "" };
        this.showAddModal = false;
        this.isEditMode = false;
        this.editStaffId = null;
        this.showNotification('Staff berhasil diperbarui.', 'success');

      } catch (error) {
        console.error('Failed to update staff:', error);
        this.showNotification('Gagal memperbarui staff.', 'error');
      }
    },
  },
};
</script>

<style scoped>
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
</style>
