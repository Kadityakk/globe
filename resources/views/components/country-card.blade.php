<div aria-live="polite" class="absolute inset-x-4 bottom-4 z-20 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-80 lg:right-8 lg:bottom-8">
    <div
        x-show="selected"
        x-cloak
        x-transition:enter="transition duration-200 ease-out"
        x-transition:enter-start="translate-y-2 opacity-0"
        x-transition:leave="transition duration-150 ease-in"
        x-transition:leave-end="translate-y-2 opacity-0"
        class="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-space-900/70 p-4 pr-12 shadow-2xl shadow-black/50 backdrop-blur-xl"
    >
        <span class="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-city to-amber-600" aria-hidden="true"></span>

        <span class="grid size-14 shrink-0 place-items-center rounded-xl bg-white/5 text-4xl leading-none ring-1 ring-white/10" x-text="selected?.flag"></span>

        <div class="min-w-0">
            <p class="text-xs font-medium tracking-wide text-city/90 uppercase" x-text="selected?.name === 'Lautan' ? 'Titik di laut' : 'Negara terpilih'"></p>
            <p class="truncate text-lg font-semibold" x-text="selected?.name"></p>
            <p class="text-sm text-white/65" x-text="selected?.detail"></p>
        </div>

        <button
            type="button"
            @click="close()"
            class="absolute top-2 right-2 grid size-9 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-glow-soft"
        >
            <span class="sr-only">Tutup kartu info</span>
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
        </button>
    </div>
</div>
