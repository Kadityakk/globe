# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A university assignment (Pemrograman Web Framework): a single landing page at `/` with a desktop navbar, a mobile drawer sidebar, and a hero section containing a large interactive 3D globe (drag to rotate, click a country to show its flag/name/continent in an info card). **Tailwind CSS and Alpine.js are mandatory** per the assignment. The full spec is in `PRD.md` (Indonesian) — requirement codes like `NAV-01`, `SID-05`, `HER-07` refer to it; read it before implementing UI work. UI copy is in Indonesian.

Scope is frontend only: no database persistence, no external country APIs, sections below the hero are placeholders.

## Stack

- Laravel 13 (PHP ^8.3), Blade views, SQLite (`database/database.sqlite`). Runs under Laragon on Windows.
- Vite 8 + `laravel-vite-plugin` (fonts via `bunny()` in `vite.config.js`), Tailwind CSS v4 via `@tailwindcss/vite` — configured in CSS (`resources/css/app.css` `@theme`), there is no `tailwind.config.js`.
- Pest 4 for tests, Pint for formatting.
- `alpinejs` + `@alpinejs/focus`, `globe.gl` (Three.js), `country-flag-emoji-polyfill` (bundled flag font, since Windows has no flag emoji).

## Commands

```sh
composer setup            # first-time: install, .env, key, migrate, npm install + build
composer dev              # runs `php artisan dev` (server + vite etc.)
npm run dev               # Vite dev server only
npm run build             # production asset build

composer test             # clears config, runs the full suite
php artisan test --filter=SomeTest        # single test / test name
php artisan test tests/Feature/ExampleTest.php

vendor/bin/pint           # format PHP (vendor/bin/pint --dirty for changed files)
```

## Frontend architecture

Implemented per the PRD. The globe uses a custom day/night `ShaderMaterial` (sun fixed in view space: left side lit, right side city lights) with textures `earth-day.webp` + `earth-night.webp`. Layout uses `@extends('layouts.app')`; nav links are passed from `routes/web.php`.

- **Blade components** in `resources/views/components/` (`navbar`, `sidebar`, `hero`, `country-card`) composed in `welcome.blade.php` under `layouts/app.blade.php`.
- **Alpine components** registered in `resources/js/app.js` via `Alpine.data()` from `resources/js/components/` (`navbar.js`, `globe-hero.js`). Navbar and sidebar share drawer `open` state through `Alpine.store('ui')`, since the hamburger lives in a different component than the drawer.
- **Globe split**: Alpine (`globeHero`) owns state (`selected`, `loading`) and renders the info card as an HTML overlay; `resources/js/globe/createGlobe.js` wraps globe.gl and calls back into Alpine on country/ocean click. globe.gl must be loaded with dynamic `import()` so it stays out of the main bundle.
- **Static assets**: Natural Earth 110m GeoJSON at `public/data/countries-110m.geojson` (properties `NAME`/`NAME_ID`, `CONTINENT`, `ISO_A2`; flags are derived as emoji from `ISO_A2`), earth texture at `public/textures/earth-day.webp`.
- Key non-functional constraints: pause rendering when hero is off-screen or tab hidden, cap `pixelRatio` at 2, disable zoom (so page scroll works on mobile), disable auto-rotate under `prefers-reduced-motion`, info card uses `aria-live="polite"`, WebGL fallback image.

## Laravel Boost

Laravel Boost is installed (`boost.json`, skills in `.claude/skills/`: laravel-best-practices, testing-best-practices, tailwindcss-development, infer-conventions, deploying-to-cloud). The block below is managed by Boost (`php artisan boost:update` runs on `composer update`) — don't hand-edit it.

<laravel-boost-guidelines>
# Laravel Application

This repository contains a Laravel application. Complete the following setup before working on the user's request.

## Prerequisites

Verify that PHP and Composer are available:

```sh
php -v
composer -V
```

If either command is unavailable, detect the user's operating system and install the prerequisites with the appropriate command:

macOS:

```sh
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.5)"
```

Windows PowerShell:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.5'))
```

Linux:

```sh
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.5)"
```

After installation, ask the user to restart their terminal. If the agent needs the restarted shell to continue, ask the user to reopen their terminal and rerun their original prompt.

## Agent Setup

Install Laravel Boost from the application root before making application changes:

```sh
composer require laravel/boost --dev
php artisan boost:install
```

Boost replaces these bootstrap instructions with guidelines tailored to the application. After installation, read `AGENTS.md` again and continue with the user's original request using the generated guidelines.
</laravel-boost-guidelines>
