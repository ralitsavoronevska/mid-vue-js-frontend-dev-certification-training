<script setup lang="ts">
import { reactive } from "vue";

const emit = defineEmits(["update:modelValue", "cancel"]);
const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
});

// Define proper interfaces
interface FormData {
  id: number | null
  name: string | null
  description: string | null
  image: string | null
  inTheaters: boolean
  genres: string[] | null
  rating: number | null
}

interface Errors {
  name: string | null;
  description: string | null;
  image: string | null;
  inTheaters: string | null;
  genres: string | null;
};

const form = reactive<FormData>({
  id: props.modelValue?.id || null,
  name: props.modelValue?.name || null,
  description: props.modelValue?.description || null,
  image: props.modelValue?.image || null,
  inTheaters: props.modelValue?.inTheaters || false,
  genres: props.modelValue?.genres || [],
  rating: props.modelValue?.rating || null,
});

const errors = reactive<Errors>({
  name: null,
  description: null,
  image: null,
  inTheaters: null,
  genres: null,
});

const validations = reactive({
  name: "required" as const,
  genres: "required" as const,
});

const genres = reactive([
  { text: 'Drama', value: 'Drama' },
  { text: 'Crime', value: 'Crime' },
  { text: 'Action', value: 'Action' },
  { text: 'Comedy', value: 'Comedy' },
]);

const validationRules = (rule: string) => {
  if (rule === "required") return /^ *$/;

  return null;
};

function validate(rule: string) {
  let valid = true;
  clearErrors();
  for (const [field, rule] of Object.entries(validations)) {
    const validation = validationRules(rule);
    if (validation) {
      if (validation.test((form as any)[field] || "")) {
        (errors as any)[field] = `${field} is ${rule}`;
        valid = false;
      }
    }
  }

  return valid;
}

function saveMovie(rule: string) {
  if (validate(rule)) {
    const data = {
      id: form.id || Number(Date.now()),
      name: form.name,
      description: form.description,
      image: form.image,
      genres: form.genres,
      inTheaters: form.inTheaters,
      rating: form.rating,
    };
    emit("update:modelValue", data);
  }
}

function cancelForm() {
  cleanUpForm();
  emit("cancel");
}

function cleanUpForm() {
  form.name = null;
  form.description = null;
  form.image = null;
  form.genres = [];
  form.inTheaters = false;
  clearErrors();
}

function clearErrors() {
  errors.name = null;
  errors.description = null;
  errors.image = null;
  errors.genres = null;
  errors.inTheaters = null;
}
</script>

<template>
  <form @submit.prevent="saveMovie('required')">
    <div class="movie-form-input-wrapper">
        <label for="name" class="modal-label">Name</label>
        <input 
          id="name" 
          type="text" 
          placeholder="Movie Name" 
          v-model="form.name" 
          class="movie-form-input"
          />
        <span class="movie-form-error">{{ errors.name }}</span>
    </div>
    <div class="movie-form-input-wrapper">
        <label for="description" class="modal-label">Description</label>
        <textarea 
          id="description" 
          placeholder="Description" 
          v-model="form.description"
          class="movie-form-textarea"
          ></textarea>
        <span class="movie-form-error">{{ errors.description }}</span>
    </div>
    <div class="movie-form-input-wrapper">
        <label for="image" class="modal-label">Image URL</label>
        <input 
          id="image" 
          type="text" 
          placeholder="Image URL" 
          v-model="form.image" 
          class="movie-form-input"
          />
        <span class="movie-form-error">{{ errors.image }}</span>
    </div>
    <div class="movie-form-input-wrapper">
        <label for="genres" class="modal-label">Genres</label>
        <select 
          id="genres" 
          v-model="form.genres" 
          multiple 
          class="movie-form-input">
          <option v-for="genre in genres" :value="genre.value" :key="genre.value">
              {{ genre.text }}
          </option>
        </select>
        <span class="movie-form-error">{{ errors.genres }}</span>
    </div>
    <div class="movie-form-input-wrapper">
        <label for="inTheaters" class="movie-form-checkbox-label">
          <input
              type="checkbox"
              id="inTheaters"
              v-model="form.inTheaters" 
              :true-value="true"
              :false-value="false"
              class="movie-form-checkbox"/>
          <span class="text-sm text-gray-300">In theaters</span>
          <span class="movie-form-error">{{ errors.inTheaters }}</span>
        </label>  
    </div>

    <div class="movie-form-actions-wrapper">

        <button type="button" class="button" @click="cancelForm">
          Cancel
        </button>

        <button type="submit" class="button-primary">
          <span v-if="form.id">Update</span>
          <span v-else>Create</span>
        </button>
        
    </div>

  </form>
          
</template>  