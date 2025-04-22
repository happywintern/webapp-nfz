<template>
    <AppLayout>
      <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Search & Tambah Button -->
        <div class="flex justify-between items-center mb-4">
          <!-- Search Input -->
          <div class="relative w-1/4">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              placeholder="Search"
              class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
            />
          </div>
  
          <!-- Tambah Button -->
          <button
            class="flex items-center gap-2 px-4 py-2 bg-[#1A327B] text-white rounded-lg hover:bg-blue-800"
          >
            <i class="fas fa-user-plus"></i>
            Tambah
          </button>
        </div>
  
        <!-- Table Container -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="text-left">
              <tr class="text-gray-700">
                <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">ID</th>
                <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Name</th>
                <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Role</th>
                <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Email</th>
                <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Terakhir Aktif</th>
                <th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Action</th>
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
                <td class="py-4 px-6">{{ staff.lastActive }}</td>
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
    </AppLayout>
  </template>
  
  <script>
  import AppLayout from "@/components/Layout.vue";
  
  export default {
    name: "StaffPage",
    components: {
      AppLayout,
    },
    data() {
      return {
        staffList: [
          {
            id: "CO-001",
            name: "Nisal Wimalasooriya",
            role: "Staff",
            email: "nisalwsy981@gmail.com",
            lastActive: "13 - 11 - 2023",
          },
          {
            id: "CO-001",
            name: "Nisal Wimalasooriya",
            role: "Staff",
            email: "nisalwsy981@gmail.com",
            lastActive: "13 - 11 - 2023",
          },
          {
            id: "CO-001",
            name: "Nisal Wimalasooriya",
            role: "Staff",
            email: "nisalwsy981@gmail.com",
            lastActive: "13 - 11 - 2023",
          },
          {
            id: "CO-001",
            name: "Nisal Wimalasooriya",
            role: "Staff",
            email: "nisalwsy981@gmail.com",
            lastActive: "13 - 11 - 2023",
          },
        ],
      };
    },
    methods: {
      editStaff(id) {
        alert(`Edit staff: ${id}`);
      },
      deleteStaff(id) {
        if (confirm(`Are you sure you want to delete staff ${id}?`)) {
          this.staffList = this.staffList.filter((staff) => staff.id !== id);
        }
      },
    },
  };
  </script>
  
  <!-- Font Awesome CDN -->
  <style scoped>
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
  </style>
  