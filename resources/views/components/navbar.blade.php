@props(['links'])

<header
    x-data="navbar"
    :class="scrolled ? 'border-white/10 bg-space-950/70 shadow-lg shadow-black/20 backdrop-blur-xl' : 'border-transparent bg-transparent'"
    class="fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300"
>
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8" aria-label="Navigasi utama">
        <x-logo />

        <ul class="hidden items-center gap-1 lg:flex">
            @foreach ($links as $id => $label)
                <li>
                    <a
                        href="#{{ $id }}"
                        :aria-current="$store.ui.active === '{{ $id }}' ? 'page' : null"
                        :class="$store.ui.active === '{{ $id }}' ? 'text-white after:scale-x-100' : 'text-white/65 hover:text-white after:scale-x-0'"
                        class="relative rounded-lg px-4 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:origin-center after:rounded-full after:bg-white after:transition-transform after:duration-300 focus-visible:outline-2 focus-visible:outline-glow-soft"
                    >{{ $label }}</a>
                </li>
            @endforeach
        </ul>

        <button
            type="button"
            @click="$store.ui.toggle()"
            :aria-expanded="$store.ui.open.toString()"
            aria-expanded="false"
            aria-controls="mobile-drawer"
            class="grid size-11 place-items-center rounded-xl text-white/85 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-glow-soft lg:hidden"
        >
            <span class="sr-only">Buka menu</span>
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h10" />
            </svg>
        </button>
    </nav>
</header>
