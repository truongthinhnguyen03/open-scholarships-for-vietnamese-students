<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let searchQuery = '';
  export let placeholder = 'Search...';

  const dispatch = createEventDispatcher();

  let searchInput: HTMLInputElement;

  function handleInput() {
    dispatch('search', searchQuery);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      dispatch('search', searchQuery);
    }
  }

  function clearSearch() {
    searchQuery = '';
    dispatch('search', searchQuery);
    searchInput?.focus();
  }
</script>

<div class="w-full">
  <label for="search-input" class="sr-only">Search scholarships</label>
  <div class="relative flex items-center">
    <svg class="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
    </svg>
    <input
      id="search-input"
      bind:this={searchInput}
      bind:value={searchQuery}
      type="text"
      {placeholder}
      class="w-full pl-10 pr-10 py-3 md:py-3 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      on:input={handleInput}
      on:keydown={handleKeydown}
      aria-label="Search scholarships"
    />
    {#if searchQuery}
      <button
        type="button"
        class="absolute right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        on:click={clearSearch}
        aria-label="Clear search"
      >
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    {/if}
  </div>
</div>

 