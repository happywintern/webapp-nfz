<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-100 flex">
      <div class="flex-1 flex p-6">
        <button @click="goBack" class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded shadow z-50">
          Back
        </button>
        <!-- Left Side: Map -->
        <div class="w-2/3 pr-4" v-if="!addressConfirmed">
          <h2 class="text-lg font-semibold mb-2">Pilih Lokasi Antar</h2>
          <l-map 
            ref="map" 
            v-model:zoom="zoom" 
            :center="mapCenter" 
            class="h-[500px] w-full rounded-lg shadow-lg" 
            @click="setLocation"
          >
            <l-tile-layer :url="tileLayerUrl" />
            <l-marker v-if="markerPosition" :lat-lng="markerPosition"></l-marker>
          </l-map>
        </div>

        
            

        <!-- Right Side: Address Selection & Info -->
        <div class="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-lg">
          <h2 class="font-bold text-lg mb-4">Pilih Lokasi Antar</h2>

          <div v-if="!addressConfirmed">
  <div class="relative">
    <input v-model="searchQuery" @input="debounceSearch" placeholder="Cari alamat di Depok..." class="border px-4 py-2 rounded w-full">
    <span class="absolute right-3 top-2 text-gray-400">🔍</span>
  </div>

  <ul v-if="searchResults.length" class="mt-2 border rounded-lg shadow-sm">
    <li v-for="(result, index) in searchResults" :key="index" 
        @click="selectAddress(result)" 
        class="p-2 cursor-pointer hover:bg-gray-100 border-b">
      <strong>{{ result.name }}</strong> {{ result.address }}
    </li>
  </ul>

  <div v-if="selectedAddress" class="mt-6 p-4 bg-gray-100 rounded-lg">
    <h3 class="text-sm font-semibold">Alamat yang Dipilih</h3>
    <p class="text-gray-600 text-sm">{{ selectedAddress }}</p>

    <!-- These fields MUST be visible BEFORE confirmAddress() -->
    <label class="block text-sm font-semibold mt-3 mb-1">Nama Penerima</label>
    <input v-model="buyerName" class="w-full border px-2 py-1 rounded mb-3" />

    <label class="block text-sm font-semibold mb-1">Nomor Telepon</label>
    <input v-model="phoneNumber" class="w-full border px-2 py-1 rounded" />
  </div>

  <button @click="confirmAddress" class="w-full bg-blue-700 text-white py-2 rounded mt-4">
    Gunakan Alamat Ini
  </button>
</div>

            
        </div>
      </div>
    </div>
  
  </AppLayout>
</template>

<script>
import { ref } from "vue";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { useRouter } from "vue-router";
import { useCheckoutStore } from './checkout.js';
import AppLayout from '@/components/Layout.vue'; // adjust this path if needed




export default {
  name: "SelectAddress",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    AppLayout
  },
  setup() {
    const mapCenter = ref([-6.3949, 106.8227]); // Depok
    const zoom = ref(14);
    const markerPosition = ref(null);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const selectedAddress = ref(null);
    const buyerName = ref("");
    const phoneNumber = ref("");
    const addressConfirmed = ref(false);
    const router = useRouter();

const checkout = useCheckoutStore();

checkout.buyerName = buyerName.value;
checkout.phoneNumber = phoneNumber.value;

const confirmAddress = () => {
  if (!selectedAddress.value || !buyerName.value || !phoneNumber.value || !markerPosition.value) {
    alert("Lengkapi semua informasi!");
    return;
  }

  const [latitude, longitude] = markerPosition.value;

  // Save to Pinia store
  checkout.buyerName = buyerName.value;
  checkout.phoneNumber = phoneNumber.value;
  checkout.latitude = latitude;
  checkout.longitude = longitude;
  checkout.selectedAddress = selectedAddress.value;

checkout.isPaying = true; // 👈 Force show summary section
router.back();  // Or whatever your main page is
};


    const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    // Map click to set marker and address
    const setLocation = async (event) => {
      markerPosition.value = [event.latlng.lat, event.latlng.lng];
      await reverseGeocode(event.latlng.lat, event.latlng.lng);
    };

    const reverseGeocode = async (lat, lng) => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        selectedAddress.value = response.data.display_name;
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    const searchAddress = async () => {
      if (!searchQuery.value) return;
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            format: 'json',
            q: searchQuery.value,
            viewbox: '106.70,-6.30,106.90,-6.45', // Bounding box around Depok
            bounded: 1,
            addressdetails: 1
          }
        });

        searchResults.value = response.data.map(item => ({
          name: item.display_name.split(",")[0],
          address: item.display_name,
          lat: item.lat,
          lon: item.lon
        }));
      } catch (error) {
        console.error("Error searching address:", error);
      }
    };

    let debounceTimer = null;
    const debounceSearch = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchAddress();
      }, 500);
    };

    const selectAddress = (result) => {
      selectedAddress.value = result.address;
      markerPosition.value = [result.lat, result.lon];
      mapCenter.value = [result.lat, result.lon];
      searchResults.value = [];
    };


    const changeAddress = () => {
      addressConfirmed.value = false;
    };

    return {
      zoom,
      mapCenter,
      tileLayerUrl,
      markerPosition,
      setLocation,
      searchQuery,
      searchResults,
      debounceSearch,
      selectedAddress,
      selectAddress,
      confirmAddress,
      changeAddress,
      addressConfirmed,
      buyerName,
      phoneNumber
    };
  }
};
</script>
