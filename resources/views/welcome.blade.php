@extends('layouts.app')

@section('title', 'bumbumi')

@section('content')
    <x-navbar :links="$links" />
    <x-sidebar :links="$links" />

    <main>
        <x-hero />
    </main>

    <footer class="border-t border-white/10 px-4 py-8 text-center text-sm text-white/50">
        &copy; {{ date('Y') }} bumbumi. All rights reserved.
    </footer>
@endsection
