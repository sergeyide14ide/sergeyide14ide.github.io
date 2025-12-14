/**
 * Apple TV+ Style Plugin - ПРАВИЛЬНАЯ реализация
 * Переопределяет стили ДО рендеринга, без мерцаний
 */

(function() {
    'use strict';

    if (window.appletv_style_loaded) return;
    window.appletv_style_loaded = true;

    const style = document.createElement('style');
    style.id = 'appletv-style-css';
    style.textContent = `
/* Apple TV+ Style - Clean & Professional */
.appletv-full {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
}

.appletv-full .full-start {
    padding: 0 !important;
    position: relative;
}

.appletv-full .full-start__background {
    position: absolute !important;
    top: -8em !important;
    left: 0 !important;
    width: 100% !important;
    height: 45em !important;
    z-index: 0 !important;
    object-fit: cover;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%) !important;
    filter: blur(35px) saturate(1.4);
    opacity: 0 !important;
    transition: opacity 0.7s ease !important;
}

.appletv-full .full-start__background.loaded {
    opacity: 0.5 !important;
}

.appletv-full .full-start__body {
    position: relative;
    z-index: 1;
    padding: 8em 5em 3em 5em !important;
    gap: 4em !important;
    align-items: center !important;
}

.appletv-full .full-start__right {
    order: 1 !important;
}

.appletv-full .full-start__poster {
    width: 22em !important;
    height: 33em !important;
    border-radius: 1.2em !important;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.22);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.appletv-full .full-start__poster:hover {
    transform: scale(1.05) translateY(-8px);
    box-shadow: 0 30px 80px rgba(0,0,0,0.35), 0 15px 40px rgba(0,0,0,0.25);
}

.appletv-full .full-start__left {
    order: 2 !important;
    max-width: 50em !important;
    padding: 0 !important;
}

.appletv-full .full-start-new__title {
    font-size: 4.8em !important;
    font-weight: 800 !important;
    line-height: 0.95 !important;
    margin-bottom: 0.25em !important;
    color: #1d1d1f !important;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #1d1d1f 0%, #424245 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.appletv-full .full-start-new__original-title {
    font-size: 1.7em !important;
    color: #86868b !important;
    margin-bottom: 1.2em !important;
    font-weight: 400 !important;
}

.appletv-full .full--tagline {
    font-size: 1.8em !important;
    font-style: normal !important;
    color: #424245 !important;
    margin-bottom: 1.5em !important;
    font-weight: 500 !important;
    line-height: 1.25;
}

.appletv-full .full-start__tags {
    gap: 1em !important;
    margin-bottom: 2.5em !important;
}

.appletv-full .full-start__tags .tag {
    background: rgba(255,255,255,0.85) !important;
    backdrop-filter: blur(20px) saturate(180%);
    padding: 0.6em 1.3em !important;
    border-radius: 1em !important;
    font-size: 1.05em !important;
    font-weight: 600 !important;
    color: #1d1d1f !important;
    border: 1px solid rgba(255,255,255,0.4) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.appletv-full .full-start-new__description {
    font-size: 1.35em !important;
    line-height: 1.65 !important;
    margin-bottom: 2em !important;
    color: #1d1d1f !important;
    font-weight: 400 !important;
}

.appletv-full .full-start-new__buttons {
    gap: 1em !important;
    margin-top: 2.5em !important;
}

.appletv-full .full-start-new__buttons .button {
    padding: 1.1em 3.2em !important;
    font-size: 1.15em !important;
    font-weight: 600 !important;
    border-radius: 1.5em !important;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}

.appletv-full .full-start-new__buttons .button--play,
.appletv-full .full-start-new__buttons .button.view--torrent {
    background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%) !important;
    color: #fff !important;
    border: none !important;
}

.appletv-full .full-start-new__buttons .button--play:hover,
.appletv-full .full-start-new__buttons .button.view--torrent:hover {
    background: linear-gradient(135deg, #0077ed 0%, #0061c1 100%) !important;
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,113,227,0.4);
}

.appletv-full .full-start-new__buttons .button:not(.button--play):not(.view--torrent) {
    background: rgba(255,255,255,0.9) !important;
    color: #1d1d1f !important;
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.4) !important;
}

.appletv-full .full-start-new__buttons .button:not(.button--play):not(.view--torrent):hover {
    background: rgba(255,255,255,1) !important;
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.appletv-full .rate {
    background: rgba(255,255,255,0.9) !important;
    backdrop-filter: blur(20px) saturate(180%);
    padding: 0.7em 1.3em !important;
    border-radius: 1em !important;
    border: 1px solid rgba(255,255,255,0.4) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.appletv-full .rate > div:first-child {
    font-size: 1.7em !important;
    font-weight: 700 !important;
    color: #1d1d1f !important;
}

.appletv-full .rate > div:last-child {
    color: #86868b !important;
}

.appletv-full .full-start__pg,
.appletv-full .full-start__status {
    background: rgba(255,255,255,0.9) !important;
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.4) !important;
    color: #1d1d1f !important;
    font-weight: 600 !important;
    border-radius: 0.8em !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.appletv-full .full-descr,
.appletv-full .full-persons,
.appletv-full .card--collection {
    padding-left: 5em !important;
    padding-right: 5em !important;
}

.appletv-full .full-descr__title,
.appletv-full .full-persons__title,
.appletv-full .card--collection .card__title {
    font-size: 2.2em !important;
    font-weight: 700 !important;
    color: #1d1d1f !important;
}

.appletv-full .full-descr__text {
    font-size: 1.25em !important;
    line-height: 1.75 !important;
    color: #1d1d1f !important;
}

.appletv-full .full-person,
.appletv-full .card {
    border-radius: 1em !important;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.appletv-full .full-person:hover,
.appletv-full .card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.2);
}

@media (max-width: 1400px) {
    .appletv-full .full-start-new__title {
        font-size: 4.2em !important;
    }
    .appletv-full .full-start__poster {
        width: 20em !important;
        height: 30em !important;
    }
}

@media (max-width: 1024px) {
    .appletv-full .full-start__body {
        padding: 6em 3em 3em 3em !important;
        gap: 3em !important;
    }
    .appletv-full .full-start__left {
        max-width: 60% !important;
    }
    .appletv-full .full-start-new__title {
        font-size: 3.6em !important;
    }
    .appletv-full .full-start__poster {
        width: 18em !important;
        height: 27em !important;
    }
    .appletv-full .full-descr,
    .appletv-full .full-persons,
    .appletv-full .card--collection {
        padding-left: 3em !important;
        padding-right: 3em !important;
    }
}

@media (max-width: 768px) {
    .appletv-full .full-start__body {
        flex-direction: column !important;
        padding: 4em 2em 2em 2em !important;
        gap: 2em !important;
    }
    .appletv-full .full-start__right {
        order: 1 !important;
    }
    .appletv-full .full-start__left {
        order: 2 !important;
        max-width: 100% !important;
        text-align: center;
    }
    .appletv-full .full-start__poster {
        width: 16em !important;
        height: 24em !important;
        margin: 0 auto;
    }
    .appletv-full .full-start-new__title {
        font-size: 3em !important;
    }
    .appletv-full .full-start-new__description {
        font-size: 1.15em !important;
    }
    .appletv-full .full-start-new__buttons {
        justify-content: center;
    }
    .appletv-full .full-start-new__buttons .button {
        padding: 0.95em 2.7em !important;
        font-size: 1.05em !important;
    }
    .appletv-full .full-start__tags {
        justify-content: center;
    }
    .appletv-full .full-descr,
    .appletv-full .full-persons,
    .appletv-full .card--collection {
        padding-left: 2em !important;
        padding-right: 2em !important;
    }
}

@keyframes appletvFadeIn {
    from {
        opacity: 0;
        transform: translateY(25px) scale(0.96);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.appletv-full .full-start__left > *,
.appletv-full .full-start__right {
    animation: appletvFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.appletv-full .full-start__right { animation-delay: 0s; }
.appletv-full .full-start-new__title { animation-delay: 0.08s; }
.appletv-full .full-start-new__original-title { animation-delay: 0.14s; }
.appletv-full .full--tagline { animation-delay: 0.2s; }
.appletv-full .full-start__tags { animation-delay: 0.26s; }
.appletv-full .full-start-new__description { animation-delay: 0.32s; }
.appletv-full .full-start-new__buttons { animation-delay: 0.38s; }

.appletv-full::-webkit-scrollbar {
    width: 10px;
}

.appletv-full::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.3);
    border-radius: 5px;
}

.appletv-full::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 5px;
}

.appletv-full::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.3);
}

.appletv-full .selector.focus {
    outline: 4px solid rgba(0,113,227,0.6) !important;
    outline-offset: 3px;
    box-shadow: 0 0 0 8px rgba(0,113,227,0.2) !important;
}
    `;
    document.head.appendChild(style);

    Lampa.Listener.follow('full', function(e) {
        if (e.type === 'start') {
            setTimeout(function() {
                const layer = document.querySelector('.layer--wheight');
                if (layer && !layer.classList.contains('appletv-full')) {
                    layer.classList.add('appletv-full');
                }
            }, 0);
        }
    });

    console.log('Apple TV+ Style Plugin: Loaded (Professional Version)');

})();
