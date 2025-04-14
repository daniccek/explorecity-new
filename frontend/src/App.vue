<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">ExploreCity</h1>

    <CityList v-if="!selectedCity" @city-selected="handleCitySelect" />
    <CityDetail v-else :city="selectedCity" @back="handleBack" @refresh="refreshSelectedCity"/>
  </div>
</template>
<script>
import CityList from './components/CityList.vue';
import CityDetail from './components/CityDetail.vue';

export default {
  components: {
    CityList,
    CityDetail,
  },
  data() {
    return {
      selectedCity: null,
    };
  },
  methods: {
    async handleCitySelect(cityId) {
      try {
        const response = await fetch(`http://localhost:3000/cities/${cityId}`);
        if (!response.ok) 
          throw new Error('Chyba při načítání detailu města');
        
        const cityData = await response.json();
        this.selectedCity = cityData;
      } catch (error) {
        console.error(error);
      }
    },
    handleBack() {
      this.selectedCity = null;
    },

    async refreshSelectedCity(cityId) {
    try {
      const res = await fetch(`http://localhost:3000/cities/${cityId}`);
      if (!res.ok) throw new Error('Nepodařilo se načíst město.');
      const updatedCity = await res.json();
      this.selectedCity = updatedCity;
    } catch (err) {
      console.error('Chyba při obnovení:', err);
    }
  },
}
};
</script>

