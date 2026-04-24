<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/20/solid";

const emit = defineEmits(["close"]);
const props = defineProps ({
  title: {
    type: String,
    default: null,
  }
})

function closeModal() {
  emit("close");
}
</script>

<template>
  <Transition name="modal">
    <div class="modal-wrapper">
      <div class="modal-wrapper-outer">
        <h3 class="modal-title" v-if="title">{{ title }}</h3>
        <div class="modal-wrapper-inner">
          <button class="modal-close-button" @click="closeModal">
            <XMarkIcon class="w-8 h-8" />
          </button>
          <div class="modal-inner">
            <slot></slot>
          </div>
        </div>
      </div>        
    </div>
  </Transition>
</template>