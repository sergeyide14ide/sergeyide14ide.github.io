(function() {
    'use strict';
    
    if (window.netflix_style_loaded) return;
    window.netflix_style_loaded = true;

    const css = `
.layer--wheight.netflix-style { background: #141414 !important; }
.netflix-style .full-start { padding: 0 !important; min-height: 90vh; position: relative; display: flex; align-items: flex-end; }
.netflix-style .full-start__background { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 0 !important; object-fit: cover; mask-image: none !important; opacity: 0 !important; transition: opacity 0.6s ease !important; }
.netflix-style .full-start__background.loaded { opacity: 0.35 !important; }
.netflix-style .full-start::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, #141414 0%, #141414 40%, transparent 100%); z-index: 1; pointer-events: none; }
.netflix-style .full-start::after { content: ''; position: fixed; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(to top, #141414 0%, transparent 100%); z-index: 1; pointer-events: none; }
.netflix-style .full-start__body { position: relative; z-index: 2; padding: 2em 4em 4em 4em !important; width: 100%; max-width: 50%; }
.netflix-style .full-start__right { display: none !important; }
.netflix-style .full-start__left { width: 100% !important; max-width: none !important; padding: 0 !important; }
.netflix-style .full-start-new__title { font-size: 4.5em !important; font-weight: 800 !important; line-height: 1 !important; margin-bottom: 0.3em !important; text-shadow: 2px 2px 12px rgba(0,0,0,0.9); letter-spacing: -0.02em; }
.netflix-style .full-start-new__original-title { font-size: 1.6em !important; opacity: 0.7 !important; margin-bottom: 1.2em !important; }
.netflix-style .full--tagline { font-size: 1.7em !important; font-style: italic !important; opacity: 0.85 !important; margin-bottom: 1.5em !important; }
.netflix-style .full-start__tags { gap: 1em !important; margin-bottom: 2em !important; }
.netflix-style .full-start__tags .tag { background: rgba(255,255,255,0.15) !important; backdrop-filter: blur(10px); padding: 0.5em 1.2em !important; border-radius: 0.3em !important; font-size: 1.1em !important; border: 1px solid rgba(255,255,255,0.2) !important; }
.netflix-style .full-start-new__description { font-size: 1.4em !important; line-height: 1.6 !important; margin-bottom: 2.5em !important; text-shadow: 1px 1px 6px rgba(0,0,0,0.8); }
.netflix-style .full-start-new__buttons { gap: 1em !important; margin-top: 2em !important; }
.netflix-style .full-start-new__buttons .button { padding: 1.2em 3em !important; font-size: 1.3em !important; font-weight: 700 !important; border-radius: 0.4em !important; transition: all 0.2s ease !important; text-transform: uppercase; letter-spacing: 0.05em; }
.netflix-style .full-start-new__buttons .button--play, .netflix-style .full-start-new__buttons .button.view--torrent { background: #fff !important; color: #000 !important; border: none !important; }
.netflix-style .full-start-new__buttons .button--play:hover, .netflix-style .full-start-new__buttons .button.view--torrent:hover { background: rgba(255,255,255,0.85) !important; transform: scale(1.05); }
.netflix-style .full-start-new__buttons .button:not(.button--play):not(.view--torrent) { background: rgba(255,255,255,0.15) !important; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3) !important; }
.netflix-style .full-start-new__buttons .button:not(.button--play):not(.view--torrent):hover { background: rgba(255,255,255,0.25) !important; transform: scale(1.05); }
.netflix-style .rate { background: rgba(0,0,0,0.7) !important; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2) !important; }
.netflix-style .full-descr, .netflix-style .full-persons, .netflix-style .card--collection { padding-left: 4em !important; padding-right: 4em !important; }
@media (max-width: 1400px) { .netflix-style .full-start__body { max-width: 60%; } .netflix-style .full-start-new__title { font-size: 3.8em !important; } }
@media (max-width: 1024px) { .netflix-style .full-start__body { max-width: 70%; padding: 2em 3em 3em 3em !important; } .netflix-style .full-start-new__title { font-size: 3.2em !important; } .netflix-style .full-descr, .netflix-style .full-persons, .netflix-style .card--collection { padding-left: 3em !important; padding-right: 3em !important; } }
@media (max-width: 768px) { .netflix-style .full-start::before { background: linear-gradient(to bottom, transparent 0%, #141414 60%); } .netflix-style .full-start__body { max-width: 100%; padding: 2em 2em 3em 2em !important; } .netflix-style .full-start-new__title { font-size: 2.8em !important; } .netflix-style .full-start-new__description { font-size: 1.2em !important; } .netflix-style .full-start-new__buttons .button { padding: 1em 2.5em !important; font-size: 1.1em !important; } .netflix-style .full-descr, .netflix-style .full-persons, .netflix-style .card--collection { padding-left: 2em !important; padding-right: 2em !important; } }
@keyframes nfx { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.netflix-style .full-start__left > * { animation: nfx 0.5s ease-out backwards; }
.netflix-style .full-start-new__title { animation-delay: 0.05s; }
.netflix-style .full-start-new__original-title { animation-delay: 0.1s; }
.netflix-style .full--tagline { animation-delay: 0.15s; }
.netflix-style .full-start__tags { animation-delay: 0.2s; }
.netflix-style .full-start-new__description { animation-delay: 0.25s; }
.netflix-style .full-start-new__buttons { animation-delay: 0.3s; }
    `;

    $('<style>').attr('id', 'netflix-css').text(css).appendTo('head');

    Lampa.Listener.follow('activity', function(e) {
        if (e.component === 'full' && e.type === 'create') {
            e.object.activity.render().addClass('netflix-style');
        }
    });

})();
