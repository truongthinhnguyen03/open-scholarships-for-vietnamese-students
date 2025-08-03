<script lang="ts">
  import type { Scholarship } from '$lib/types/scholarship';

  export let scholarship: Scholarship;

  function formatLevels(levels: string[]): string {
    if (levels.length === 0) return 'Not specified';
    return levels
      .map(level => level.charAt(0).toUpperCase() + level.slice(1))
      .join(', ');
  }

  function hasDeadline(): boolean {
    return Boolean(scholarship.deadline && scholarship.deadline.trim() !== '');
  }

  function hasOpens(): boolean {
    return Boolean(scholarship.opens && scholarship.opens.trim() !== '');
  }
</script>

<article class="bg-white border border-gray-200 rounded-lg p-4" aria-labelledby="scholarship-title-{scholarship.name}">
  <header class="flex justify-between items-start mb-3">
    <div class="flex-1">
      <h3 id="scholarship-title-{scholarship.name}" class="text-lg font-semibold text-gray-900 leading-tight">
        {#if scholarship.link}
          <a href={scholarship.link} target="_blank" rel="noopener noreferrer" class="text-gray-900 hover:underline">
            {scholarship.name}
            <span class="sr-only">(opens in new tab)</span>
          </a>
        {:else}
          {scholarship.name}
        {/if}
      </h3>
    </div>
    
    {#if scholarship.link}
      <a 
        href={scholarship.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        class="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
        aria-describedby="scholarship-title-{scholarship.name}"
      >
        Apply
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
      </a>
    {/if}
  </header>

  <div class="mb-3">
    <p class="text-sm text-gray-600 leading-relaxed">{scholarship.eligibility}</p>
  </div>

  <footer class="flex justify-between items-center text-xs text-gray-500">
    <div class="flex gap-4">
      <div class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>{formatLevels(scholarship.level)}</span>
      </div>
      
      <div class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
        <span>
          {#if hasOpens()}Mở đơn: {scholarship.opens}{/if}
          {#if hasOpens() && hasDeadline()} • {/if}
          {#if hasDeadline()}Hạn cuối: {scholarship.deadline}{/if}
        </span>
      </div>
    </div>
  </footer>
</article>

 