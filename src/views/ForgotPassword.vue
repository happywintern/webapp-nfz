<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-4 text-[#1A327B]">Forgot Password</h2>
      <p class="text-center text-gray-600 mb-6">
        You must verify your account via the email sent to you to reset your password.
      </p>
      <form @submit.prevent="submitEmail">
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A327B]"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-[#1A327B] text-white p-3 rounded-xl hover:bg-opacity-90 transition duration-300"
        >
          Send Reset Link
        </button>
      </form>
      <p v-if="message" class="mt-4 text-center text-green-600">{{ message }}</p>
    </div>


    <transition name="notification-fade">
      <div v-if="showModal" class="fixed top-5 right-5 z-50">
        <div class="bg-white rounded-lg p-4 max-w-xs w-full shadow-lg flex items-center space-x-4 border border-green-400">
          <svg class="w-10 h-10 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold mb-1">Email Sent</h3>
            <p class="text-sm">A password reset link has been sent to your email.</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.notification-fade-enter-active, .notification-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.notification-fade-enter-from, .notification-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

<script>
export default {
  name: "ForgotPasswordPage",
  data() {
    return {
      email: "",
      message: "",
      showModal: false
    };
  },
  methods: {
    submitEmail() {
      if (this.email) {
        this.message = `If an account with email ${this.email} exists, a reset link has been sent. Please check your email.`;
        this.showModal = true;
        setTimeout(() => {
          this.showModal = false;
        }, 2000);
      }
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>
