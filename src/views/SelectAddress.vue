<template>
    <AppLayout>

    <div class="min-h-screen bg-gray-100 flex">
      
  
      <!-- Main Content -->
      <div class="flex-1 flex p-6">
        <!-- Left Side: Map -->
        <div class="w-2/3 pr-4">
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
  
        <!-- Right Side: Address Search & Selection -->
        <div class="w-1/3 bg-white p-4 rounded-lg shadow-lg">
          <h2 class="font-bold text-lg flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M3 8h18M3 13h18M3 18h18"></path>
            </svg>
            Pilih Lokasi Antar
          </h2>
  
          <div class="relative mt-4">
            <input v-model="searchQuery" @input="searchAddress" placeholder="Search address..." class="border px-4 py-2 rounded w-full">
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
          </div>
  
          <button class="w-full bg-blue-700 text-white py-2 rounded mt-4">Gunakan Alamat Ini</button>
        </div>
      </div>
    </div>
    </AppLayout>
  </template>
  
  <script>
  import { ref } from "vue";
  import "leaflet/dist/leaflet.css";
  import axios from "axios";
  import logoImage from "@/assets/image.png";
  import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";


  export default {
    name: "SelectAddress",
    components: {
      LMap,
      LTileLayer,
      LMarker
    },
    setup() {
      const isSidebarOpen = ref(false);
      const mapCenter = ref([-6.2088, 106.8456]); // Default Jakarta
      const zoom = ref(13);
      const markerPosition = ref(null);
      const searchQuery = ref("");
      const searchResults = ref([]);
      const selectedAddress = ref(null);

      
      const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  
      // Function to set the location when clicking on the map
      const setLocation = async (event) => {
        markerPosition.value = [event.latlng.lat, event.latlng.lng];
        await reverseGeocode(event.latlng.lat, event.latlng.lng);
      };
  
      // Function to get the address from coordinates
      const reverseGeocode = async (lat, lng) => {
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          selectedAddress.value = response.data.display_name;
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };
  
      // Function to search for an address
      const searchAddress = async () => {
        if (!searchQuery.value) return;
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery.value}`);
          searchResults.value = response.data.map(item => ({
            name: item.display_name.split(",")[0],
            address: item.display_name,
            lat: item.lat,
            lon: item.lon
          }));
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
  
      // Function to set the address from search results
      const selectAddress = (result) => {
        selectedAddress.value = result.address;
        markerPosition.value = [result.lat, result.lon];
        mapCenter.value = [result.lat, result.lon];
        searchResults.value = [];
      };
  
      return {
        isSidebarOpen,
        mapCenter,
        zoom,
        markerPosition,
        setLocation,
        tileLayerUrl,
        searchQuery,
        searchResults,
        searchAddress,
        selectedAddress,
        selectAddress,
        logo: logoImage
      };
    }
  };
  </script>
  
  <style scoped>
  /* Styling for smooth UI */
  </style>
  