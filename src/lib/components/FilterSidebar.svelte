<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { StudyLevel, Scholarship } from '$lib/types/scholarship';

  export let activeFilters: string[] = [];
  export let totalScholarships = 0;
  export let filteredCount = 0;
  export let scholarships: Scholarship[] = [];

  const dispatch = createEventDispatcher<{
    filterChange: string[];
  }>();

  const studyLevels: { value: StudyLevel; label: string; description: string }[] = [
    { value: 'undergraduate', label: 'Undergraduate', description: 'Bachelor\'s degree programs' },
    { value: 'postgraduate', label: 'Postgraduate', description: 'Master\'s and PhD programs' },
    { value: 'short-term', label: 'Short-term', description: 'Short courses and programs' },
    { value: 'research', label: 'Research', description: 'Research opportunities and fellowships' }
  ];

  function toggleFilter(level: StudyLevel) {
    const newFilters = activeFilters.includes(level)
      ? activeFilters.filter(f => f !== level)
      : [...activeFilters, level];
    
    activeFilters = newFilters;
    dispatch('filterChange', newFilters);
  }

  function clearAllFilters() {
    activeFilters = [];
    dispatch('filterChange', []);
  }

  function getFilterCount(level: StudyLevel): number {
    return scholarships.filter(scholarship => 
      scholarship.level.includes(level)
    ).length;
  }
</script>

<aside class="bg-white border border-gray-200 rounded-lg p-4 md:p-6 h-fit" aria-label="Filter options">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold text-gray-800">Filter</h2>
    {#if activeFilters.length}
      <button
        type="button"
        class="px-3 py-2 text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors min-h-[44px]"
        on:click={clearAllFilters}
        aria-label="Clear all filters"
      >
        Clear all
      </button>
    {/if}
  </div>

  <div class="mb-6 p-3 bg-gray-50 rounded-lg text-center" role="status" aria-live="polite">
    <span class="text-sm text-gray-600 font-medium">
      {filteredCount} of {totalScholarships} scholarships
    </span>
  </div>

  <div>
    <h3 class="text-base font-semibold text-gray-800 mb-4">Study Level</h3>
    <div class="flex flex-col gap-3" role="group" aria-labelledby="study-level-filters">
      {#each studyLevels as { value, label }}
        <label class="flex items-center gap-3 cursor-pointer px-3 py-3 rounded hover:bg-gray-50 transition-colors min-h-[44px]">
          <input
            type="checkbox"
            checked={activeFilters.includes(value)}
            on:change={() => toggleFilter(value)}
            class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-800 flex-1">{label}</span>
          <span class="text-xs text-gray-500">({getFilterCount(value)})</span>
        </label>
      {/each}
    </div>
  </div>

  {#if activeFilters.length > 0}
    <div class="border-t border-gray-200 pt-4 mt-4">
      <h3 class="text-sm font-semibold text-gray-600 mb-3">Active Filters</h3>
      <div class="flex flex-wrap gap-2">
        {#each activeFilters as filter}
          <button
            type="button"
            class="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded text-xs font-medium hover:bg-blue-600 transition-colors capitalize min-h-[44px]"
            on:click={() => toggleFilter(filter as StudyLevel)}
            aria-label="Remove {filter} filter"
          >
            {filter}
            <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</aside>

 