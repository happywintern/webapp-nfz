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
            <label class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <div class="relative">
              <input
                v-model="email"
                type="text"
                placeholder="Masukan Email Anda"
                class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A327B] pl-10"
                required
              />
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A327B] pl-10"
                required
              />
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i class="fas fa-lock"></i>
              </span>
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="rememberMe"
                class="form-checkbox h-4 w-4 text-[#1A327B] rounded border-gray-300 focus:ring-[#1A327B]"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <p 
              class="text-sm text-[#1A327B] hover:text-blue-800 cursor-pointer" 
              @click="$router.push('/forgot-password')"
            >
              Forgot Password?
            </p>
          </div>
          <button
            type="submit"
            class="w-full bg-[#1A327B] text-white p-3 rounded-xl hover:bg-opacity-90 transition duration-300 flex items-center justify-center space-x-2"
          >
            <i class="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </button>
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
      showPassword: false,
      rememberMe: false
    };
  },

  mounted() {
    // Check if there are saved credentials
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
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
          localStorage.setItem("user_id", user.user_id);
          localStorage.setItem("username", user.nama || user.name || "");
          localStorage.setItem("role", user.role?.toLowerCase() || "");

          // Save email if remember me is checked
          if (this.rememberMe) {
            localStorage.setItem('savedEmail', this.email);
          } else {
            localStorage.removeItem('savedEmail');
          }

          // Redirect based on role
          if (user.role?.toLowerCase() === 'cashier') {
            this.$router.push("/kasir");
          } else {
            this.$router.push("/dashboard");
          }
        } else {
          alert("Login succeeded but no token received.");
        }
      } catch (error) {
        console.error("Login failed:", error);

        if (error.response) {
          console.error("Server response:", error.response.data);
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

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.form-checkbox {
  appearance: none;
  padding: 0;
  print-color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  color: #1A327B;
  background-color: #fff;
  border-color: #d1d5db;
  border-width: 1px;
  border-radius: 0.25rem;
}

.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.form-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(26, 50, 123, 0.25);
}
</style>
