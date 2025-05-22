import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCheckoutStore = defineStore('checkout', () => {
  const cart = ref([]);
  const deliveryMethod = ref('');
  const buyerName = ref('');
  const phoneNumber = ref('');
  const latitude = ref(null);
  const longitude = ref(null);
    const selectedAddress = ref('');
  const isPaying = ref(false); // 👈 Add this


  return {
    cart,
    deliveryMethod,
    buyerName,
    phoneNumber,
    latitude,
    longitude,
    selectedAddress,
    isPaying
  };
});