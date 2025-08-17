<script setup lang="ts">
  import { RouterView } from 'vue-router';
	import ScrollTop from 'primevue/scrolltop';
</script>

<template>
	<div>
		<main>
			<RouterView />
		</main>
	</div>
	<ScrollTop />
</template>

<style scoped></style>
