<script lang="ts">
  import type { PageData } from './$types';
  import ScholarshipCard from '$lib/components/ScholarshipCard.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import FilterSidebar from '$lib/components/FilterSidebar.svelte';
  import { filterScholarshipsBySearch } from '$lib/utils/search';

  export let data: PageData;

  let scholarships = data.scholarships;
  let filteredScholarships = scholarships;
  let searchQuery = '';
  let activeFilters: string[] = [];
  let isLoading = false;
  let currentPage = 1;
  const itemsPerPage = 100;

  // Pagination
  $: totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = startIndex + itemsPerPage;
  $: displayedScholarships = filteredScholarships.slice(startIndex, endIndex);

  function handleSearch(event: CustomEvent<string>) {
    searchQuery = event.detail;
    currentPage = 1;
    applyFilters();
  }

  function handleFilterChange(event: CustomEvent<string[]>) {
    activeFilters = event.detail;
    currentPage = 1;
    applyFilters();
  }

  function applyFilters() {
    isLoading = true;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      let filtered = scholarships;

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filterScholarshipsBySearch(filtered, searchQuery);
      }

      // Apply level filters
      if (activeFilters.length > 0) {
        filtered = filtered.filter(scholarship =>
          scholarship.level.some(level => activeFilters.includes(level))
        );
      }

      filteredScholarships = filtered;
      isLoading = false;
    }, 100);
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function clearAllFilters() {
    searchQuery = '';
    activeFilters = [];
    currentPage = 1;
    filteredScholarships = scholarships;
  }
</script>

<svelte:head>
  <title>Open Scholarships for Vietnamese Students</title>
  <meta name="description" content="" />
</svelte:head>

<main class="min-h-screen">
  <header class="bg-gray-900 text-white border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center py-3 md:py-4">
      <h1 class="text-lg md:text-xl font-semibold">Open Scholarships for Vietnamese Students</h1>
      <a 
        href="https://github.com/truongthinhnguyen03/open-scholarships-for-vietnamese-students" 
        target="_blank" 
        rel="noopener noreferrer"
        class="text-white hover:text-gray-300 transition-colors p-2"
        aria-label="View project on GitHub"
      >
        <svg class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  </header>
  <div class="my-4 md:my-8">
    <div class="max-w-7xl mx-auto my-2 px-4 md:px-2">
        <SearchBar 
        bind:searchQuery 
        on:search={handleSearch}
        placeholder="Search scholarships by name, eligibility, or benefits..."
        />
    </div>



    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 md:gap-0 min-h-[calc(100vh-200px)]">
        <!-- Desktop/Tablet Sidebar -->
        <aside class="hidden md:block p-2" aria-label="Filter options">
        <FilterSidebar 
            bind:activeFilters 
            on:filterChange={handleFilterChange}
            totalScholarships={scholarships.length}
            filteredCount={filteredScholarships.length}
            {scholarships}
        />
        </aside>

        <section class="px-4 lg:px-2" aria-label="Scholarship listings">
        {#if isLoading}
            <div class="flex flex-col items-center justify-center py-12 text-center" aria-live="polite">
            <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" aria-hidden="true"></div>
            <p class="text-gray-600">Searching scholarships...</p>
            </div>
        {:else if filteredScholarships.length === 0}
            <div class="text-center py-12" role="status">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">No scholarships found</h2>
            <p class="text-gray-600 mb-6">
                {searchQuery || activeFilters.length > 0 
                ? 'Try adjusting your search terms or filters to find more scholarships.'
                : 'No scholarships are currently available. Please check back later.'
                }
            </p>
            {#if searchQuery || activeFilters.length > 0}
                <button 
                type="button" 
                class="w-full sm:w-auto px-4 py-3 text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors min-h-[44px]"
                on:click={clearAllFilters}
                >
                Clear all filters
                </button>
            {/if}
            </div>
        {:else}
            <div class="flex flex-col" role="list" aria-label="Scholarship listings">
            {#each displayedScholarships as scholarship (scholarship.name)}
                <div class="py-2" role="listitem">
                <ScholarshipCard {scholarship} {searchQuery} />
                </div>
            {/each}
            </div>

            {#if totalPages > 1}
            <nav class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8" aria-label="Pagination">
                <button 
                type="button" 
                class="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors min-h-[44px]"
                disabled={currentPage === 1}
                on:click={() => goToPage(currentPage - 1)}
                aria-label="Go to previous page"
                >
                Previous
                </button>
                
                <span class="text-sm text-gray-600 font-medium text-center">
                Page {currentPage} of {totalPages}
                </span>
                
                <button 
                type="button" 
                class="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors min-h-[44px]"
                disabled={currentPage === totalPages}
                on:click={() => goToPage(currentPage + 1)}
                aria-label="Go to next page"
                >
                Next
                </button>
            </nav>
            {/if}
        {/if}
        </section>
    </div>
  </div>
</main>


