export default () => ({
    scrolled: false,

    init() {
        const onScroll = () => (this.scrolled = window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Drawer tidak relevan lagi begitu layar melebar ke ukuran desktop
        window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
            if (e.matches) this.$store.ui.close();
        });

        // Scrollspy untuk indikator menu aktif (NAV-03)
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) this.$store.ui.active = entry.target.id;
                });
            },
            { rootMargin: '-45% 0px -50% 0px' },
        );
        document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    },
});
