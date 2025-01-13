<template>
    <Button @click="emitCreateModal" 
        class="custom-absolute text-white p-2 rounded-full shadow-md z-20">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </Button>
</template>
<script>
export default {
    emits: ['open-modal'], // Define the emitted events here
    methods: {
        emitCreateModal() {
            this.$emit('open-modal');
        }
    }
};
</script>
<style>
.custom-absolute{
  position: absolute !important;
  top:16px;
  right: 16px;
}
</style>