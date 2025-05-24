import { defineStore } from 'pinia';

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    cart: [],
    isPaying: false,
    buyerName: '',
    phoneNumber: '',
    latitude: null,
    longitude: null,
    selectedAddress: '',
    deliveryMethod: 'langsung',
    paymentMethod: '',
  }),
  actions: {
    resetState() {
      this.cart = [];
      this.isPaying = false;
      this.buyerName = '';
      this.phoneNumber = '';
      this.latitude = null;
      this.longitude = null;
      this.selectedAddress = '';
      this.deliveryMethod = 'langsung';
      this.paymentMethod = '';
    }
  }
});