<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Putar bumi 3D dan klik negara mana saja untuk mengenal nama dan benuanya.">
        <meta name="theme-color" content="#05060f">

        <title>@yield('title', config('app.name'))</title>

        <link rel="preload" href="/textures/earth-day.webp" as="image" type="image/webp">

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="overflow-x-hidden bg-space-950 font-sans text-white antialiased">
        @yield('content')
    </body>
</html>
