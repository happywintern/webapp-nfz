<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
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
export default {
  name: "LoginPage", // ✅ FIX: Change component name to multi-word
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.username && this.password) {
        // Redirect to dashboard
        this.$router.push("/dashboard");
      } else {
        alert("Please enter both username and password.");
      }
    },
  },
};
</script>
