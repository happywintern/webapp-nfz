<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <input
            v-model="email"
            type="text"
            placeholder="Email"
            class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </form>
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
        alert("Please enter both username and password.");
        return;
      }
      try {
        const response = await axios.post(
          "https://cc5w3b0r-8000.asse.devtunnels.ms/api/login",
          {
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // <--- Tambahin ini biar CORS bisa kirim token/cookie
          }
        );

        console.log("Login success:", response.data);

        // Simpan token kalau dibutuhin
        // localStorage.setItem("token", response.data.token);

        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please check your credentials.");
      }
    },
  },

};
</script>