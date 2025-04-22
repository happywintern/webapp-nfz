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
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">ID</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Name</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Role</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Email</th>
              <th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Last Active</th>
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
              <td class="py-4 px-6">
                <span
                  :class="['px-3 py-1 rounded-full text-sm font-semibold', getLoginStatusColor(staff.lastActive, staff.isOnline)]"
                >
                  {{ staff.isOnline ? 'Online' : staff.lastActive }}
                </span>
              </td>
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
          lastActive: "2025-04-22", // YYYY-MM-DD
          isOnline: true,
        },
        {
          id: "CO-002",
          name: "Jane Doe",
          role: "Admin",
          email: "janedoe@example.com",
          lastActive: "2025-04-21",
          isOnline: false,
        },
        {
          id: "CO-003",
          name: "Jack Smith",
          role: "Staff",
          email: "jack@example.com",
          lastActive: "2025-04-15",
          isOnline: false,
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
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
</style>
