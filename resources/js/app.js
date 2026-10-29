import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import navbar from './components/navbar.js';
import globeHero from './components/globe-hero.js';

Alpine.plugin(focus);

// Dibagi navbar & sidebar: tombol hamburger ada di navbar, drawer di komponen lain
Alpine.store('ui', {
    open: false,
    active: 'beranda',
    toggle() {
        this.open = !this.open;
    },
    close() {
        this.open = false;
    },
});

Alpine.data('navbar', navbar);
Alpine.data('globeHero', globeHero);

window.Alpine = Alpine;
Alpine.start();
