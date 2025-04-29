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
          localStorage.setItem("token", response.data.data?.access_token);
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
