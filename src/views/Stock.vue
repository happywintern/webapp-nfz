<template>
	<AppLayout>
		<transition name="slide-x">
			<div
				v-if="alertMessage"
				class="alert-notification"
				:class="{'border-red-500': alertType === 'error', 'border-green-500': alertType === 'success'}"
			>
				<div class="flex-1">
				<p
					class="font-bold"
					:class="{'text-red-600': alertType === 'error', 'text-green-600': alertType === 'success'}"
				>
					{{ alertTitle }}
				</p>
				<p class="text-sm text-gray-700">{{ alertMessage }}</p>
				</div>
				<button
				@click="closeAlert"
				class="text-gray-500 hover:text-gray-700 ml-4"
				style="background:none; border:none;"
				>
				<i class="fas fa-times"></i>
				</button>
			</div>
		</transition>
		<div class="p-6 bg-gray-100 min-h-screen">
			<div class="flex items-center mb-4 w-full">
				<!-- Filter & Search kiri -->
				<div class="flex items-center space-x-3">
					<select
					v-model="selectedCategory"
					class="border border-[#1A327B] text-black px-4 py-2 rounded-xl text-base w-[160px] min-w-[120px] max-w-[200px]"
					>
					<option value="all">Semua Kategori</option>
					<option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
					</select>

					<!-- Add Stock Status Filter -->
					<select
					v-model="selectedStockStatus"
					class="border border-[#1A327B] text-black px-4 py-2 rounded-xl text-base w-[160px] min-w-[120px] max-w-[200px]"
					>
					<option value="all">Semua Status</option>
					<option value="available">Tersedia</option>
					<option value="unavailable">Tidak Tersedia</option>
					</select>

					<div class="relative" style="width: 250px;">
					<i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base"></i>
					<input
						type="text"
						placeholder="Search"
						v-model="searchQuery"
						class="pl-10 pr-4 py-2 border border-[#1A327B] text-black rounded-2xl text-base w-full"
					/>
					</div>
				</div>
				<div class="flex-1"></div>
				<button
					@click="showAddModal = true"
					class="flex items-center px-5 py-2 bg-[#1A327B] hover:bg-blue-900 text-white rounded-xl transition"
					>
					Tambah
				</button>
			</div>
			<!-- Stock Table -->
			<div class="bg-white rounded-2xl shadow-lg overflow-hidden">
				<table class="w-full text-sm">
					<thead class="text-left">
						<tr class="text-gray-700">
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B] text-center">No.</th>
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Nama Produk</th>
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Foto</th>
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Kategori</th>
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Persediaan</th>
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Harga Beli</th>
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Harga Jual</th>
							<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B] text-center">Status</th>
							<th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Aksi</th>
						</tr>
					</thead>
					<tbody class="text-gray-800">
						<!-- Loading State -->
						<tr v-if="isLoading">
							<td colspan="9" class="text-center py-8">
								<div class="flex justify-center items-center">
									<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A327B]"></div>
									<span class="ml-2">Loading...</span>
								</div>
							</td>
						</tr>

						<!-- Empty State -->
						<tr v-else-if="paginatedProducts.length === 0">
							<td colspan="9" class="text-center py-8 text-gray-500">
								Tidak ada data produk yang tersedia
							</td>
						</tr>

						<!-- Product List -->
						<tr
							v-else
							v-for="(product, index) in paginatedProducts"
							:key="product.id"
							class="border-b"
						>
							<td class="py-2 px-4 text-center">{{ index + 1 }}</td>
							<td class="py-2 px-4">{{ product.name }}</td>
							<td class="py-2 px-4">
								<img
									:src="product.image"
									alt="Product Image"
									class="w-16 h-16 object-cover rounded"
									@error="$event.target.src = require('@/assets/Product.jpeg')"
								>
							</td>
							<td class="py-2 px-4">{{ product.category }}</td>
							<td class="py-2 px-4">{{ product.stock }}</td>
							<td class="py-2 px-4">Rp{{ formatRupiah(product.buyPrice) }}</td>
							<td class="py-2 px-4">Rp{{ formatRupiah(product.sellPrice) }}</td>
							<td class="py-2 px-4 text-center">
								<span
									:class="product.stock > 0 ? 'text-green-600 text-center' : 'text-red-600 text-center'"
									>
									{{ product.stock > 0 ? 'Tersedia' : 'Tidak Tersedia' }}
								</span>
							</td>
							<td class="py-2 px-6 flex space-x-2 justify-center py-2">
								<button
									@click="viewProduct(product.id)"
									class="text-gray-600 hover:text-blue-600"
								>
									<i class="fas fa-folder-open"></i>
								</button>
								<button
									@click="handleDeleteButton(product)"
									class="text-gray-600 hover:text-blue-600"
								>
									<i class="fas fa-trash"></i>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- Pagination -->
				<div v-if="!isLoading && paginatedProducts.length > 0" class="flex justify-end p-4 border-t border-gray-200">
					<button
						@click="goToPreviousPage"
						:disabled="currentPage === 1"
						class="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 mr-2"
					>
						Previous
					</button>
					<span class="flex items-center text-sm mr-2">
						Page {{ currentPage }} of {{ totalPages }}
					</span>
					<button
						@click="goToNextPage"
						:disabled="currentPage === totalPages"
						class="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>
		<!-- Edit Product Modal -->

		<div
			v-if="showEditModal"
			class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
		>
			<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
				<h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Edit Supplier</h2>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-semibold">ID</label>
						<input
							type="text"
							v-model="product.name"
							disabled
							class="w-full px-4 py-2 border rounded bg-gray-100"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Name</label>
						<input
							type="text"
							v-model="product.category "
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Email</label>
						<input
							type="email"
							v-model="editedSupplier.email"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Contact</label>
						<input
							type="text"
							v-model="editedSupplier.contact"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>
				</div>

				<div class="mt-6 flex justify-end space-x-2">
					<button
						@click="showEditModal = false"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>Batal</button>
					<button
						@click="saveSupplierEdit"
						class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800"
					>Simpan</button>
				</div>
			</div>
		</div>

		<!-- Modal Tambah Product -->
		<div
			v-if="showAddModal"
			class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
			>
			<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
				<h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Tambah Produk</h2>

				<div class="space-y-4">
				<div>
					<label class="block text-sm font-semibold">Nama</label>
					<input
					type="text"
					v-model="newProduct.name"
					class="w-full px-4 py-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-semibold">Kategori</label>
					<select v-model="newProduct.category" class="w-full px-4 py-2 border rounded">
					<option disabled value="">Pilih Kategori</option>
					<option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-semibold">Harga</label>
					<input
					type="text"
					v-model="newProduct.sellPrice"
					class="w-full px-4 py-2 border rounded"
					/>
				</div>
				</div>

				<div>
				<label class="block text-sm font-semibold mt-7">Gambar</label>
				<input
					type="file"
					@change="handleImageUpload"
					class="w-full py-2"
				/>
				</div>
				<div class="mt-6 flex justify-end space-x-2">
				<button
					@click="showAddModal = false"
					class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
				>Batal</button>
				<button
					@click="addProduct"
					class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800"
				>Tambah</button>
				</div>
			</div>
			</div>

		<div
			v-if="showDeleteModal"
			class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
		>
			<div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
				<h2 class="text-lg font-semibold text-red-600">Konfirmasi Hapus</h2>
				<p class="mt-2">Apakah kamu yakin ingin menghapus produk ini?</p>
				<div class="mt-4 flex justify-end space-x-2">
					<button
						@click="closeDeleteModal"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>Batal</button>
					<button
						@click="confirmDelete"
						class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
					>Hapus</button>
				</div>
			</div>
		</div>

	</AppLayout>

</template>
  
<script>
import { ref, computed, onMounted, watch } from "vue";
import logoImage from "@/assets/image.png";
import {
	HomeIcon,
	ShoppingCartIcon,
	BanknotesIcon,
	CubeIcon,
	StarIcon,
} from "@heroicons/vue/24/solid";
import AppLayout from "@/components/Layout.vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
	name: "StockPage",
	components: {
		AppLayout,
	},
	setup() {
		const router = useRouter();
		const isSidebarOpen = ref(false);
		const activeMenu = ref("Stock");
		const logo = logoImage;
		const selectedCategory = ref("all");
		const selectedStockStatus = ref("all");
		const searchQuery = ref("");
		const isLoading = ref(false);
		const categories = [
			'Makanan Basah',
			'Makanan Kering',
			'Sayur - Sayuran',
			'Minuman'
		]
		const filteredProducts = computed(() => {
			return products.value.filter((product) => {
				const matchCategory = selectedCategory.value === 'all' ||
				product.category === selectedCategory.value;
				
				const matchStatus = selectedStockStatus.value === 'all' || 
					(selectedStockStatus.value === 'available' && product.stock > 0) ||
					(selectedStockStatus.value === 'unavailable' && product.stock <= 0);
				
				const matchSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());

				return matchCategory && matchStatus && matchSearch;
			});
		});
		const menuItems = [
			{
				name: "Dashboard",
				label: "Dashboard",
				icon: HomeIcon,
				link: "/dashboard",
			},
			{ name: "Kasir", label: "Kasir", icon: ShoppingCartIcon, link: "/kasir" },
			{
				name: "Penjualan",
				label: "Penjualan",
				icon: BanknotesIcon,
				link: "/penjualan",
			},
			{ name: "Stock", label: "Stock", icon: CubeIcon, link: "/stok" },
			{
				name: "Supplier",
				label: "Supplier",
				icon: StarIcon,
				link: "/supplier",
			},
		];
		const products = ref([]);
		// Pagination state
		const currentPage = ref(1);
		const pageSize = 5; // Max 5 data per page

		const totalPages = computed(() => {
		return Math.ceil(filteredProducts.value.length / pageSize) || 1;
		});

		// Slice visible products for current page
		const paginatedProducts = computed(() => {
		const start = (currentPage.value - 1) * pageSize;
		const end = start + pageSize;
		return filteredProducts.value.slice(start, end);
		});

		// Page navigation
		function goToPreviousPage() {
		if (currentPage.value > 1) currentPage.value--;
		}
		function goToNextPage() {
		if (currentPage.value < totalPages.value) currentPage.value++;
		}

		// Reset to first page when filter/search changes
		watch(filteredProducts, () => {
		currentPage.value = 1;
		});
		const alertMessage = ref("");
		const alertType = ref("error");
		const alertTitle = ref("");
		let alertTimeout = null;

		function showAlert({title, message, type = "error", duration = 3500}) {
			alertTitle.value = title;
			alertMessage.value = message;
			alertType.value = type;
			if (alertTimeout) clearTimeout(alertTimeout);
			alertTimeout = setTimeout (() => {
				closeAlert();
			}, duration);
		}

		function formatRupiah(value) {
			if (typeof value !== "number") value = Number(value) || 0;
			return value.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
		}
		function closeAlert() {
			alertMessage.value = "";
			alertTitle.value = "";
			alertType.value = "error";
			if (alertTimeout) {
				clearTimeout(alertTimeout);
				alertTimeout = null;
			}
		}

		const toggleSidebar = () => {
			isSidebarOpen.value = !isSidebarOpen.value;
		};

		const setActiveMenu = (name) => {
			activeMenu.value = name;
		};

		// const categories = computed(() => {
		// 	const uniqueCategories = new Set(
		// 		products.value.map((product) => product.category)
		// 	);
		// 	return Array.from(uniqueCategories);
		// });

		// const filteredProducts = computed(() => {
		// 	return (products.value || []).filter((product) => {
		// 		const name = product.name ?? "";
		// 		const category = product.category ?? "";
		// 		const search = searchQuery.value ?? "";
		// 		const selected = selectedCategory.value ?? "all";

		// 		const matchesCategory = selected === "all" || category === selected;
		// 		const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

		// 		return matchesCategory && matchesSearch;
		// 	});
		// });

		const viewProduct = (id) => {
			if (!id) {
				console.error("Product ID is undefined!");
				return;
			}
			router.push({ name: "ViewProduct", params: { id: id.toString() } });
		};

		const showAddModal = ref(false);

		const newProduct = ref({
			name: "",
			category: "",
			stock: 0,
			buyPrice: 0,
			sellPrice: 0,
			image: null,
		});

		const handleImageUpload = (event) => {
			const file = event.target.files[0];
			if (file) {
				newProduct.value.image = file; // This must be a File object
			}
		};

		function handleDeleteButton(product) {
			if (product.stock > 0) {
				showAlert({
					title: "Tidak Bisa Hapus",
					message: "Produk tidak dapat dihapus karena masih memiliki stok.",
					type: "error",
				});
				return;
			}
			openDeleteModal(product.id);
		}
		const addProduct = async () => {
			try {
				// Validate required fields
				if (!newProduct.value.name || !newProduct.value.category || !newProduct.value.sellPrice) {
					showAlert({
						title: "Validasi Error",
						message: "Mohon lengkapi semua field yang diperlukan",
						type: "error"
					});
					return;
				}

				// Validate image
				if (!newProduct.value.image) {
					showAlert({
						title: "Validasi Error",
						message: "Foto produk wajib diupload",
						type: "error"
					});
					return;
				}

				const token = localStorage.getItem("token"); 
				const formData = new FormData();

				// Append required fields
				formData.append("product_name", newProduct.value.name);
				formData.append("description", newProduct.value.category);
				formData.append("price", parseFloat(newProduct.value.sellPrice));
				formData.append("status", "active"); // Add status value

				// Append image
				formData.append("image", newProduct.value.image); 

				const response = await axios.post(
					"https://nurulfrozen.dgeo.id/api/products",
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: "application/json",
							"Content-Type": "multipart/form-data",
						},
					}
				);

				console.log("✅ Product successfully added:", response.data);
				showAlert({
					title: "Berhasil",
					message: "Produk berhasil ditambahkan",
					type: "success"
				});

				products.value.push({
					...newProduct.value,
					id: response.data.data.product_id,
					image: response.data.data.image,
				});

				// Reset form
				showAddModal.value = false;
				newProduct.value = {
					name: "",
					category: "",
					stock: 0,
					buyPrice: 0,
					sellPrice: 0,
					image: null,
				};

				// Refresh the products list
				await fetchProducts();
			} catch (error) {
				console.error(
					"❌ Error adding product:",
					error.response?.data || error.message
				);
				showAlert({
					title: "Error",
					message: "Gagal menambahkan produk. Silakan coba lagi.",
					type: "error"
				});
			}
		};

		onMounted(() => {
			fetchProducts();
		});

		const token = localStorage.getItem("token");
		console.log("Token from localStorage:", token);

		if (!token) {
			alert("No token found, please login first.");
			this.$router.push("/");
			return;
		}
		const fetchProducts = async () => {
			try {
				isLoading.value = true;
				const response = await axios.get(
					"https://nurulfrozen.dgeo.id/api/products",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
							Accept: "application/json",
						},
					}
				);

				if (response.data && Array.isArray(response.data.data)) {
					products.value = response.data.data.map((product) => ({
						id: product.product_id,
						name: product.product_name,
						image: product.image ? `https://nurulfrozen.dgeo.id${product.image}` : null,
						category: product.description,
						stock: product.available_stock,
						buyPrice: parseFloat(product.purchase_price) || 0,
						sellPrice: product.price,
					}));
				} else {
					console.warn("Unexpected response structure:", response.data);
					products.value = [];
					showAlert({
						title: "Error",
						message: "Format data dari server tidak sesuai",
						type: "error"
					});
				}
			} catch (error) {
				console.error("Failed to fetch products:", error);
				products.value = [];
				showAlert({
					title: "Error",
					message: "Gagal mengambil data produk. Silakan coba lagi.",
					type: "error"
				});
			} finally {
				isLoading.value = false;
			}
		};

		const showDeleteModal = ref(false);
		const selectedProductId = ref(null);

		function openDeleteModal(id) {
			console.log("🧪 openDeleteModal called with ID:", id);

			selectedProductId.value = id;
			showDeleteModal.value = true;
		}

		function closeDeleteModal() {
			showDeleteModal.value = false;
			selectedProductId.value = null;
		}

		async function confirmDelete() {
			const token = localStorage.getItem("token");

			try {
				console.log("🗑️ Deleting product with ID:", selectedProductId.value);

				const response = await axios.delete(
					`https://nurulfrozen.dgeo.id/api/products/${selectedProductId.value}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					}
				);

				console.log("✅ Product deleted successfully:", response.data);
				
				// Refresh product list after successful deletion
				await fetchProducts();
				
				// Show success message
				showAlert({
					title: "Berhasil",
					message: "Produk berhasil dihapus",
					type: "success",
				});

				closeDeleteModal();
			} catch (error) {
				console.error(
					"❌ Failed to delete product:",
					error.response?.data || error
				);

				// Show specific error message based on the error
				if (error.response?.data?.message?.includes('inventory entries')) {
					showAlert({
						title: "Tidak Bisa Hapus",
						message: "Produk tidak dapat dihapus karena memiliki riwayat transaksi. Hubungi admin untuk menghapus riwayat transaksi terlebih dahulu.",
						type: "error",
						duration: 5000
					});
				} else {
					showAlert({
						title: "Gagal Menghapus",
						message: "Terjadi kesalahan saat menghapus produk. Silakan coba lagi.",
						type: "error"
					});
				}
				closeDeleteModal();
			}
		}

		return {
			isSidebarOpen,
			activeMenu,
			logo,
			menuItems,
			selectedCategory,
			selectedStockStatus,
			searchQuery,
			categories,
			products,
			filteredProducts,
			viewProduct,
			toggleSidebar,
			setActiveMenu,
			showAddModal,
			newProduct,
			handleImageUpload,
			addProduct,
			openDeleteModal,
			confirmDelete,
			showDeleteModal,
			closeDeleteModal,
			selectedProductId: null,
			alertMessage, 
			alertType,
			alertTitle,
			closeAlert,
			handleDeleteButton,
			formatRupiah,
			paginatedProducts,
			currentPage,
			totalPages,
			goToPreviousPage,
			goToNextPage,
			pageSize,
			isLoading,
		};
	},
};
</script>
  <style scoped>
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
	.alert-notification {
	position: fixed;
	top: 1.25rem;
	right: 1.25rem;
	background: #fff;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,0.13);
	border-radius: 0.5rem;
	border-left-width: 4px;
	padding: 1rem 1.5rem 1rem 1rem;
	max-width: 22rem;
	display: flex;
	align-items: flex-start;
	z-index: 9999;
	}

	.slide-x-enter-active, .slide-x-leave-active {
	transition: all 0.5s cubic-bezier(.4,0,.2,1);
	}
	.slide-x-enter-from {
	opacity: 0;
	transform: translateX(120%);
	}
	.slide-x-enter-to {
	opacity: 1;
	transform: translateX(0);
	}
	.slide-x-leave-from {
	opacity: 1;
	transform: translateX(0);
	}
	.slide-x-leave-to {
	opacity: 0;
	transform: translateX(120%);
	}
</style>  
