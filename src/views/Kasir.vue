<template>
	<AppLayout>
		<div class="p-6 h-[calc(100vh-3rem)] overflow-hidden">
			<div class="flex h-full">
				<!-- LEFT: Product List -->
				<div class="w-2/3 pr-4 overflow-y-auto">
					<!-- Filter & Search -->
						<div class="flex items-center justify-between mb-4 gap-4">
						<select
							v-model="selectedCategory"
							class="border border-[#1A327B] text-black font-semibold px-3 py-2 rounded-lg w-1/6 min-w-[110px]"
						>
							<option value="all">Semua Kategori</option>
							<option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
						</select>
						<div class="relative" style="width:220px;max-width:100%;">
							<i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search"
								class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
							/>
						</div>
					</div>

					<!-- Product Grid -->
					<div class="grid grid-cols-3 gap-4">
						<div
							v-for="product in filteredProducts"
							:key="product.id"
							class="relative bg-white p-4 rounded-xl shadow hover:shadow-lg border border-gray-100 transition"
							:class="{
								'cursor-pointer': product.available_stock > 0,
								'cursor-not-allowed opacity-60': product.available_stock <= 0
							}"
							@click="product.available_stock > 0 && addToCart(product)"
						>
							<img
								:src="product.image ? 'https://nurulfrozen.dgeo.id' + product.image : fallbackImage"
								alt="Product Image"
								class="w-full h-28 object-contain"
							/>
							<h3 class="mt-2 font-semibold text-sm text-center text-gray-800">{{ product.name }}</h3>
							<p class="text-gray-500 text-xs text-center">{{ product.weight }}</p>
							<p class="text-[#1A327B] font-bold text-center">Rp{{ product.price.toLocaleString() }}</p>
							<div 
								v-if="product.available_stock <= 0" 
								class="absolute inset-0 bg-gray-100 bg-opacity-60 flex items-center justify-center rounded-xl"
							>
								<span class="text-red-600 font-semibold text-sm">Stok Habis</span>
							</div>
						</div>
					</div>

				</div>

				<!-- RIGHT: Cart / Payment Summary -->
				<div class="w-1/3 bg-white p-4 rounded-xl shadow border border-[#1A327B] flex flex-col h-full">
					<template v-if="!isPaying">
						<h2 class="font-bold text-lg flex items-center justify-between text-black border-b pb-2 mb-4">
							<div class="flex items-center">
								<svg
									class="w-6 h-6 mr-2 text-[#1A327B]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 3h18M3 8h18M3 13h18M3 18h18"
									/>
								</svg>
								Produk Dipesan
							</div>
							<button 
								v-if="cart.length > 0"
								@click="clearCart"
								class="text-sm text-red-600 hover:text-red-700 font-medium"
							>
								Clear
							</button>
						</h2>

						<div class="overflow-y-auto flex-1 pr-1">
							<div
								v-if="cart.length === 0"
								class="text-gray-500 mt-4"
							>Your cart is empty</div>
							<div v-else>
								<div
									v-for="(item, index) in cart"
									:key="index"
									class="flex items-center justify-between p-2 border rounded-lg border-[#1A327B] mb-3"
								>
									<div class="flex items-center">
										<img
											:src="item.image ? 'https://nurulfrozen.dgeo.id' + item.image : fallbackImage"
											alt="Product"
											class="w-12 h-12 object-cover rounded"
										/>
										<div class="ml-3">
											<h4 class="font-semibold text-sm text-gray-800">{{ item.name }}</h4>
											<p class="text-gray-500 text-sm">Rp. {{ item.price?.toLocaleString() ?? '0' }}</p>

										</div>
									</div>
									<div class="flex items-center">
										<button
											@click="decreaseQty(index)"
											class="px-3 py-1 bg-[#1A327B]/10 text-[#1A327B] rounded font-bold"
										>-</button>
										<span class="mx-2 font-semibold">{{ item.qty }}</span>
										<button
											@click="increaseQty(index)"
											class="px-3 py-1 bg-[#1A327B]/10 text-[#1A327B] rounded font-bold"
										>+</button>
									</div>
								</div>
							</div>
						</div>

						<div class="border-t pt-4 mt-4">
							<button
								@click="isPaying = true"
								:disabled="isCartEmpty"
								class="bg-[#1A327B] text-white w-full py-3 rounded-2xl font-semibold shadow flex justify-between items-center px-4 disabled:opacity-50"
							>
								<span>Buat Pesanan</span>
								<span>Rp{{ totalPrice?.toLocaleString() ?? '0' }}</span>
							</button>
						</div>
					</template>

					<!-- Payment Summary -->
					<template v-else>
						<h2 class="font-bold text-lg flex items-center text-black border-b pb-2 mb-4">
							<button
								@click="isPaying = false"
								class="rounded-full bg-gray-100 p-1 mr-2 shadow text-black hover:bg-gray-200"
							>
								<svg
									class="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
							Kembali
						</h2>

						<div class="flex flex-col gap-4 flex-1 overflow-y-auto">
							<div
								v-for="item in cart"
								:key="item.id"
								class="flex justify-between text-sm text-black border-b pb-2"
							>
								<div>
									<div class="font-semibold">{{ item.name }}</div>
									<div class="text-gray-500">{{ item.qty }} x {{ item.price.toLocaleString() }}</div>
								</div>
								<div>Rp{{ (item.price * item.qty).toLocaleString() }}</div>
							</div>

							<!-- Metode Pembayaran -->
							<div>
								<label class="block text-gray-700 text-sm mb-1">Metode Pembayaran</label>
								<select
									v-model="selectedPaymentMethod"
									class="w-full border px-3 py-2 rounded-lg font-semibold focus:ring-[#1A327B]"
								>
									<option value="">Pilih metode pembayaran</option>
									<option v-for="method in paymentMethods" :key="method.value" :value="method.value.toLowerCase()">
										{{ method.label }}
									</option>
								</select>
							</div>

							<!-- Metode Pickup -->
							<div>
								<label class="block text-gray-700 text-sm mb-1">Metode Pick Up</label>
								<select
									v-model="deliveryMethod"
									@change="handleDeliveryChange"
									class="w-full border px-3 py-2 rounded-lg font-semibold focus:ring-[#1A327B]"
								>
									<option v-for="method in pickupMethods" :key="method.value" :value="method.value.toLowerCase()">
										{{ method.label }}
									</option>
								</select>
								<div
									v-if="deliveryMethod === 'delivery' && selectedAddress"
									class="text-sm text-gray-600 mt-1"
								>
									{{ selectedAddress }}
								</div>
							</div>

							<div class="flex justify-between font-semibold border-t pt-2">
								<span>Total</span>
								<span>Rp{{ totalPrice?.toLocaleString() ?? '0' }}</span>
							</div>
						</div>

						<button
							@click="confirmPayment"
							class="bg-[#1A327B] text-white w-full py-3 rounded-2xl font-semibold shadow mt-4"
						>
							Bayar
						</button>
					</template>
				</div>
			</div>

			<!-- POPUP: Cash -->
			<div
				v-if="showCashPopup"
				class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
			>
				<div class="bg-white p-6 rounded-xl shadow w-96">
					<h3 class="text-lg font-bold mb-4">Pembayaran Cash</h3>
					<label class="block text-sm mb-1">Uang Diterima:</label>
					<input
						v-model.number="receivedCash"
						type="number"
						class="w-full border px-3 py-2 rounded-lg mb-4 focus:ring-[#1A327B]"
					/>
					<p
						v-if="receivedCash >= totalPrice"
						class="text-sm text-green-600 font-semibold"
					>
						Kembalian: Rp{{ (receivedCash - totalPrice)?.toLocaleString() ?? '0' }}
					</p>
					<p
						v-else
						class="text-sm text-red-500"
					>Uang tidak cukup</p>
					<button
						@click="finishCashPayment"
						:disabled="receivedCash < totalPrice"
						class="mt-4 bg-[#1A327B] text-white w-full py-2 rounded-lg font-semibold shadow disabled:opacity-50"
					>
						Selesai
					</button>
				</div>
			</div>

			<!-- POPUP: QRIS -->
			<div
				v-if="showQRPopup"
				class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
			>
				<div class="bg-white p-6 rounded-xl shadow w-96 text-center">
					<h3 class="text-lg font-bold mb-4">Scan QRIS</h3>
					<img
						:src="qris"
						alt="QRIS"
						class="w-64 mx-auto mb-4"
					/>
					<button
						@click="finishQRPayment"
						class="mt-2 bg-[#1A327B] text-white w-full py-2 rounded-lg font-semibold shadow"
					>
						Selesai
					</button>
				</div>
			</div>

			<!-- POPUP: QRIS Done -->
			<div
				v-if="showQRDone"
				class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
			>
				<div class="bg-white p-6 rounded-xl shadow w-96 text-center">
					<h3 class="text-lg font-bold mb-2 text-green-600">Pembayaran QRIS Berhasil!</h3>
					<p class="text-sm mb-4 text-gray-700">Terima kasih, pembayaran telah diterima.</p>
					<button
						@click="resetCart"
						class="mt-2 bg-[#1A327B] text-white w-full py-2 rounded-lg font-semibold shadow"
					>
						Tutup
					</button>
				</div>
			</div>

			<!-- POPUP: Cash Done -->
			<div
				v-if="showCashDone"
				class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
			>
				<div class="bg-white p-6 rounded-xl shadow w-96 text-center">
					<h3 class="text-lg font-bold mb-2 text-green-600">Pembayaran Cash Berhasil!</h3>
					<p class="text-sm mb-4 text-gray-700">Terima kasih, pembayaran telah diterima.</p>
					<button
						@click="resetCart"
						class="mt-2 bg-[#1A327B] text-white w-full py-2 rounded-lg font-semibold shadow"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	</AppLayout>
</template>
<script>
import AppLayout from "@/components/Layout.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCheckoutStore } from "./checkout.js";
import { storeToRefs } from "pinia";
import qrisImage from "@/assets/qris.png";

export default {
	name: "KasirPage",
	components: { AppLayout },
	setup() {
		const router = useRouter();
		const selectedPaymentMethod = ref("");
		const selectedDistribution = ref("NFZ");
		const qris = qrisImage;

		// Update the template section for payment method
		const paymentMethods = [
			{ value: "cash", label: "Cash" },
			{ value: "transfer", label: "QRIS" }
		];

		// Update the template section for delivery method
		const pickupMethods = [
			{ value: "langsung", label: "Ambil Sendiri" },
			{ value: "delivery", label: "Diantar" }
		];

		const showCashPopup = ref(false);
		const showCashDone = ref(false);
		const showQRPopup = ref(false);
		const showQRDone = ref(false);
		const receivedCash = ref(0);

		const products = ref([]);
		const buyerName = ref("");
		const phoneNumber = ref("");
		const latitude = ref(null);
		const longitude = ref(null);

		const checkout = useCheckoutStore();
		const { isPaying, deliveryMethod, selectedAddress } = storeToRefs(checkout);
		const searchQuery = ref("");
		const selectedCategory = ref("all");
		const categories = [
			'Makanan Basah',
			'Makanan Kering',
			'Sayur - Sayuran',
			'Minuman'
		];
		const filteredProducts = computed(() => {
			return products.value.filter((product) => {
				const matchCategory =
					selectedCategory.value === 'all' ||
					product.category === selectedCategory.value;
				const matchSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
				return matchCategory && matchSearch;
			});
		});
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					"https://nurulfrozen.dgeo.id/api/products",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);

				console.log("Full API response:", response);

				// Map the API response to match frontend usage
				products.value = response.data.data.map((item) => ({
					id: item.product_id,
					name: item.product_name,
					image: item.image,
					category: item.description || 'Uncategorized',
					price: parseFloat(item.price),
					available_stock: item.available_stock,
				}));
			} catch (error) {
				console.error(error);
			}
		};

		onMounted(() => {
			fetchProducts();
		});

		const addToCart = (product) => {
			// Don't add if stock is 0
			if (product.available_stock <= 0) {
				return;
			}

			// Create a new cart if it doesn't exist
			if (!checkout.cart) {
				checkout.cart = [];
			}

			const existing = checkout.cart.find((item) => item.id === product.id);

			if (existing) {
				// Check if adding one more would exceed available stock
				if (existing.qty >= product.available_stock) {
					alert('Stok tidak mencukupi');
					return;
				}
				existing.qty++;
			} else {
				const newItem = {
					...product,
					product_id: product.id,
					qty: 1,
					price: parseFloat(product.price) || 0,
					name: product.name,
					image: product.image,
				};
				checkout.cart.push(newItem);
			}

			// Force reactivity update
			checkout.cart = [...checkout.cart];
		};

		const increaseQty = (index) => {
			if (checkout.cart[index]) checkout.cart[index].qty++;
		};

		const decreaseQty = (index) => {
			if (checkout.cart[index] && checkout.cart[index].qty > 1) {
				checkout.cart[index].qty--;
			} else {
				checkout.cart.splice(index, 1);
			}
		};

		const totalPrice = computed(() => {
			if (!checkout.cart || checkout.cart.length === 0) return 0;
			return checkout.cart.reduce((sum, item) => {
				const qty = parseInt(item.qty) || 0;
				const price = parseFloat(item.price) || 0;
				return sum + qty * price;
			}, 0);
		});

		// Initialize payment method from store if exists
		if (checkout.paymentMethod) {
			selectedPaymentMethod.value = checkout.paymentMethod;
		}

		// Watch for payment method changes and save to store
		watch(selectedPaymentMethod, (newValue) => {
			checkout.paymentMethod = newValue;
		});

		const handleDeliveryChange = () => {
			if (deliveryMethod.value === "delivery") {
				if (
					!checkout.buyerName ||
					!checkout.phoneNumber ||
					!checkout.latitude ||
					!checkout.longitude
				) {
					// Save current payment method before navigation
					checkout.paymentMethod = selectedPaymentMethod.value;
					// If any required field is missing, go to address selection
					router.push("/select-address");
				} else {
					// If address already filled, update local refs
					selectedAddress.value = checkout.selectedAddress;
					buyerName.value = checkout.buyerName;
					phoneNumber.value = checkout.phoneNumber;
					latitude.value = checkout.latitude;
					longitude.value = checkout.longitude;
					isPaying.value = true;
				}
			}
		};

		const confirmPayment = async () => {
			console.log("Cart length at confirmPayment:", checkout.cart.length);
			console.log("Full cart:", JSON.stringify(checkout.cart, null, 2));
			console.log("Selected payment method:", selectedPaymentMethod.value);

			if (deliveryMethod.value === "delivery") {
				if (
					!checkout.buyerName ||
					!checkout.phoneNumber ||
					!checkout.latitude ||
					!checkout.longitude ||
					!checkout.selectedAddress
				) {
					alert("Silakan isi semua informasi pengiriman terlebih dahulu.");
					return;
				}
			}

			if (!selectedPaymentMethod.value) {
				alert("Silakan pilih metode pembayaran.");
				return;
			}

			const payload = {
				staff_id: localStorage.getItem("user_id"),
				pickup_method: deliveryMethod.value,
				payment_method: selectedPaymentMethod.value,
				payment_status: "unpaid",
				order_status: "processing",
				distribution: selectedDistribution.value,
				items: checkout.cart.map((item) => ({
					product_id: item.product_id || item.id,
					quantity: item.qty,
					price: item.price,
					subtotal: item.price * item.qty
				})),
			};

			// Only add delivery-related fields if delivery method is selected
			if (deliveryMethod.value === "delivery") {
				payload.recipient_name = checkout.buyerName;
				payload.recipient_phone = checkout.phoneNumber;
				payload.latitude = checkout.latitude;
				payload.longitude = checkout.longitude;
				payload.address = checkout.selectedAddress;
			}

			console.log("🛒 Payload being sent:", JSON.stringify(payload, null, 2));

			try {
				const response = await axios.post(
					"https://nurulfrozen.dgeo.id/api/sales-orders",
					payload,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
							"Content-Type": "application/json",
						},
					}
				);

				console.log("Order created:", response.data);

				if (selectedPaymentMethod.value === "cash") {
					showCashPopup.value = true;
				} else {
					showQRPopup.value = true;
				}
			} catch (err) {
				console.error("Failed to create order:", err.response?.data || err);
				const errorMessage = 
					err.response?.data?.errors?.order_status?.[0] || 
					err.response?.data?.message || 
					"Gagal menyimpan pesanan. Pastikan semua field sudah diisi dengan benar.";
				alert(errorMessage);
			}
		};

		const finishCashPayment = () => {
			showCashPopup.value = false;
			showCashDone.value = true;
		};

		const finishQRPayment = () => {
			showQRPopup.value = false;
			showQRDone.value = true;
		};

		const resetCart = () => {
			// Manually reset the store state
			checkout.cart = [];
			checkout.buyerName = '';
			checkout.phoneNumber = '';
			checkout.latitude = null;
			checkout.longitude = null;
			
			// Reset local state
			isPaying.value = false;
			selectedPaymentMethod.value = "";
			deliveryMethod.value = "langsung";
			showCashPopup.value = false;
			showCashDone.value = false;
			showQRPopup.value = false;
			showQRDone.value = false;
			receivedCash.value = 0;
		};

		const clearCart = () => {
			// Manually reset the store state
			checkout.cart = [];
			checkout.buyerName = '';
			checkout.phoneNumber = '';
			checkout.latitude = null;
			checkout.longitude = null;
			
			// Reset local state
			isPaying.value = false;
			selectedPaymentMethod.value = "";
			deliveryMethod.value = "langsung";
		};

		// Add a computed property to check if cart is empty
		const isCartEmpty = computed(() => {
			return !checkout.cart || checkout.cart.length === 0;
		});

		// Update the cart display logic
		const cartItems = computed(() => {
			return checkout.cart || [];
		});

		return {
			isPaying,
			selectedPaymentMethod,
			deliveryMethod,
			selectedAddress,
			showCashPopup,
			showCashDone,
			showQRPopup,
			showQRDone,
			receivedCash,
			cartItems,
			cart: cartItems,
			products,
			addToCart,
			increaseQty,
			decreaseQty,
			totalPrice,
			confirmPayment,
			finishCashPayment,
			finishQRPayment,
			handleDeliveryChange,
			resetCart,
			searchQuery,
			categories,
			selectedCategory,
			filteredProducts,
			clearCart,
			isCartEmpty,
			paymentMethods,
			pickupMethods,
			qris,
		};
	},
};
</script>