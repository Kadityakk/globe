@props(['eyebrow', 'title'])

<section {{ $attributes->class('border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8') }}>
    <div class="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <p class="text-sm font-semibold tracking-wide text-glow-soft uppercase">{{ $eyebrow }}</p>
        <h2 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{{ $title }}</h2>
        <p class="text-pretty text-white/65">{{ $slot }}</p>
        <div class="mt-6 h-40 w-full rounded-2xl border border-dashed border-white/15 bg-white/2" aria-hidden="true"></div>
    </div>
</section>
