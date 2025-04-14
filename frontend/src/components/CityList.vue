<template>
  <div>
    <h2 class="mb-4">Seznam měst</h2>
    <div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="city in cities"
        :key="city.id"
      >
        <div class="card h-100">

          <img
            :src="city.image || 'https://via.placeholder.com/300x200?text=Město'"
            class="card-img-top"
            alt="Obrázek města"
            style="height: 200px; object-fit: cover;"
          />
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">{{ city.name }}</h5>

            <button class="btn btn-primary mt-2" @click="selectCity(city)">
              Procházet místa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cities: [],
    };
  },
  async mounted() {
    try {
      const res = await fetch('http://localhost:3000/cities');
      this.cities = await res.json();
    } catch (err) {
      console.error('Chyba při načítání měst:', err);
    }
  },
  methods: {
    selectCity(city) {
      this.$emit('city-selected', city.id); 
    },
  },
};
</script>

<style scoped>
.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
