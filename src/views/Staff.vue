<template>
  <AppLayout>
    <div class="p-6 bg-gray-100 min-h-screen">
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
              v-for="staff in staffList"
              :key="staff.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-4 px-6">{{ staff.id }}</td>
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

    <!-- Modal Tambah Staff -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-[#1A327B]">
  {{ isEditMode ? 'Edit Staff' : 'Tambah Staff' }}
</h2>        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold">Name</label>
            <input type="text" v-model="newStaff.name" class="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold">Role</label>
            <input type="text" v-model="newStaff.role" class="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold">Email</label>
            <input type="email" v-model="newStaff.email" class="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-semibold">Phone Number</label>
            <input type="email" v-model="newStaff.phone" class="w-full px-4 py-2 border rounded" />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-2">
          <button @click="resetModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
          <button 
  @click="isEditMode ? updateStaff() : addStaff()" 
  class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800">
  {{ isEditMode ? 'Simpan Perubahan' : 'Tambah' }}
</button>        </div>
      </div>
    </div>
  </AppLayout>
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
      },

    };
  },
  mounted() {
    this.fetchStaff();
  },
  methods: {
    async fetchStaff() {
  try {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (!token) {
      alert('No token found, please login first.');
      this.$router.push('/stok'); 
      return;
    }

    const response = await axios.get('https://nurulfrozen.dgeo.id/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json', // <-- this fixes your problem!
      },
    });

    console.log('Real API response:', response.data);

    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Received HTML instead of JSON. Probably not authenticated.');
      alert('Session expired or unauthorized. Please login again.');
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
    alert('Gagal mengambil data staff.');
  }
},

resetModal() {
      this.newStaff = { name: "", role: "", email: "", phone: "" };
      this.showAddModal = false;
      this.isEditMode = false;
      this.editStaffId = null;
    },

editStaff(id) {
  const staff = this.staffList.find(s => s.id === id);
  if (!staff) {
    alert('Staff not found.');
    return;
  }

  this.newStaff = {
    name: staff.name,
    role: staff.role,
    email: staff.email,
    phone: staff.phone
  };

  this.editStaffId = id;
  this.isEditMode = true;
  this.showAddModal = true;
},


    async deleteStaff(id) {
  if (!confirm(`Yakin ingin menghapus staff dengan ID ${id}?`)) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found, please login first.');
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

    // Hapus dari daftar lokal jika berhasil
    this.staffList = this.staffList.filter((staff) => staff.id !== id);

    alert('Staff berhasil dihapus.');

  } catch (error) {
    console.error('Gagal menghapus staff:', error);
    alert('Gagal menghapus staff dari server.');
  }
},

    getLoginStatusColor(dateString, isOnline) {
      if (isOnline) return "bg-green-200 text-green-800";

      const lastLogin = new Date(dateString);
      const today = new Date();
      const diffTime = today - lastLogin;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "bg-yellow-200 text-yellow-800";
      if (diffDays <= 3) return "bg-orange-200 text-orange-800";
      if (diffDays <= 7) return "bg-red-200 text-red-800";
      return "bg-gray-200 text-gray-800";
    },


    async addStaff() {
  if (!this.newStaff.name || !this.newStaff.role || !this.newStaff.email) {
    alert("Semua field harus diisi.");
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found, please login first.');
    this.$router.push('/');
    return;
  }

  try {
    const response = await axios.post('https://nurulfrozen.dgeo.id/api/users', {
      name: this.newStaff.name,
      role: this.newStaff.role,
      email: this.newStaff.email,
      phone: this.newStaff.phone || '', // optional field
      password: '123456', // You can change this if needed

    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('Staff created:', response.data);

    // After successful POST, fetch latest data from API
    this.fetchStaff();

    // Reset form and close modal
    this.newStaff = { name: "", role: "", email: "" };
    this.showAddModal = false;

  } catch (error) {
    console.error('Failed to create staff:', error);
    alert('Gagal menambahkan staff.');
  }
},

async updateStaff() {
  if (!this.newStaff.name || !this.newStaff.role || !this.newStaff.email) {
    alert("Semua field harus diisi.");
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found, please login first.');
    this.$router.push('/');
    return;
  }

  try {
    const response = await axios.put(`https://nurulfrozen.dgeo.id/api/users/${this.editStaffId}`, {
      name: this.newStaff.name,
      role: this.newStaff.role,
      email: this.newStaff.email,
      phone: this.newStaff.phone || '',
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('Staff updated:', response.data);

    // After successful PUT, fetch latest data
    this.fetchStaff();

    // Reset form and close modal
    this.newStaff = { name: "", role: "", email: "" };
    this.showAddModal = false;
    this.isEditMode = false;
    this.editStaffId = null;

    alert('Staff berhasil diperbarui.');

  } catch (error) {
    console.error('Failed to update staff:', error);
    alert('Gagal memperbarui staff.');
  }
},


  },
};
</script>
