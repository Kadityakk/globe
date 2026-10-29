<section
    id="beranda"
    x-data="globeHero"
    style="--globe: min(92vw, 720px, 88svh)"
    class="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-hero-space"
>
    <div class="bg-starfield pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden="true"></div>

    {{-- Kabut atmosfer di belakang globe, sedikit ke kiri (sisi yang terkena matahari) --}}
    <div class="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[calc(var(--globe)*0.8)] -translate-x-[58%] -translate-y-1/2 rounded-full bg-glow/20 blur-3xl" aria-hidden="true"></div>

    {{-- Globe di tengah hero --}}
    <div class="relative size-(--globe)">
        <div x-ref="canvas" class="size-full" :class="loading && 'opacity-0'" style="transition: opacity 1.2s ease"></div>

        <div x-show="loading" x-transition.opacity.duration.500ms class="absolute inset-0 flex justify-center flex-col items-center gap-3 text-sm text-white/60" role="status">
            <span class="size-8 animate-spin rounded-full border-2 border-white/15 border-t-glow-soft" aria-hidden="true"></span>
            Memuat globe…
        </div>

        <template x-if="fallback">
            <div class="absolute inset-0 flex flex-col items-center">
                <div class="globe-fallback absolute top-[8%] size-[84%] rounded-full" role="img" aria-label="Gambar statis bumi"></div>
                <p class="relative mt-[24%] max-w-64 rounded-xl bg-space-950/70 px-4 py-3 text-center text-sm text-white/80 ring-1 ring-white/10 backdrop-blur">
                    Browser Anda tidak mendukung WebGL, jadi globe interaktif tidak dapat ditampilkan.
                </p>
            </div>
        </template>
    </div>

    <x-country-card />
</section>
