import Globe from 'globe.gl';
import { ShaderMaterial, TextureLoader, Vector3 } from 'three';

const DAY_TEXTURE = '/textures/earth-day.webp';
const NIGHT_TEXTURE = '/textures/earth-night.webp';
const COUNTRIES = '/data/countries-110m.geojson';

// Matahari tetap di kiri-atas relatif terhadap kamera, jadi sisi kiri selalu siang
// dan sisi kanan malam, persis seperti komposisi referensi.
const SUN_DIRECTION = new Vector3(-0.95, 0.3, 0.08).normalize();

const vertexShader = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = /* glsl */ `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform vec3 sunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
        vec3 normal = normalize(vNormal);
        float sun = dot(normal, sunDirection);

        // Terminator halus, bukan garis tajam
        float dayMix = smoothstep(-0.12, 0.3, sun);
        vec3 day = texture2D(dayTexture, vUv).rgb * (0.35 + 0.8 * smoothstep(-0.1, 0.7, sun));

        // Tekstur malam berwarna biru keabuan; ambil hanya titik lampu kota yang terang
        vec3 night = texture2D(nightTexture, vUv).rgb;
        float lights = smoothstep(0.08, 0.4, max(night.r, night.g) - night.b * 0.35);
        vec3 city = night * vec3(0.06, 0.08, 0.14) + lights * vec3(0.984, 0.749, 0.141) * 1.6;

        vec3 color = mix(city, day, dayMix);

        // Glow atmosfer di tepi, paling kuat di sisi yang terkena matahari
        float fresnel = pow(1.0 - max(dot(normal, normalize(vViewDir)), 0.0), 2.4);
        vec3 rim = mix(vec3(0.231, 0.510, 0.965), vec3(0.376, 0.647, 0.980), fresnel);
        color += rim * fresnel * (0.12 + 1.1 * smoothstep(-0.4, 0.6, sun));

        gl_FragColor = vec4(color, 1.0);
    }
`;

async function loadTexture(loader, url) {
    const texture = await loader.loadAsync(url);
    texture.anisotropy = 4;
    return texture;
}

export function hasWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
    } catch {
        return false;
    }
}

export async function createGlobe(el, { onCountryClick, onOceanClick, reducedMotion = false }) {
    const loader = new TextureLoader();
    const [dayTexture, nightTexture, countries] = await Promise.all([
        loadTexture(loader, DAY_TEXTURE),
        loadTexture(loader, NIGHT_TEXTURE),
        fetch(COUNTRIES).then((res) => res.json()),
    ]);

    const material = new ShaderMaterial({
        uniforms: {
            dayTexture: { value: dayTexture },
            nightTexture: { value: nightTexture },
            sunDirection: { value: SUN_DIRECTION },
        },
        vertexShader,
        fragmentShader,
    });

    let hovered = null;
    let selected = null;

    const globe = new Globe(el, { rendererConfig: { antialias: true, alpha: true } })
        .width(el.clientWidth)
        .height(el.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .globeMaterial(material)
        .showAtmosphere(true)
        .atmosphereColor('#3b82f6')
        .atmosphereAltitude(0.16)
        .polygonsData(countries.features)
        .polygonsTransitionDuration(reducedMotion ? 0 : 250)
        .polygonLabel(({ properties: p }) => `<span class="rounded-lg bg-space-950/80 px-2.5 py-1 text-sm font-medium text-white ring-1 ring-white/15">${p.NAME_ID}</span>`)
        .onPolygonHover((polygon) => {
            hovered = polygon;
            paint();
        })
        .onPolygonClick((polygon, event, { lat, lng }) => {
            selected = polygon;
            paint();
            hold();
            focus(lat, lng);
            onCountryClick?.(polygon.properties);
        })
        .onGlobeClick(({ lat, lng }) => {
            selected = null;
            paint();
            hold();
            onOceanClick?.({ lat, lng });
        });

    // Negara terpilih berwarna emas (lampu kota), hover biru (glow), sisanya transparan
    function paint() {
        globe
            .polygonCapColor((d) =>
                d === selected ? 'rgba(251, 191, 36, 0.55)' : d === hovered ? 'rgba(96, 165, 250, 0.35)' : 'rgba(0, 0, 0, 0)',
            )
            .polygonSideColor((d) => (d === selected ? 'rgba(251, 191, 36, 0.25)' : d === hovered ? 'rgba(96, 165, 250, 0.15)' : 'rgba(0, 0, 0, 0)'))
            .polygonStrokeColor((d) =>
                d === selected ? 'rgba(253, 230, 138, 0.9)' : d === hovered ? 'rgba(191, 219, 254, 0.8)' : 'rgba(255, 255, 255, 0.04)',
            )
            .polygonAltitude((d) => (d === selected ? 0.035 : d === hovered ? 0.02 : 0.004));
    }
    paint();

    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globe.pointOfView({ lat: 15, lng: 25, altitude: 1.75 });

    // Drag saja: tanpa zoom & pan agar scroll halaman tidak terganggu (HER-05)
    const controls = globe.controls();
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotateSpeed = 0.45;

    // Auto-rotate berhenti saat di-drag dan lanjut setelah 3 detik diam (HER-04).
    // Selama kartu info terbuka, globe tetap diam agar titik yang diklik tetap terlihat.
    let resumeTimer;
    let held = false;
    const canRotate = () => !reducedMotion && !held;
    controls.autoRotate = canRotate();

    function hold() {
        held = true;
        clearTimeout(resumeTimer);
        controls.autoRotate = false;
    }

    // Arahkan kamera ke titik yang diklik agar titik itu berada di tengah globe
    function focus(lat, lng) {
        globe.pointOfView({ lat: Math.max(-60, Math.min(60, lat)), lng, altitude: 1.75 }, reducedMotion ? 0 : 900);
    }
    controls.addEventListener('start', () => {
        clearTimeout(resumeTimer);
        controls.autoRotate = false;
    });
    controls.addEventListener('end', () => {
        resumeTimer = setTimeout(() => (controls.autoRotate = canRotate()), 3000);
    });

    // Rendering dijeda saat globe di luar viewport atau tab tidak aktif
    let inView = true;
    const syncAnimation = () => (inView && !document.hidden ? globe.resumeAnimation() : globe.pauseAnimation());
    const visibilityObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncAnimation();
    });
    visibilityObserver.observe(el);
    document.addEventListener('visibilitychange', syncAnimation);

    const resizeObserver = new ResizeObserver(() => globe.width(el.clientWidth).height(el.clientHeight));
    resizeObserver.observe(el);

    return {
        clearSelection() {
            selected = null;
            held = false;
            paint();
            controls.autoRotate = canRotate();
        },
        destroy() {
            clearTimeout(resumeTimer);
            visibilityObserver.disconnect();
            resizeObserver.disconnect();
            document.removeEventListener('visibilitychange', syncAnimation);
            globe._destructor();
        },
    };
}
