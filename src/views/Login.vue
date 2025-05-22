<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="flex bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl w-full">
      <div class="w-full md:w-1/2 p-10">
        <div class="flex justify-center mb-4">
          <div class="bg-[#1A327B] bg-opacity-10 text-[#1A327B] p-4 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z">
              </path>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-center mb-1 text-[#1A327B]">Nurul Frozen Food</h2>
        <p class="text-center text-gray-500 mb-6">Silakan masuk untuk melanjutkan</p>

        <form @submit.prevent="login">
          <div class="mb-4">
            <input
              v-model="email"
              type="text"
              placeholder="Masukan Email Anda"
              class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A327B]"
              required
            />
          </div>
          <div class="mb-4">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A327B]"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-[#1A327B] text-white p-3 rounded-xl hover:bg-opacity-90 transition duration-300"
          >
            Login
          </button>
          <p class="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline" @click="$router.push('/forgot-password')">
            Forgot Password?
          </p>
        </form>
      </div>

      <div class="hidden md:block md:w-1/2 bg-gray-50 flex items-center justify-center">
        <img :src="require('@/assets/frozen-food.jpg')" alt="Logo" class="h-full w-full object-cover rounded-r-xl" />

      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "LoginPage",

  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    async login() {
      if (!this.email || !this.password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        console.log("Sending credentials:", {
          email: this.email,
          password: this.password,
        });

        const response = await axios.post(
          'https://nurulfrozen.dgeo.id/api/login',           
          {
        email: this.email,
        password: this.password
      },

          {
            headers: {
              "Content-Type": "application/json",
              // Optional: Add Accept header if your backend expects it
              "Accept": "application/json",
            },
          }
        );

        console.log("Login success:", response.data);

        if (response.data && response.data.data?.access_token) {
          const token = response.data.data.access_token;
          const user = response.data.data.user;

  // Store token and user info
          localStorage.setItem("token", token);
          localStorage.setItem("user_id", user.user_id); // 👈 Save user_id
          localStorage.setItem("username", user.nama || user.name || ""); // 👈 Save username from user object
          this.$router.push("/dashboard");
        } else {
          alert("Login succeeded but no token received.");
        }
      } catch (error) {
        console.error("Login failed:", error);

        if (error.response) {
          // Log backend message (if any)
          console.error("Server response:", error.response.data);

          // Show exact message from backend if available
          alert(error.response?.data.message || "Invalid credentials.");
        } else {
          alert("Unable to connect to server.");
        }
      }
    },

    async fetchData() {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in.");
        return;
      }

      try {
        const response = await axios.get(
          "https://7501-2404-c0-5c60-00-1dc0-b852.ngrok-free.app",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        console.log("Data fetched:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    },
  },
};
</script>
