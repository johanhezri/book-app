<script setup lang="ts">
  import { inject, onMounted, ref, watch } from 'vue';
  import InputText from 'primevue/inputtext';
  import axios from 'axios';
  import { useDebounceFn } from '@vueuse/core';
  import { FloatLabel, InputGroup, Paginator, ScrollTop, SelectButton } from 'primevue';
  import { useRouter } from 'vue-router';

	const bookApiUrl = inject('googleBookApi');
  
  // search filters
  const query = ref('');
  const bookName = ref('');
  const author = ref('');
  const category = ref('');
  const publisher = ref('');

  const books: any = ref([]);
  const totalRecords = ref(0);
  const rows = ref(12); // books per page
  const first = ref(0); // first book

  const loading = ref(false);
  const error = ref('');
  const defaultTerm = 'bestsellers';
  const viewMode = ref<'card' | 'list'>('card');
	const router = useRouter();
  const imgPlaceholder = ref('https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019');

  const viewOptions = [
    { label: 'Card View', value: 'card', icon: 'pi pi-table' },
    { label: 'List View', value: 'list', icon: 'pi pi-list' }
  ];

  // call google book api
  const searchBooks = async (term = '') => {
    loading.value = true;
    error.value = '';

    try {
      const query = encodeURIComponent(buildQuery() || defaultTerm);
      const apiUrl = `${bookApiUrl}/volumes?q=${query}&startIndex=${first.value}&maxResults=${rows.value}`
      const response = await axios.get(apiUrl);
      // console.log('apiUrl:', apiUrl);

      books.value = response.data.items || [];
      totalRecords.value = Math.min(response.data.totalItems || 0, 200); // set max items to 200
    } catch (err) {
      error.value = 'Failed to fetch books.';
    } finally {
      loading.value = false;
    }
  };

  // watch paginator changes
  watch(first, () => {
    searchBooks(query.value.trim() || defaultTerm);
  });

  // on page load, load with default search term
  onMounted(() => {
    searchBooks(defaultTerm) 
  })

  // use debounce 500ms for search on key press
  const debouncedSearch = useDebounceFn(() => {
    first.value = 0;
    searchBooks(query.value.trim() || defaultTerm)
  }, 500)

  const buildQuery = () => {
    const terms = [];
    if (bookName.value) terms.push(bookName.value);
    if (author.value) terms.push(`inauthor:${author.value}`);
    if (category.value) terms.push(`subject:${category.value}`);
    if (publisher.value) terms.push(`inpublisher:${publisher.value}`);
    console.log('search terms:', terms.join(' '));
    
    return terms.join(' ');
  };

  const goToBookDetails = (id: string, prevId?: string, nextId?: string) => {
  router.push({
    name: 'book-details',
    params: { id },
    query: {
      prev: prevId || '',
      next: nextId || ''
    }
  });
};
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col justify-center mt-6 lg:mt-12 mb-6">
      <div class="flex flex-row justify-center">
        <i class="flex items-center pi pi-book text-xl mr-2"></i>
        <h1 class="text-4xl font-bold">
          GOOGLE BOOKS
        </h1>
      </div>
      <p class="flex font-light justify-center">Search books using Google Books API</p>
    </div>
    
    <div class="flex flex-col justify-center mx-5 xl:mx-20">
      <div class="flex flex-row justify-center items-center gap-4 mb-6">
        <div class="flex justify-center sm:m-6">
          <InputGroup class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="col-span-1">
              <FloatLabel variant="on">
                <InputText 
                  id="bookName"
                  v-model="bookName" 
                  class="w-full" 
                  @input="debouncedSearch" />
                <label for="bookName">Book Name</label>
              </FloatLabel>
            </div>
            <div class="col-span-1">
              <FloatLabel variant="on">
                <InputText 
                  id="authorName"
                  v-model="author" 
                  class="w-full"
                  @input="debouncedSearch" />
                <label for="authorName">Author Name</label>
              </FloatLabel>
            </div>
            <div class="col-span-1">
              <FloatLabel variant="on">
                <InputText
                  id="category"
                  v-model="category" 
                  class="w-full" 
                  @input="debouncedSearch" />
                <label for="category">Category</label>
              </FloatLabel>
            </div>
            <div class="col-span-1">
              <FloatLabel variant="on">
                <InputText 
                  id="publisher"
                  v-model="publisher" 
                  class="w-full" 
                  @input="debouncedSearch" />
                <label for="publisher">Publisher Name</label>
              </FloatLabel>
            </div>
          </InputGroup>
        </div>
      </div>

      <div v-if="books.length">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div class="col-span-2 col-start-1 sm:col-start-2">
            <Paginator
              v-model:first="first"
              :rows="rows"
              :totalRecords="totalRecords"
              :rowsPerPageOptions="[12,24,40]"
              template="FirstPageLink PrevPageLink PageLinks NextPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
              class="w-full sm:w-auto"/>
          </div>

          <div class="mx-auto content-center">
            <SelectButton
              v-model="viewMode"
              :options="viewOptions"
              optionLabel="label"
              optionValue="value"
              dataKey="value"
              size="large">
              <template #option="slotProps">
                <i :class="slotProps.option.icon"></i>
              </template>
            </SelectButton>
          </div>
        </div>

        <div v-if="viewMode === 'card'" 
          class="grid gap-6 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
          <div v-for="(book, index) in books" :key="book.id" 
            class="hover:bg-surface-950 bg-surface-900 shadow-md rounded-lg p-4 cursor-pointer transition"
            @click="goToBookDetails(book.id, books[index - 1]?.id, books[index + 1]?.id)">
            <img
              v-if="book.volumeInfo.imageLinks?.thumbnail"
              :src="book.volumeInfo.imageLinks.thumbnail"
              alt="Book cover"
              class="w-full h-46 object-contain mb-4"/>
            <h2 class="text-lg font-semibold line-clamp-2 leading-tight">{{ book.volumeInfo.title }}</h2>
            <p class="text-sm text-gray-600 line-clamp-2 leading-tight">
              <span class="font-semibold">Author(s):</span> {{ book.volumeInfo.authors?.join(', ') || 'Unknown Author' }}
            </p>
            <p class="text-sm text-gray-600 line-clamp-2 leading-tight">
              <span class="font-semibold">Publisher:</span> {{ book.volumeInfo.publisher || 'Unknown Publisher' }}
            </p>
            <span class="text-sm font-semibold py-2">
              {{book.saleInfo?.listPrice?.currencyCode || null}} {{  + book.saleInfo?.listPrice?.amount || 'Unkown Price' }}
            </span>
          </div>
        </div>
        <div v-else 
          class="flex flex-col gap-3 xl:mx-50">
          <div v-for="book in books" :key="book.id"
            class="flex items-center gap-4 p-4 rounded hover:bg-surface-950 bg-surface-900 cursor-pointer transition"
            @click="router.push(`/book/${book.id}`)">
            <img
              v-if="book.volumeInfo.imageLinks?.thumbnail"
              :src="book.volumeInfo.imageLinks.thumbnail || imgPlaceholder"
              alt="Book cover"
              class="h-20 object-cover rounded"/>
            <div class="flex-1">
              <h3 class="text-lg font-semibold line-clamp-2 leading-tight">{{ book.volumeInfo.title }}</h3>
              
              <p class="text-sm text-gray-600 line-clamp-2 leading-tight">
                <span class="font-semibold">Author(s):</span> {{ book.volumeInfo.authors?.join(', ') || 'Unknown Author' }}
              </p>
              <p class="text-sm text-gray-600 line-clamp-2 leading-tight">
                <span class="font-semibold">Publisher:</span> {{ book.volumeInfo.publisher || 'Unknown Publisher' }}
              </p>
              
              <span class="text-sm font-semibold py-2">
                {{book.saleInfo?.listPrice?.currencyCode || null}} {{  + book.saleInfo?.listPrice?.amount || 'Unkown Price' }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-center mt-8">
          <Paginator
            v-model:first="first"
            :rows="rows"
            :totalRecords="totalRecords"
            :rowsPerPageOptions="[12,24,40]"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"/>
        </div>
      </div>
      <p class="flex justify-center mt-12" v-else-if="loading">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      </p>
      <p class="flex justify-center mt-12" v-else-if="error">{{ error }}</p>
    </div>
  </div>
  <ScrollTop></ScrollTop>
</template>

<style scoped></style>
