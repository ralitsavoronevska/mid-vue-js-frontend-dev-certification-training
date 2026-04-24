<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";
import { items } from "./movies.json";
import MovieItem from "./components/MovieItem.vue";

// async components
const AppModal = defineAsyncComponent(() => import("./components/AppModal.vue"));
const MovieForm = defineAsyncComponent (() => import("./components/MovieForm.vue"));


const movies = ref(items);
const currentMovie = ref();

function updateRating(id: number, rating: number) {
  movies.value = movies.value.map((movie) => {
    if (movie.id === id) {
      movie.rating = rating;
    }
    return movie;
  })
}

function removeMovie(id: number) {
  movies.value = movies.value.filter((movie) => movie.id !== id);
}

function editMovie(id: number) {
  currentMovie.value = movies.value.find((movie) => movie.id === id);
  showForm();
}

function saveMovie(data: any) {
  const isNew = !!movies.value.find((movie) => movie.id === data.id);
  if (!isNew) {
    addMovie(data);
  } else {
    updateMovie(data);
  }

  hideForm();
}

function updateMovie(data: any) {
  movies.value = movies.value.map((m) => {
    if (m.id === data.id) {
      data.rating = m.rating;
      return data;
    }
    return m;
  });
  hideForm();
}

function addMovie(data: any) {
  movies.value.push(data);
  hideForm();
}

const showMovieForm = ref(false);

function hideForm() {
  showMovieForm.value = false;
  currentMovie.value = null;
}

function showForm() {
  showMovieForm.value = true;
}

const averageRating = computed(() => {
  const avg = movies.value
    .map((movie) => movie.rating)
    .reduce((a, b) => a + b, 0);

  return Number(avg / movies.value.length).toFixed(1);
});

const totalMovies = computed(() => {
  return movies.value.length;
});

function removeRatings() {
  movies.value = movies.value.map((movie) => {
    movie.rating = 0;
    return movie;
  });
}

// To Test the form for adding a movie:
// Name: The Matrix Revolutions
// Description: The human city of Zion defends itself against the massive invasion of the machines as Neo fights to end the war at another front while also opposing the rogue Agent Smith.
// Image URL: https://i.ebayimg.com/images/g/Wf8AAOSwdgxiZc0Q/s-l1600.webp
// Genres: Action, Drama
</script>

<template>
  <div class="app">
    <div class="layout">
      <div class="movie-actions">
        <div class="movie-actions-list-info">
          <p class="movie-actions-list-info-item">Total movies: {{ totalMovies }}</p>
          <p class="movie-actions-list-info-divider">/</p>
          <p class="movie-actions-list-info-item">Average rating: {{ averageRating }}</p>
        </div>
        <div class="movie-actions-list-actions">

          <button
            class="movie-actions-list-action-button"
            :class="{
              'button-primary': !showMovieForm,
              'button-disabled': showMovieForm,
            }"
            @click="removeRatings"
            :disabled="showMovieForm"
          >
            Remove Ratings
          </button>

          <button
            class="movie-actions-list-action-button add-movie-button"
            :class="{
              'button-primary': !showMovieForm,
              'button-disabled': showMovieForm,
            }"
            @click="showForm"
            :disabled="showMovieForm"
          >
            Add Movie
          </button>

          <AppModal v-if="showMovieForm" @close="hideForm" :title="currentMovie ? 'Edit Movie' : 'Add Movie'">
            <MovieForm v-if="showMovieForm"
              :model-value="currentMovie"
              @update:modelValue="saveMovie"
              @cancel="hideForm"
              />
          </AppModal>

        </div>

      </div>
      <div class="movie-list">
        <MovieItem
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          @edit="editMovie"
          @remove="removeMovie"
          @update:rating="updateRating"
        />
      </div>
    </div>
  </div>
</template>
