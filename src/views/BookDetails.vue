<script setup lang="ts">
	import { ref, onMounted, inject } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import axios from 'axios';

	const bookApiUrl = inject('googleBookApi');
	// const router = useRouter();
	const route = useRoute();
	const bookId = route.params.id;
	const prevId = route.query.prev;
	const nextId = route.query.next;

	const book: any = ref(null);

	// used to navigate to next/prev books
	const prevBook: any = ref(null);
	const nextBook: any = ref(null);

	onMounted(async () => {
		try {
			const response = await axios.get(`${bookApiUrl}/volumes/${bookId}`);
			book.value = response.data;
			// console.log('val:', book.value);

			if (prevId) {
				try {
					const prevRes = await axios.get(`${bookApiUrl}/volumes/${prevId}`);
					prevBook.value = prevRes.data;
				} catch {
					prevBook.value = null;
				}
			}

			if (nextId) {
				try {
					const nextRes = await axios.get(`${bookApiUrl}/volumes/${nextId}`);
					nextBook.value = nextRes.data;
				} catch {
					nextBook.value = null;
				}
			}
		} catch (error) {
			console.error('Failed to fetch book details:', error);
		}
	});

	// function goToNextBook() {
	// const nextId = route.query.next;
	//   if (nextId) {
	//     router.push(`/book/${nextId}`);
	//   }
	// }
</script>

<template>
	<div class="max-w-4xl mx-auto p-6">
		<div
			v-if="book"
			class="bg-surface-900 rounded-lg p-6 sm:p-12">
			<img
				v-if="book.volumeInfo.imageLinks?.thumbnail"
				:src="book.volumeInfo.imageLinks.thumbnail"
				alt="Book cover"
				class="flex flex-row justify-self-center h-50 sm:h-100 mb-4 sm:mb-10" />
			<h1 class="text-3xl font-bold mb-4">{{ book.volumeInfo.title }}</h1>
			<p class="text-sm text-gray-400 mb-2">
				<span class="font-bold">Categories: </span
				>{{ book.volumeInfo.categories?.join(', ') || 'Unknown Categories' }}
			</p>
			<p class="text-sm text-gray-400 mb-2">
				<span class="font-bold">Author(s):</span>
				{{ book.volumeInfo.authors?.join(', ') || 'Unknown Author' }}
			</p>
			<p class="text-sm text-gray-400 mb-2">
				<span class="font-bold">Publisher:</span>
				{{ book.volumeInfo.publisher || 'Unknown Publisher' }}
			</p>
			<p class="text-sm text-gray-400 mb-2">
				<span class="font-bold">Published Date:</span>
				{{ book.volumeInfo.publishedDate || 'Unknown Date' }}
			</p>
			<p class="text-sm text-gray-400 mb-2">
				<span class="font-bold">Pages:</span>
				{{ book.volumeInfo.pageCount || 'Unknown page count' }}
			</p>
			<p class="text-sm text-gray-400 mb-2">
				<span class="font-bold">Language:</span>
				{{ book.volumeInfo.language.toUpperCase() || 'Unknown language' }}
			</p>
			<p class="text-sm text-gray-400 mb-2">
				<span class="font-bold">Price:</span>
				{{
					book.saleInfo?.listPrice?.currencyCode +
						book.saleInfo?.listPrice?.amount || 'Unknown Price'
				}}
			</p>
			<p class="mt-8 text-gray-300">
				{{ book.volumeInfo.description || 'No description available.' }}
			</p>
		</div>
		<p
			v-else
			class="flex justify-center content-center m-10">
			<i
				class="pi pi-spin pi-spinner"
				style="font-size: 2rem"></i>
		</p>

		<!-- navigates to next & previous books -->
		<!-- <div class="flex flex-row justify-between">
			<div v-if="prevBook"
				class="grid grid-flow-col grid-rows-1 card gap-x-4 px-6 py-3 my-6 bg-surface-900 rounded cursor-pointer hover:bg-surface-950 max-w-75"
        @click="router.push(`/book/${prevBook.id}`)">
				<div class="row-span-1 self-center">
					<i class="text-2xl pi pi-angle-left"></i>
				</div>
				<div class="row-span-1 text-right self-center">
					<span class="font-bold">{{ prevBook.volumeInfo?.title }}</span>
					<span class="text-sm text-gray-400 line-clamp-1">{{
						prevBook.volumeInfo?.authors?.join(', ') || 'Unknown Author'
					}}</span>
				</div>
				<div class="row-span-1 content-center">
					<img
						v-if="prevBook.volumeInfo.imageLinks?.thumbnail"
						:src="prevBook.volumeInfo.imageLinks.thumbnail"
						alt="Book cover"
						class="h-14" />
				</div>
			</div>

			<div v-if="nextBook"
				class="grid grid-flow-col grid-rows-1 card gap-x-4 px-6 py-3 my-6 bg-surface-900 rounded cursor-pointer hover:bg-surface-950 max-w-75"
        @click="goToNextBook">
				<div class="row-span-1 content-center">
					<img
						v-if="nextBook.volumeInfo.imageLinks?.thumbnail"
						:src="nextBook.volumeInfo.imageLinks.thumbnail"
						alt="Book cover"
						class="self-center h-14" />
				</div>
				<div class="row-span-1 self-center">
					<span class="font-bold">{{ nextBook.volumeInfo?.title }}</span>
					<span class="text-sm text-gray-400 line-clamp-1">{{
						nextBook.volumeInfo?.authors?.join(', ') || 'Unknown Author'
					}}</span>
				</div>
				<div class="row-span-1 self-center">
					<i class="text-2xl pi pi-angle-right"></i>
				</div>
			</div>
		</div> -->
	</div>
</template>

<style scoped></style>
