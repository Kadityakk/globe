@props(['links'])

<div
    x-data
    x-cloak
    x-show="$store.ui.open"
    @keydown.escape.window="$store.ui.close()"
    class="fixed inset-0 z-50 lg:hidden"
>
    <div
        x-show="$store.ui.open"
        x-transition:enter="transition-opacity duration-300 ease-out"
        x-transition:enter-start="opacity-0"
        x-transition:leave="transition-opacity duration-200 ease-in"
        x-transition:leave-end="opacity-0"
        @click="$store.ui.close()"
        class="absolute inset-0 bg-space-950/75 backdrop-blur-sm"
        aria-hidden="true"
    ></div>

    <aside
        id="mobile-drawer"
        x-show="$store.ui.open"
        x-trap.noscroll="$store.ui.open"
        x-transition:enter="transition-transform duration-300 ease-out"
        x-transition:enter-start="-translate-x-full"
        x-transition:leave="transition-transform duration-200 ease-in"
        x-transition:leave-end="-translate-x-full"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        tabindex="-1"
        class="absolute inset-y-0 left-0 flex outline-none w-4/5 max-w-80 flex-col border-r border-white/10 bg-linear-to-b from-space-900 via-space-950 to-space-950 shadow-2xl shadow-black/60"
    >
        <div class="flex h-16 items-center justify-between px-4">
            <x-logo x-on:click="$store.ui.close()" />
            <button
                type="button"
                @click="$store.ui.close()"
                class="grid size-11 place-items-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-glow-soft"
            >
                <span class="sr-only">Tutup menu</span>
                <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
            </button>
        </div>

        <nav class="flex-1 px-3 py-4" aria-label="Navigasi mobile">
            <ul class="flex flex-col gap-1">
                @foreach ($links as $id => $label)
                    <li>
                        <a
                            href="#{{ $id }}"
                            @click="$store.ui.close()"
                            :aria-current="$store.ui.active === '{{ $id }}' ? 'page' : null"
                            :class="$store.ui.active === '{{ $id }}' ? 'bg-white/8 text-white before:opacity-100' : 'text-white/70 hover:bg-white/5 hover:text-white before:opacity-0'"
                            class="relative flex items-center rounded-xl px-4 py-3 text-base font-medium transition before:absolute before:inset-y-2.5 before:left-0 before:w-1 before:rounded-full before:bg-linear-to-b before:from-glow-soft before:to-violet-400 before:transition-opacity focus-visible:outline-2 focus-visible:outline-glow-soft"
                        >{{ $label }}</a>
                    </li>
                @endforeach
            </ul>
        </nav>
    </aside>
</div>
