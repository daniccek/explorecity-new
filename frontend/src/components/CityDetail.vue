<template>
  <div v-if="city" class="container mt-4">
  
    <div class="mb-3 d-flex">
      <button class="btn btn-secondary" @click="$emit('back')">← Zpět na seznam měst</button>
      <button class="btn btn-outline-primary ms-2" @click="$emit('refresh', city.id)">Aktualizovat</button>

    </div>

    <h2 class="mb-4">{{ city.name }}</h2>

    <div class="row">
      <div class="col-md-4 mb-4" v-for="place in city.places" :key="place.id">
        <div class="card h-100" @click="loadPlaceDetail(place.id)" style="cursor: pointer">
          <img :src="place.image || 'https://via.placeholder.com/300x200?text=Misto'" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">{{ place.name }}</h5>
            <p class="card-text">{{ place.type }}</p>
          </div>
        </div>
      </div>
    </div>


    <div v-if="showSidebar" class="sidebar-overlay" @click="closeSidebar"></div>

    <div v-if="selectedPlace" class="sidebar-panel">
      <button class="btn-close float-end m-2" @click="closeSidebar"></button>
      <div class="p-3">
        <img :src="selectedPlace.image || 'https://via.placeholder.com/400x250'" class="img-fluid mb-3 rounded" />
        <h3>{{ selectedPlace.name }}</h3>
        <p><strong>Typ:</strong> {{ selectedPlace.type }}</p>
        <p><strong>Adresa:</strong> {{ selectedPlace.address }}</p>
        <p><strong>Popis:</strong> {{ selectedPlace.description }}</p>

        <h5 class="mt-4">Hodnocení: {{ averageRating }} ⭐ ({{ selectedPlace.ratings.length }}x)</h5>


        <h5 class="mt-3">Komentáře:</h5>
        <ul>
          <li v-for="comment in selectedPlace.comments" :key="comment.id">
            <strong>{{ comment.name }}</strong> ({{ formatDate(comment.createdAt) }}):<br />
            {{ comment.text }}
            <button class="btn btn-sm btn-danger mt-1" @click="deleteComment(comment.id)">Smazat</button>
          </li>
        </ul>

        <div class="mt-4">
          <h6>Přidat komentář</h6>
          <form @submit.prevent="submitComment">
            <input v-model="newComment.name" class="form-control mb-2" placeholder="Vaše jméno" required />
            <textarea v-model="newComment.text" class="form-control mb-2" placeholder="Váš komentář" required></textarea>
            <button class="btn btn-primary" type="submit">Odeslat</button>
          </form>
        </div>


        <div class="mt-4">
          <h6>Ohodnoťte místo</h6>
          <div>
            <span
              v-for="star in 5"
              :key="star"
              :class="{ active: star <= newRating.value }"
              @click="setRating(star)"
              style="font-size: 24px; cursor: pointer; color: gold;"
            >★</span>
            <button class="btn btn-success btn-sm ms-2" @click="submitRating" :disabled="newRating.value === 0">Odeslat</button>
          </div>
        </div>

        <div class="mt-4">
          <button class="btn btn-warning btn-sm" @click="startEdit">Upravit místo </button>
        </div>

        <div v-if="isEditing" class="mt-4">
          <h6>Úprava místa</h6>
          <form @submit.prevent="submitEdit">
            <input v-model="editForm.name" class="form-control mb-2" placeholder="Název místa" required />
            <input v-model="editForm.address" class="form-control mb-2" placeholder="Adresa" required />
            <input v-model="editForm.image" class="form-control mb-2" placeholder="URL obrázku" />
            <select v-model="editForm.type" class="form-control mb-2" required>
              <option disabled value="">Vyber typ</option>
              <option>Restaurace</option>
              <option>Památka</option>
              <option>Zajímavost</option>
              <option>Ostatní</option>
            </select>
            <textarea v-model="editForm.description" class="form-control mb-2" placeholder="Popis" required></textarea>
            <div class="d-flex justify-content-between">
              <button class="btn btn-secondary btn-sm" type="button" @click="cancelEdit">Zrušit</button>
              <button class="btn btn-success btn-sm" type="submit">Uložit</button>
            </div>
          </form>
        </div>

        <div class="mt-4">
          <button class="btn btn-danger" @click="deletePlace">Smazat toto místo</button>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <h4>Přidat nové místo</h4>
      <form @submit.prevent="submitPlace">
        <input v-model="newPlace.name" class="form-control mb-2" placeholder="Název místa" required />
        <input v-model="newPlace.address" class="form-control mb-2" placeholder="Adresa" required />
        <input v-model="newPlace.image" class="form-control mb-2" placeholder="URL obrázku" />
        <select v-model="newPlace.type" class="form-control mb-2" required>
          <option disabled value="">Vyber typ</option>
          <option>Restaurace</option>
          <option>Památka</option>
          <option>Zajímavost</option>
          <option>Ostatní</option>
        </select>
        <textarea v-model="newPlace.description" class="form-control mb-2" placeholder="Popis místa" required></textarea>
        <button class="btn btn-success" type="submit">Přidat</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['city'],
  data() {
    return {
      selectedPlace: null,
      showSidebar: false,
      newComment: { name: '', text: '' },
      newRating: { value: 0 },
      newPlace: {
        name: '',
        address: '',
        description: '',
        image: '',
        type: '',
      },
      editForm: {
        name: '',
        address: '',
        description: '',
        image: '',
        type: '',
      },
      isEditing: false,
    };
  },
  computed: {
    averageRating() {
      if (!this.selectedPlace || this.selectedPlace.ratings.length === 0) return '–';
      const total = this.selectedPlace.ratings.reduce((sum, r) => sum + r.value, 0);
      return (total / this.selectedPlace.ratings.length).toFixed(1);
    },
  },
  methods: {
    async refreshCity() {
      const res = await fetch(`http://localhost:3000/cities/${this.city.id}`);
      this.city = await res.json();
    },
    async loadPlaceDetail(id) {
      const res = await fetch(`http://localhost:3000/places/${id}`);
      this.selectedPlace = await res.json();
      this.showSidebar = true;
    },
    closeSidebar() {
      this.showSidebar = false;
      this.selectedPlace = null;
      this.newComment = { name: '', text: '' };
      this.newRating.value = 0;
      this.isEditing = false;
    },
    async submitComment() {
      await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.newComment, placeId: this.selectedPlace.id }),
      });
      await this.loadPlaceDetail(this.selectedPlace.id);
    },
    async submitRating() {
      await fetch('http://localhost:3000/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: this.newRating.value, placeId: this.selectedPlace.id }),
      });
      await this.loadPlaceDetail(this.selectedPlace.id);
    },
    async deleteComment(commentId) {
      await fetch(`http://localhost:3000/comments/${commentId}`, { method: 'DELETE' });
      await this.loadPlaceDetail(this.selectedPlace.id);
    },
    async deletePlace() {
      if (!confirm('Opravdu chceš smazat toto místo?')) return;
      await fetch(`http://localhost:3000/places/${this.selectedPlace.id}`, { method: 'DELETE' });
      this.closeSidebar();
      await this.refreshCity();
    },
    async submitPlace() {
      await fetch('http://localhost:3000/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.newPlace, cityId: this.city.id }),
      });
      this.newPlace = { name: '', address: '', description: '', image: '', type: '' };
      await this.refreshCity();
    },
    startEdit() {
      this.isEditing = true;
      this.editForm = {
        name: this.selectedPlace.name,
        address: this.selectedPlace.address,
        description: this.selectedPlace.description,
        image: this.selectedPlace.image,
        type: this.selectedPlace.type,
      };
    },
    cancelEdit() {
      this.isEditing = false;
    },
    async submitEdit() {
      await fetch(`http://localhost:3000/places/${this.selectedPlace.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.editForm, cityId: this.city.id }),
      });
      this.isEditing = false;
      await this.loadPlaceDetail(this.selectedPlace.id);
    },
    setRating(val) {
      this.newRating.value = val;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
}
.sidebar-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: white;
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 999;
  animation: slideIn 0.3s ease forwards;
}
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.star.active {
  font-weight: bold;
}
</style>
