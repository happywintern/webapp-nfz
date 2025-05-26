<template>
	<AppLayout>
		<div class="p-6 bg-gray-100 min-h-screen flex justify-center">
			<div class="container max-w-6xl mx-auto p-4 flex space-x-6">
				<!-- Left Container: Product Details -->
				<div class="w-2/5 bg-white p-8 rounded-2xl shadow-md relative">
					<button
						@click="goBack"
						class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded"
					>
						Back
					</button>
					<h2 class="text-xl text-center font-semibold mb-6">Detail Produk</h2>
					<img
						:src="product.image"
						alt="Product Image"
						class="w-full h-48 object-cover mb-6 rounded-lg"
					/>
					<div class="text-sm space-y-4 px-12">
						<p><strong>Nama </strong>: {{ product.name }}</p>
						<p><strong>Kategori </strong>: {{ product.category }}</p>
						<p><strong>Harga Beli </strong>: {{ product.buyPrice }}</p>
						<p><strong>Harga Jual </strong>: {{ product.sellPrice }}</p>
						<p>
							<strong>Status </strong>:
							<span :class="isProductActive ? 'text-green-600' : 'text-red-600'">
								{{ isProductActive ? 'Tersedia' : 'Tidak Tersedia' }}
							</span>
						</p>
					</div>
					<div class="text-center mt-8 space-y-3">
						<button
							@click="updateProduct"
							class="bg-[#1A327B] text-white font-semibold py-2 px-5 rounded-full hover:bg-[#16296A] transition w-48"
						>
							Edit
						</button>
						<!-- <button
							@click="toggleProductAvailability"
							class="bg-transparent border border-[#1A327B] text-[#1A327B] font-semibold py-2 px-5 rounded-full hover:bg-gray-100 transition w-48"
						>
							{{ isProductActive ? 'Tandai Tidak Tersedia' : 'Tandai Tersedia' }}
						</button> -->
					</div>

					<!-- <div class="text-sm space-y-4 px-12">
            <p><strong>Nama       </strong>: {{ product.name }}</p>
            <p><strong>Kategori   </strong>: {{ product.category }}</p>
            <p><strong>Harga Beli </strong>: {{ product.buyPrice }}</p>
            <p><strong>Harga Jual </strong>: {{ product.sellPrice }}</p>
          </div>
          <div class="text-center mt-8">
            <button
            @click="updateProduct"
            class="bg-[#1A327B] text-white font-semibold py-2 px-5 rounded-full hover:bg-[#16296A] transition w-48"
          >
            Edit
    </button>
          </div> -->
				</div>

				<!-- Right Container: Stock Table -->
				<div class="w-3/5 bg-white p-6 rounded-2xl shadow-md">
					<h2 class="text-xl text-center font-semibold mb-4">Stok Produk</h2>

					<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">

						<!-- Search Input -->
						<div class="relative w-full sm:w-64">
							<i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
							<input
								type="text"
								placeholder="Search"
								class="pl-10 pr-4 py-2 border border-[#1A327B] text-black font-semibold rounded-lg w-full"
							/>
						</div>

						<!-- Tambah Button -->
						<button
							@click="showAddStock = true"
							class="flex items-center gap-2 px-4 py-2 bg-[#1A327B] text-white rounded-lg hover:bg-blue-800 h-[42px]"
						>
							<i
								class="fa fa-calendar-plus-o"
								aria-hidden="true"
							></i>
							Tambah
						</button>
					</div>

					<div class="bg-white rounded-xl shadow-md overflow-hidden">
						<table class="w-full text-sm">
							<thead class="text-left">
								<tr class="text-gray-700">
									<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Tanggal Masuk</th>
									<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Stok</th>
									<th class="py-4 px-6 font-semibold border-b-2 border-[#1A327B]">Tanggal Kadaluarsa</th>
									<th class="py-4 px-6 font-semibold text-center border-b-2 border-[#1A327B]">Aksi</th>
								</tr>
							</thead>
							<tbody class="text-gray-800">
								<template v-for="(item, index) in sortedStockData" :key="index">
									<tr 
										class="border-b hover:bg-gray-50"
										:class="{
											'bg-red-50': item.status === 'expired',
											'bg-blue-50': item.status === 'near-expiry'
										}"
									>
										<td class="py-2 px-6">{{ formatDate(item.tanggalMasuk) }}</td>
										<td class="py-2 px-6">{{ item.stok }}</td>
										<td class="py-2 px-6">
											<div class="flex items-center">
												{{ formatDate(item.tanggalKadaluarsa) }}
												<span 
													v-if="item.status === 'expired'" 
													class="ml-2 text-xs text-red-600 font-medium"
												>
													(Kadaluwarsa)
												</span>
												<span 
													v-if="item.status === 'near-expiry'" 
													class="ml-2 text-xs text-yellow-600 font-medium"
												>
													(Segera Kadaluwarsa)
												</span>
											</div>
										</td>
										<td class="py-2 px-6 flex space-x-2 justify-center">
											<button
												@click="openEditModal(item)"
												class="text-gray-600 hover:text-blue-600"
											>
												<i class="fas fa-pen"></i>
											</button>
											<button
												@click="deleteStock(item.id)"
												class="text-gray-600 hover:text-blue-600"
											>
												<i class="fas fa-trash"></i>
											</button>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal for Editing Product -->
		<div
			v-if="showEditModal"
			class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
		>
			<div class="bg-white p-6 rounded-lg w-[400px]">
				<h2 class="text-xl font-bold text-[#1A327B] mb-4">Edit Produk</h2>

				<div class="space-y-3">
					<input
						v-model="editedProduct.name"
						type="text"
						placeholder="Nama Produk"
						class="w-full border rounded px-3 py-2"
					/>
					<input
						v-model="editedProduct.category"
						type="text"
						placeholder="Kategori"
						class="w-full border rounded px-3 py-2"
					/>
					<input
						v-model="editedProduct.buyPrice"
						type="number"
						placeholder="Stok"
						class="w-full border rounded px-3 py-2"
					/>
					<input
						v-model="editedProduct.sellPrice"
						type="number"
						placeholder="Harga Beli"
						class="w-full border rounded px-3 py-2"
					/>
					<input
						type="file"
						@change="handleImageUpload"
						class="w-full"
					/>
				</div>

				<div class="flex justify-end mt-4 space-x-2">
					<button
						@click="showEditModal = false"
						class="px-4 py-2 bg-gray-300 text-black rounded"
					>Batal</button>
					<button
						@click="saveProductUpdate"
						class="px-4 py-2 bg-[#1A327B] text-white rounded"
					>Simpan</button>
				</div>
			</div>
		</div>
		<!-- Modal Tambah Stok -->
		<div
			v-if="showAddStock"
			class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
		>
			<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
				<h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Tambah Stok</h2>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-semibold">Tanggal Masuk</label>
						<input
							type="date"
							v-model="newStock.entryDate"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Tanggal Kadaluarsa</label>
						<input
							type="date"
							v-model="newStock.expiredDate"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Stok</label>
						<input
							type="number"
							v-model="newStock.quantity"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Harga Beli</label>
						<input
							type="number"
							v-model.number="newStock.purchase_price"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>
				</div>

				<div class="mt-6 flex justify-end space-x-2">
					<button
						@click="showAddStock = false"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>Batal</button>
					<button
						@click="addStock"
						class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800"
					>Tambah</button>
				</div>
			</div>
		</div>

		<!-- Modal Edit Stok -->
		<div
			v-if="showEditStock"
			class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
		>
			<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
				<h2 class="text-lg font-semibold mb-4 text-[#1A327B]">Edit Stok</h2>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-semibold">Tanggal Masuk</label>
						<input
							type="date"
							v-model="editingStock.entryDate"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Tanggal Kadaluarsa</label>
						<input
							type="date"
							v-model="editingStock.expiredDate"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Stok</label>
						<input
							type="number"
							v-model="editingStock.quantity"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-semibold">Harga Beli</label>
						<input
							type="number"
							v-model.number="editingStock.purchase_price"
							class="w-full px-4 py-2 border rounded"
						/>
					</div>
				</div>

				<div class="mt-6 flex justify-end space-x-2">
					<button
						@click="showEditStock = false"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>Batal</button>
					<button
						@click="saveEditedStock"
						class="px-4 py-2 bg-[#1A327B] text-white rounded hover:bg-blue-800"
					>Simpan</button>
				</div>
			</div>
		</div>

		<div
			v-if="alertMessage"
			class="fixed top-4 right-4 max-w-md bg-white shadow-lg rounded-lg p-4 flex items-start z-50 border-l-4"
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
				class="text-gray-500 hover:text-gray-700"
			>
				<i class="fas fa-times"></i>
			</button>
		</div>

	</AppLayout>
</template>
<script>
import AppLayout from "@/components/Layout.vue";
import axios from "axios";

export default {
	name: "EditPage",
	components: {
		AppLayout,
	},

	data() {
		return {
			showEditModal: false,
			showAddStock: false,
			showEditStock: false,

			product: {
				name: "",
				category: "",
				buyPrice: "",
				sellPrice: "",
				image: "",
			},
			alertMessage: "",
			alertTitle: "",
			alertType: "error",
			editedProduct: {
				name: "",
				category: "",
				buyPrice: "",
				sellPrice: "",
				image: "",
				imageFile: null,
			},
			newStock: {
				entryDate: "",
				expiredDate: "",
				quantity: "",
				purchase_price: "",
			},
			editingStock: {
				id: null,
				entryDate: "",
				expiredDate: "",
				quantity: 0,
				purchase_price: 0,
			},
			stockData: [],
			products: [],
			isProductActive: true,
			monthNames: [
				"Januari", "Februari", "Maret", "April", "Mei", "Juni",
				"Juli", "Agustus", "September", "Oktober", "November", "Desember"
			],
		};
	},
	computed: {
		totalAvailableStock() {
			return this.stockData.reduce(
				(total, item) => total + parseInt(item.stok || 0),
				0
			);
		},
		sortedStockData() {
			const today = new Date();
			const thirtyDaysFromNow = new Date();
			thirtyDaysFromNow.setDate(today.getDate() + 30);

			// Helper function to sort by date
			const sortByDate = (a, b) => {
				const dateA = new Date(a.expiry_date || a.tanggalKadaluarsa);
				const dateB = new Date(b.expiry_date || b.tanggalKadaluarsa);
				return dateA - dateB;
			};

			// Separate items into categories
			const nearExpiry = [];
			const expired = [];
			const normal = [];

			this.stockData.forEach(item => {
				const expiryDate = new Date(item.expiry_date || item.tanggalKadaluarsa);
				
				if (expiryDate < today) {
					expired.push({...item, status: 'expired'});
				} else if (expiryDate <= thirtyDaysFromNow) {
					nearExpiry.push({...item, status: 'near-expiry'});
				} else {
					normal.push({...item, status: 'normal'});
				}
			});

			// Sort each category
			nearExpiry.sort(sortByDate);
			expired.sort(sortByDate);
			normal.sort(sortByDate);

			// Return concatenated array with near expiry items first
			return [...nearExpiry, ...normal, ...expired];
		}
	},

	created() {
		this.fetchProductData();
	},

	methods: {
		fetchProductData() {
			const productId = this.$route.params.id;
			const token = localStorage.getItem("token");

			console.log("🔍 Fetching product with ID:", productId);

			axios
				.get(`https://nurulfrozen.dgeo.id/api/products/${productId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				})
				.then((response) => {
					console.log("✅ Product data fetched:", response.data);

					const data = response.data.data;
					const fullImageUrl = data.image
						? `https://nurulfrozen.dgeo.id${data.image}`
						: null;

					if (fullImageUrl) {
						const img = new Image();
						img.src = fullImageUrl;
						img.onload = () => console.log(`✅ Image loaded: ${fullImageUrl}`);
						img.onerror = () =>
							console.warn(`❌ Failed to load image: ${fullImageUrl}`);
					}

					this.product = {
						name: data.product_name,
						category: data.description,
						buyPrice: data.purchase_price || "-",
						sellPrice: data.price,
						image: fullImageUrl,
					};
					const hasAvailableStock =
						data.inventory_entries &&
						data.inventory_entries.some((entry) => entry.quantity > 0);
					this.isProductActive = hasAvailableStock;

					this.stockData = (data.inventory_entries || []).map((entry) => ({
						tanggalMasuk: entry.entry_date,
						stok: entry.quantity,
						tanggalKadaluarsa: entry.expired_date,
						id: entry.inventory_entry_id,
					}));
				})
				.catch((error) => {
					console.error("❌ Error fetching product data:", error);
				});
		},

		updateProduct() {
			this.editedProduct = { ...this.product };
			this.showEditModal = true;
		},

		openEditModal(item) {
			this.editingStock = {
				id: item.id,
				entryDate: item.tanggalMasuk,
				expiredDate: item.tanggalKadaluarsa,
				quantity: item.stok,
				purchase_price: item.hargaBeli || 0,
			};
			this.showEditStock = true;
		},

		async saveEditedStock() {
			try {
				const response = await fetch(
					`https://nurulfrozen.dgeo.id/api/inventory-entries/${this.editingStock.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
						body: JSON.stringify({
							entry_date: this.editingStock.entryDate,
							expired_date: this.editingStock.expiredDate,
							quantity: Number(this.editingStock.quantity),
							purchase_price: Number(this.editingStock.purchase_price),
						}),
					}
				);

				if (!response.ok) {
					throw new Error("Gagal menyimpan stok");
				}

				const index = this.stockData.findIndex(
					(s) => s.id === this.editingStock.id
				);
				if (index !== -1) {
					this.stockData[index] = {
						...this.stockData[index],
						...this.editingStock,
					};
				}

				this.showEditStock = false;
				this.showAlert("Berhasil", "Stok berhasil diperbarui", "success");
			} catch (error) {
				this.showAlert(
					"Error",
					error.message || "Terjadi kesalahan saat menyimpan stok",
					"error"
				);
			}
		},

		addStock() {
			const productId = this.$route.params.id;
			const token = localStorage.getItem("token");

			const payload = {
				quantity: this.newStock.quantity,
				entry_date: this.newStock.entryDate,
				expired_date: this.newStock.expiredDate,
				purchase_price: this.newStock.purchase_price,
			};

			console.log("📦 Submitting new stock:", payload);

			axios
				.post(
					`https://nurulfrozen.dgeo.id/api/inventory-entries/product/${productId}`,
					payload,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					}
				)
				.then((response) => {
					console.log("✅ Stock added successfully:", response.data);
					this.showAddStock = false;
					this.fetchProductData();

					this.newStock = {
						entryDate: "",
						expiredDate: "",
						quantity: "",
						purchase_price: "",
					};
				})
				.catch((error) => {
					console.error(
						"❌ Failed to add stock:",
						error.response?.data || error
					);
					alert("Gagal menambahkan stok. Pastikan semua data benar.");
				});
		},

		async toggleProductAvailability() {
			const token = localStorage.getItem("token");

			try {
				if (this.isProductActive) {
					await Promise.all(
						this.stockData.map(async (item) => {
							if (item.stok > 0) {
								await axios.patch(
									`https://nurulfrozen.dgeo.id/api/inventory-entries/${item.id}`,
									{ quantity: 0 },
									{
										headers: {
											Authorization: `Bearer ${token}`,
											"Content-Type": "application/json",
											Accept: "application/json",
										},
									}
								);
							}
						})
					);

					alert("Produk ditandai tidak tersedia. Semua stok disetel ke 0.");
				} else {
					this.showAddStock = true;
				}

				this.fetchProductData();
			} catch (error) {
				console.error(
					"❌ Failed to update product availability:",
					error.response?.data || error
				);
				alert(
					"Gagal mengubah status produk. " +
						(error.response?.data?.message || "Coba lagi nanti.")
				);
			}
		},
		async saveProductUpdate() {
			const productId = this.$route.params.id;
			const token = localStorage.getItem("token");

			const formData = new FormData();
			formData.append("product_name", this.editedProduct.name);
			formData.append("description", this.editedProduct.category);
			formData.append("price", this.editedProduct.sellPrice);
			formData.append("status", "active");

			if (this.editedProduct.imageFile) {
				formData.append("image", this.editedProduct.imageFile);
			}

			try {
				const response = await axios.post(
					`https://nurulfrozen.dgeo.id/api/products/${productId}?_method=PUT`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "multipart/form-data",
							Accept: "application/json",
						},
					}
				);

				console.log("✅ Product updated:", response.data);
				this.showAlert("Produk berhasil diperbarui", "Berhasil", "success");
				this.showEditModal = false;
				this.fetchProductData();
			} catch (error) {
				console.error("❌ Gagal update produk:", error.response?.data || error);
				this.showAlert(
					"Gagal memperbarui produk. Periksa input dan coba lagi.",
					"Error",
					"error"
				);
			}
		},

		handleImageUpload(event) {
			const file = event.target.files[0];
			if (file) {
				this.editedProduct.imageFile = file;
			}
		},

		showAlert(message, title = "Notifikasi", type = "error") {
			this.alertMessage = message;
			this.alertTitle = title;
			this.alertType = type;

			setTimeout(() => {
				this.closeAlert();
			}, 5000);
		},

		closeAlert() {
			this.alertMessage = "";
		},

		async deleteStock(id) {
			const token = localStorage.getItem("token");
			if (!id) {
				this.showAlert("ID stok tidak ditemukan.", "Error", "error");
				return;
			}

			const stockItem = this.stockData.find((item) => item.id === id);
			if (stockItem && stockItem.stok > 0) {
				this.showAlert(
					"Stok masih tersedia, tidak dapat menghapus stok.",
					"Error",
					"error"
				);
				return;
			}

			try {
				console.log("🗑️ Attempting to delete stock with ID:", id);

				const response = await axios.delete(
					`https://nurulfrozen.dgeo.id/api/inventory-entries/${id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				);

				console.log("✅ Stock item deleted:", response.data);
				this.showAlert("Stok berhasil dihapus.", "Sukses", "success");

				this.stockData = this.stockData.filter((p) => p.id !== id);
			} catch (error) {
				console.error(
					"❌ Error deleting stock:",
					error.response?.data || error.message
				);

				if (error.response?.data?.message?.includes("used in orders")) {
					this.showAlert(
						"Stok ini tidak dapat dihapus karena telah digunakan dalam pesanan. Sebagai alternatif, Anda dapat membuat stok menjadi 0 untuk menyembunyikan produk.",
						"Tidak Dapat Menghapus",
						"error"
					);
				} else {
					this.showAlert(
						error.response?.data?.message || "Gagal menghapus stok.",
						"Error",
						"error"
					);
				}
			}
		},
		goBack() {
			this.$router.back();
		},
		formatDate(dateString) {
			if (!dateString) return '-';
			const date = new Date(dateString);
			const day = date.getDate().toString().padStart(2, '0');
			const month = this.monthNames[date.getMonth()];
			const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
			return `${day} ${month} ${year}`;
		},
	},
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.container {
	max-width: 1200px;
}

h2 {
	font-size: 1.25rem;
}

table {
	border-collapse: collapse;
}

th,
td {
	border-bottom: 1px solid #ddd;
}
</style>
  