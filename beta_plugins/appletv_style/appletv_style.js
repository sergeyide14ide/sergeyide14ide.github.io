/**
 * Apple TV+ Style Plugin для Lampa
 * 
 * Этот плагин изменяет дизайн страницы full (карточки фильма/сериала)
 * в стиле Apple TV+
 * 
 * Основные особенности Apple TV+ дизайна:
 * - Светлый минималистичный дизайн
 * - Крупная типографика San Francisco
 * - Размытые эффекты (glass morphism)
 * - Плавные анимации с bounce эффектом
 * - Акцент на контент
 */

(function() {
    'use strict';

    // Проверка на повторную загрузку
    if (window.appletv_style_plugin_loaded) {
        console.log('Apple TV+ Style Plugin: Already loaded, skipping...');
        return;
    }
    window.appletv_style_plugin_loaded = true;

    console.log('Apple TV+ Style Plugin: Starting initialization...');

    /**
     * Основная функция инициализации плагина
     */
    function init() {
        console.log('Apple TV+ Style Plugin: Initializing...');

        // Инжектим CSS стили
        injectStyles();

        // Подписываемся на события загрузки полной карточки
        subscribeToFullCardEvents();

        // Модифицируем уже открытую карточку, если есть
        modifyCurrentFullCard();

        console.log('Apple TV+ Style Plugin: Initialization complete');
    }

    /**
     * Инжектим CSS стили в страницу
     */
    function injectStyles() {
        const styleId = 'appletv-style-plugin-css';
        
        // Проверяем, не добавлены ли уже стили
        if (document.getElementById(styleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
/* Apple TV+ Style Plugin Styles */

/* Основной контейнер */
.layer--wheight.appletv-styled {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
}

/* Секция start (главная информация) */
.appletv-styled .full-start {
    padding: 0 !important;
    padding-bottom: 3em !important;
    position: relative;
}

/* Фон с размытием */
.appletv-styled .full-start__background {
    position: absolute !important;
    top: -10em !important;
    left: 0 !important;
    width: 100% !important;
    height: 50em !important;
    z-index: 0 !important;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%) !important;
    opacity: 1 !important;
    object-fit: cover;
    filter: blur(40px) saturate(1.5);
    transition: opacity 0.8s ease !important;
}

.appletv-styled .full-start__background.loaded {
    opacity: 0.6 !important;
}

/* Основное тело карточки */
.appletv-styled .full-start__body {
    position: relative;
    z-index: 1;
    height: auto !important;
    display: flex !important;
    align-items: center;
    padding: 8em 5em 3em 5em !important;
    gap: 4em;
}

/* Правая часть (постер) */
.appletv-styled .full-start__right {
    flex-shrink: 0;
    order: 1;
}

.appletv-styled .full-start__poster {
    position: relative;
    width: 22em;
    height: 33em;
    border-radius: 1.5em;
    overflow: hidden;
    box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.3),
        0 10px 30px rgba(0, 0, 0, 0.22);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.appletv-styled .full-start__poster:hover {
    transform: scale(1.05) translateY(-10px);
    box-shadow: 
        0 30px 80px rgba(0, 0, 0, 0.35),
        0 15px 40px rgba(0, 0, 0, 0.25);
}

.appletv-styled .full-start__poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Левая часть (информация) */
.appletv-styled .full-start__left {
    flex: 1;
    order: 2;
    padding-left: 0 !important;
    max-width: 50em;
}

/* Заголовок */
.appletv-styled .full-start-new__title {
    font-size: 4.5em !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    margin-bottom: 0.2em !important;
    color: #1d1d1f !important;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #1d1d1f 0%, #424245 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Оригинальное название */
.appletv-styled .full-start-new__original-title {
    font-size: 1.6em !important;
    color: #86868b !important;
    margin-bottom: 1.2em !important;
    font-weight: 400 !important;
}

/* Слоган */
.appletv-styled .full--tagline {
    font-size: 1.7em !important;
    font-style: normal !important;
    color: #424245 !important;
    margin-bottom: 1.5em !important;
    font-weight: 500 !important;
    line-height: 1.3;
}

/* Описание */
.appletv-styled .full-start-new__description {
    font-size: 1.25em !important;
    line-height: 1.7 !important;
    margin-bottom: 2em !important;
    color: #1d1d1f !important;
    font-weight: 400 !important;
}

/* Теги и информация */
.appletv-styled .full-start__tags {
    display: flex;
    gap: 1em;
    margin-bottom: 2.5em !important;
    flex-wrap: wrap;
}

.appletv-styled .full-start__tags .tag {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    padding: 0.6em 1.2em !important;
    border-radius: 1em !important;
    font-size: 1em !important;
    font-weight: 600 !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #1d1d1f !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Рейтинги */
.appletv-styled .rate {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    padding: 0.7em 1.2em !important;
    border-radius: 1em !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.appletv-styled .rate > div:first-child {
    font-size: 1.6em !important;
    font-weight: 700 !important;
    color: #1d1d1f !important;
}

.appletv-styled .rate > div:last-child {
    color: #86868b !important;
}

/* Кнопки действий */
.appletv-styled .full-start-new__buttons {
    display: flex;
    gap: 1em;
    margin-top: 2.5em;
    flex-wrap: wrap;
}

.appletv-styled .full-start-new__buttons .button {
    padding: 1em 3em !important;
    font-size: 1.1em !important;
    font-weight: 600 !important;
    border-radius: 1.5em !important;
    border: none !important;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.appletv-styled .full-start-new__buttons .button--play {
    background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%) !important;
    color: #fff !important;
}

.appletv-styled .full-start-new__buttons .button--play:hover {
    background: linear-gradient(135deg, #0077ed 0%, #0061c1 100%) !important;
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 113, 227, 0.4);
}

.appletv-styled .full-start-new__buttons .button:not(.button--play) {
    background: rgba(255, 255, 255, 0.9) !important;
    color: #1d1d1f !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.appletv-styled .full-start-new__buttons .button:not(.button--play):hover {
    background: rgba(255, 255, 255, 1) !important;
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Детальная информация */
.appletv-styled .full-start__deta {
    margin-top: 2em !important;
    gap: 1.5em !important;
    flex-wrap: wrap;
}

.appletv-styled .full-start__pg,
.appletv-styled .full-start__status {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    padding: 0.6em 1.2em !important;
    font-size: 1em !important;
    color: #1d1d1f !important;
    font-weight: 600 !important;
    border-radius: 0.8em !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Секция описания */
.appletv-styled .full-descr {
    padding: 3em 5em !important;
    background: transparent !important;
}

.appletv-styled .full-descr__title {
    font-size: 2.5em !important;
    font-weight: 700 !important;
    color: #1d1d1f !important;
    margin-bottom: 1em !important;
}

.appletv-styled .full-descr__text {
    font-size: 1.2em !important;
    line-height: 1.8 !important;
    max-width: 70em;
    color: #1d1d1f !important;
}

/* Секции с актерами, похожими фильмами и т.д. */
.appletv-styled .full-persons,
.appletv-styled .full-reviews,
.appletv-styled .card--collection {
    padding: 2em 5em !important;
    background: transparent !important;
}

.appletv-styled .full-persons__title,
.appletv-styled .card--collection .card__title {
    font-size: 2em !important;
    font-weight: 700 !important;
    margin-bottom: 1em !important;
    color: #1d1d1f !important;
}

/* Карточки актеров */
.appletv-styled .full-person {
    border-radius: 1em !important;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    background: rgba(255, 255, 255, 0.8) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.appletv-styled .full-person:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Карточки контента */
.appletv-styled .card {
    border-radius: 1em !important;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appletv-styled .card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

/* Адаптивность */
@media screen and (max-width: 1400px) {
    .appletv-styled .full-start-new__title {
        font-size: 4em !important;
    }
    
    .appletv-styled .full-start__poster {
        width: 20em;
        height: 30em;
    }
}

@media screen and (max-width: 1024px) {
    .appletv-styled .full-start__body {
        padding: 6em 3em 3em 3em !important;
        gap: 3em;
    }
    
    .appletv-styled .full-start__left {
        max-width: 60%;
    }
    
    .appletv-styled .full-start-new__title {
        font-size: 3.5em !important;
    }
    
    .appletv-styled .full-start__poster {
        width: 18em;
        height: 27em;
    }
    
    .appletv-styled .full-descr,
    .appletv-styled .full-persons {
        padding: 2em 3em !important;
    }
}

@media screen and (max-width: 768px) {
    .appletv-styled .full-start__body {
        flex-direction: column;
        padding: 4em 2em 2em 2em !important;
        gap: 2em;
    }
    
    .appletv-styled .full-start__right {
        order: 1;
    }
    
    .appletv-styled .full-start__left {
        order: 2;
        max-width: 100%;
        text-align: center;
    }
    
    .appletv-styled .full-start__poster {
        width: 16em;
        height: 24em;
        margin: 0 auto;
    }
    
    .appletv-styled .full-start-new__title {
        font-size: 2.8em !important;
    }
    
    .appletv-styled .full-start-new__description {
        font-size: 1.1em !important;
    }
    
    .appletv-styled .full-start-new__buttons {
        justify-content: center;
    }
    
    .appletv-styled .full-start-new__buttons .button {
        padding: 0.9em 2.5em !important;
        font-size: 1em !important;
    }
    
    .appletv-styled .full-start__tags {
        justify-content: center;
    }
    
    .appletv-styled .full-descr,
    .appletv-styled .full-persons {
        padding: 2em 2em !important;
    }
}

/* Анимации появления */
@keyframes appletvFadeIn {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.appletv-styled .full-start__left > *,
.appletv-styled .full-start__right {
    animation: appletvFadeIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
}

.appletv-styled .full-start__right {
    animation-delay: 0s;
}

.appletv-styled .full-start-new__title {
    animation-delay: 0.1s;
}

.appletv-styled .full-start-new__original-title {
    animation-delay: 0.2s;
}

.appletv-styled .full--tagline {
    animation-delay: 0.3s;
}

.appletv-styled .full-start__tags {
    animation-delay: 0.4s;
}

.appletv-styled .full-start-new__description {
    animation-delay: 0.5s;
}

.appletv-styled .full-start-new__buttons {
    animation-delay: 0.6s;
}

/* Улучшение скроллбара */
.appletv-styled::-webkit-scrollbar {
    width: 10px;
}

.appletv-styled::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
}

.appletv-styled::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

.appletv-styled::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
}

/* Улучшение фокуса для TV режима */
.appletv-styled .selector.focus {
    outline: 4px solid rgba(0, 113, 227, 0.6) !important;
    outline-offset: 3px;
    box-shadow: 0 0 0 8px rgba(0, 113, 227, 0.2) !important;
}
        `;

        document.head.appendChild(style);
        console.log('Apple TV+ Style Plugin: Styles injected');
    }

    /**
     * Подписываемся на события полной карточки
     */
    function subscribeToFullCardEvents() {
        // Слушаем событие создания полной карточки
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'start' || e.type === 'complite') {
                console.log('Apple TV+ Style Plugin: Full card event detected:', e.type);
                setTimeout(function() {
                    modifyFullCard(e.body);
                }, 100);
            }
        });

        console.log('Apple TV+ Style Plugin: Event listeners attached');
    }

    /**
     * Модифицируем текущую открытую карточку
     */
    function modifyCurrentFullCard() {
        const fullCard = document.querySelector('.layer--wheight');
        if (fullCard) {
            console.log('Apple TV+ Style Plugin: Current full card found, modifying...');
            modifyFullCard($(fullCard));
        }
    }

    /**
     * Применяем Apple TV+ стиль к карточке
     * @param {jQuery} $body - jQuery объект карточки
     */
    function modifyFullCard($body) {
        if (!$body || !$body.length) {
            console.log('Apple TV+ Style Plugin: No body element found');
            return;
        }

        const body = $body[0] || $body;
        const $element = $(body);

        // Проверяем, не применен ли уже стиль
        if ($element.hasClass('appletv-styled')) {
            console.log('Apple TV+ Style Plugin: Already styled, skipping...');
            return;
        }

        console.log('Apple TV+ Style Plugin: Applying Apple TV+ style...');

        // Добавляем класс к основному контейнеру
        $element.addClass('appletv-styled');

        console.log('Apple TV+ Style Plugin: Apple TV+ style applied successfully');
    }

    // Инициализация плагина
    if (window.appready) {
        // Приложение уже готово, инициализируем сразу
        init();
    } else {
        // Ждем готовности приложения
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                init();
            }
        });
    }

})();

