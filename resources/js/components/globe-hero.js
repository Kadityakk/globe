import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import flagFontUrl from 'country-flag-emoji-polyfill/dist/TwemojiCountryFlags.woff2?url';

// Windows tidak punya emoji bendera bawaan, jadi muat font bendera hanya bila perlu
polyfillCountryFlagEmojis('Twemoji Country Flags', flagFontUrl);

const CONTINENTS = {
    Africa: 'Afrika',
    Antarctica: 'Antartika',
    Asia: 'Asia',
    Europe: 'Eropa',
    'North America': 'Amerika Utara',
    'South America': 'Amerika Selatan',
    Oceania: 'Oseania',
    'Seven seas (open ocean)': 'Samudra',
};

const flag = (iso) =>
    iso && iso.length === 2 ? String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 127397 + c.charCodeAt())) : '🏳️';

const coordinate = (value, positive, negative) => `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;

export default () => {
    // Instance globe disimpan di luar state Alpine agar objek Three.js tidak dibungkus proxy reaktif
    let globe = null;

    return {
        selected: null,
        loading: true,
        fallback: false,

        async init() {
            const { createGlobe, hasWebGL } = await import('../globe/createGlobe.js');

            if (!hasWebGL()) {
                this.fallback = true;
                this.loading = false;
                return;
            }

            try {
                globe = await createGlobe(this.$refs.canvas, {
                    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                    onCountryClick: (p) => {
                        this.selected = {
                            name: p.NAME_ID || p.NAME,
                            detail: CONTINENTS[p.CONTINENT] ?? p.CONTINENT,
                            flag: flag(p.ISO_A2),
                        };
                    },
                    onOceanClick: ({ lat, lng }) => {
                        this.selected = {
                            name: 'Lautan',
                            detail: `${coordinate(lat, 'LU', 'LS')}, ${coordinate(lng, 'BT', 'BB')}`,
                            flag: '🌊',
                        };
                    },
                });
            } catch (error) {
                console.error(error);
                this.fallback = true;
            }

            this.loading = false;
        },

        close() {
            this.selected = null;
            globe?.clearSelection();
        },

        destroy() {
            globe?.destroy();
        },
    };
};
