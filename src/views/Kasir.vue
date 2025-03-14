<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar (Same as Dashboard) -->
    <div 
      :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
      class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 border-r"
    >
      <div class="p-6 flex items-center border-b">
        <img :src="logo" alt="Logo" class="h-8 mr-2">
        <span class="text-xl font-bold text-blue-700">NFZ</span>
      </div>

      <ul class="mt-4 space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <router-link 
            :to="item.link" 
            class="flex items-center px-6 py-3 space-x-3 rounded-lg transition"
            :class="{'bg-blue-700 text-white': activeMenu === item.name, 'hover:bg-gray-100 text-gray-700': activeMenu !== item.name}"
            @click="setActiveMenu(item.name)"
          >
            <component :is="item.icon" class="w-5 h-5" :class="{'text-white': activeMenu === item.name, 'text-gray-500': activeMenu !== item.name}"/>
            <span class="font-medium">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex p-6">
      <!-- Left Side: Product List -->
      <div class="w-2/3 pr-4">
        <div class="flex items-center justify-between mb-4">
          <select class="border p-2 rounded">
            <option>Daging</option>
            <option>Sayur</option>
            <option>Minuman</option>
          </select>
          <input type="text" placeholder="Search" class="border p-2 rounded w-1/3">
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div 
            v-for="product in products" :key="product.id"
            class="bg-white p-4 rounded-lg shadow-lg cursor-pointer"
            @click="addToCart(product)"
          >
            <img :src="product.image" alt="Product Image" class="w-full h-28 object-cover">
            <h3 class="mt-2 font-semibold">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm">{{ product.weight }}</p>
            <p class="text-blue-600 font-bold">Rp{{ product.price.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Right Side: Shopping Cart / Order Summary -->
      <div class="w-1/3 bg-white p-4 rounded-lg shadow-lg">
        <h2 class="font-bold text-lg flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M3 8h18M3 13h18M3 18h18"></path>
          </svg>
          Order Menu
        </h2>

        <div v-if="cart.length === 0" class="text-gray-500 mt-4">Your cart is empty</div>

        <!-- If Pay Button is Pressed, Show Order Summary -->
        <div v-else-if="isPaying">
          <button @click="isPaying = false" class="flex items-center text-gray-600 font-semibold mb-4">
            ← Kembali
          </button>

          <div v-for="(item, index) in cart" :key="index" class="flex justify-between p-2 border-b">
          <div>
            <h4 class="font-semibold">{{ item.name }}</h4>
            <p class="text-gray-500 text-sm">{{ item.qty }} x Rp{{ item.price.toLocaleString() }}</p>
          </div>
          <!--  Dynamically update the total price per item -->
          <p class="font-semibold">Rp{{ (item.price * item.qty).toLocaleString() }}</p>
        </div>

          <!-- Payment and Delivery Options -->
          <div class="mt-4">
            <label class="block text-sm font-semibold">Metode Pembayaran</label>
            <select v-model="paymentMethod" class="border p-2 rounded w-full">
              <option>Cash</option>
              <option>QR</option>
              <option>Credit Card</option>
            </select>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-semibold">Metode Pick Up</label>
            <select v-model="deliveryMethod" class="border p-2 rounded w-full">
              <option value="pickup">Ambil Sendiri</option>
            <option value="delivery">Diantar</option>
            </select>

          </div>

          <div class="flex justify-between items-center mt-6 border-t pt-4">
            <h3 class="font-bold text-lg">Total</h3>
            <h3 class="font-bold text-lg">Rp{{ totalPrice.toLocaleString() }}</h3>
          </div>

          <button @click="proceedToNextStep" class="w-full bg-blue-700 text-white py-2 rounded mt-4">Check Out</button>
        </div>

        <!-- Default Shopping Cart View -->
        <div v-else>
          <div v-for="(item, index) in cart" :key="index" class="flex items-center justify-between p-2 border-b">
            <div class="flex items-center">
              <img :src="item.image" alt="Product" class="w-12 h-12">
              <div class="ml-3">
                <h4 class="font-semibold">{{ item.name }}</h4>
                <p class="text-gray-500 text-sm">Rp{{ item.price.toLocaleString() }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <button @click="decreaseQty(index)" class="px-2 py-1 bg-gray-200 rounded">-</button>
              <span class="mx-2">{{ item.qty }}</span>
              <button @click="increaseQty(index)" class="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>

          <div class="flex justify-between items-center mt-6 border-t pt-4">
            <h3 class="font-bold text-lg">Rp{{ totalPrice.toLocaleString() }}</h3>
            <button @click="isPaying = true" class="bg-blue-700 text-white px-4 py-2 rounded">Bayar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import logoImage from "@/assets/image.png";
import { useRouter } from "vue-router"; // Import Vue Router


export default {
  name: "KasirPage",
  setup() {
    const router = useRouter();
    const isSidebarOpen = ref(false);
    const isPaying = ref(false);
    const paymentMethod = ref("Cash");
    const deliveryMethod = ref("Ambil Sendiri");

    const cart = ref([]);

    const products = ref([
      { id: 1, name: "Nuget Kanzler", weight: "450g", price: 20000, image: "/images/nuget.png" },
      { id: 2, name: "Sosis Kanzler", weight: "450g", price: 18000, image: "/images/sosis.png" },
    ]);

    const addToCart = (product) => {
      const existingItem = cart.value.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.qty++;
      } else {
        cart.value.push({ ...product, qty: 1 });
      }
    };

    // Function to increase quantity
    const increaseQty = (index) => {
      if (cart.value[index]) {
        cart.value[index].qty++;
      }
    };

    // Function to decrease quantity
    const decreaseQty = (index) => {
      if (cart.value[index].qty > 1) {
        cart.value[index].qty--;
      } else {
        cart.value.splice(index, 1); // Remove item if quantity is 0
      }
    };

    const totalPrice = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0);
    });

    const proceedToNextStep = () => {
      if (deliveryMethod.value === "delivery") {
        router.push("/select-address"); // Redirect to Address Selection
      } else {
        router.push("/payment"); // Redirect to Payment Page
      }
    };

    return {
      isSidebarOpen,
      isPaying,
      paymentMethod,
      deliveryMethod,
      cart,
      products,
      addToCart,
      totalPrice,
      logo: logoImage,
      proceedToNextStep,
      decreaseQty,
      increaseQty
    };
  },
};
</script>
