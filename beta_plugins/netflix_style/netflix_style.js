/**
 * Netflix Style Plugin для Lampa
 * 
 * Этот плагин изменяет дизайн страницы full (карточки фильма/сериала)
 * в стиле Netflix и Apple TV+
 * 
 * Основные изменения:
 * - Полноэкранный постер с градиентом
 * - Современная типографика
 * - Плавные анимации
 * - Улучшенная читаемость
 * - Переработанная структура кнопок
 */

(function() {
    'use strict';

    // Проверка на повторную загрузку
    if (window.netflix_style_plugin_loaded) {
        console.log('Netflix Style Plugin: Already loaded, skipping...');
        return;
    }
    window.netflix_style_plugin_loaded = true;

    console.log('Netflix Style Plugin: Starting initialization...');

    /**
     * Основная функция инициализации плагина
     */
    function init() {
        console.log('Netflix Style Plugin: Initializing...');

        // Инжектим CSS стили
        injectStyles();

        // Подписываемся на события загрузки полной карточки
        subscribeToFullCardEvents();

        // Модифицируем уже открытую карточку, если есть
        modifyCurrentFullCard();

        console.log('Netflix Style Plugin: Initialization complete');
    }

    /**
     * Инжектим CSS стили в страницу
     */
    function injectStyles() {
        const styleId = 'netflix-style-plugin-css';
        
        // Проверяем, не добавлены ли уже стили
        if (document.getElementById(styleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
/* Netflix Style Plugin Styles */

/* Основной контейнер */
.layer--wheight.netflix-styled {
    background: #141414 !important;
}

/* Секция start (главная информация) */
.netflix-styled .full-start {
    padding: 0 !important;
    padding-bottom: 2em !important;
    min-height: 85vh;
    position: relative;
}

/* Полноэкранный фон с постером */
.netflix-styled .full-start__background {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: -1 !important;
    mask-image: none !important;
    opacity: 1 !important;
    object-fit: cover;
    transition: opacity 0.6s ease !important;
}

.netflix-styled .full-start__background.loaded {
    opacity: 0.4 !important;
}

/* Градиент поверх фона */
.netflix-styled .full-start::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to right,
        rgba(20, 20, 20, 1) 0%,
        rgba(20, 20, 20, 0.95) 20%,
        rgba(20, 20, 20, 0.7) 50%,
        rgba(20, 20, 20, 0.4) 70%,
        transparent 100%
    );
    z-index: 0;
    pointer-events: none;
}

.netflix-styled .full-start::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(
        to top,
        rgba(20, 20, 20, 1) 0%,
        rgba(20, 20, 20, 0.8) 30%,
        transparent 100%
    );
    z-index: 0;
    pointer-events: none;
}

/* Основное тело карточки */
.netflix-styled .full-start__body {
    position: relative;
    z-index: 1;
    height: auto !important;
    min-height: 70vh;
    display: flex !important;
    align-items: flex-end;
    padding: 4em 4em 2em 4em !important;
}

/* Левая часть (информация) */
.netflix-styled .full-start__left {
    flex: 1;
    max-width: 50%;
    padding-left: 0 !important;
    padding-bottom: 2em;
}

/* Правая часть (постер) - скрываем, так как используем фон */
.netflix-styled .full-start__right {
    display: none !important;
}

/* Заголовок */
.netflix-styled .full-start-new__title {
    font-size: 4em !important;
    font-weight: 700 !important;
    line-height: 1.1 !important;
    margin-bottom: 0.3em !important;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
    letter-spacing: -0.02em;
}

/* Оригинальное название */
.netflix-styled .full-start-new__original-title {
    font-size: 1.4em !important;
    opacity: 0.7 !important;
    margin-bottom: 1em !important;
    font-weight: 300 !important;
}

/* Слоган */
.netflix-styled .full--tagline {
    font-size: 1.5em !important;
    font-style: italic !important;
    opacity: 0.85 !important;
    margin-bottom: 1.5em !important;
    font-weight: 300 !important;
}

/* Описание */
.netflix-styled .full-start-new__description {
    font-size: 1.3em !important;
    line-height: 1.6 !important;
    margin-bottom: 2em !important;
    max-width: 800px;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
}

/* Теги и информация */
.netflix-styled .full-start__tags {
    display: flex;
    gap: 1em;
    margin-bottom: 2em !important;
    flex-wrap: wrap;
}

.netflix-styled .full-start__tags .tag {
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(10px);
    padding: 0.4em 1em !important;
    border-radius: 0.3em !important;
    font-size: 1.1em !important;
    font-weight: 500 !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* Рейтинги */
.netflix-styled .rate {
    background: rgba(0, 0, 0, 0.6) !important;
    backdrop-filter: blur(10px);
    padding: 0.5em 1em !important;
    border-radius: 0.4em !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.netflix-styled .rate > div:first-child {
    font-size: 1.4em !important;
    font-weight: 700 !important;
}

/* Кнопки действий */
.netflix-styled .full-start-new__buttons {
    display: flex;
    gap: 1em;
    margin-top: 2em;
    flex-wrap: wrap;
}

.netflix-styled .full-start-new__buttons .button {
    padding: 1em 2.5em !important;
    font-size: 1.2em !important;
    font-weight: 600 !important;
    border-radius: 0.3em !important;
    border: none !important;
    cursor: pointer;
    transition: all 0.3s ease !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.netflix-styled .full-start-new__buttons .button--play {
    background: #fff !important;
    color: #000 !important;
}

.netflix-styled .full-start-new__buttons .button--play:hover {
    background: rgba(255, 255, 255, 0.85) !important;
    transform: scale(1.05);
}

.netflix-styled .full-start-new__buttons .button:not(.button--play) {
    background: rgba(255, 255, 255, 0.15) !important;
    color: #fff !important;
    backdrop-filter: blur(10px);
}

.netflix-styled .full-start-new__buttons .button:not(.button--play):hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: scale(1.05);
}

/* Детальная информация */
.netflix-styled .full-start__deta {
    margin-top: 2em !important;
    gap: 1.5em !important;
    flex-wrap: wrap;
}

.netflix-styled .full-start__pg,
.netflix-styled .full-start__status {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    padding: 0.5em 1em !important;
    font-size: 1.1em !important;
}

/* Секция описания */
.netflix-styled .full-descr {
    padding: 3em 4em !important;
    background: transparent !important;
}

.netflix-styled .full-descr__text {
    font-size: 1.2em !important;
    line-height: 1.8 !important;
    max-width: 1200px;
}

/* Секции с актерами, похожими фильмами и т.д. */
.netflix-styled .full-persons,
.netflix-styled .full-reviews,
.netflix-styled .card--collection {
    padding: 2em 4em !important;
    background: transparent !important;
}

.netflix-styled .full-persons__title,
.netflix-styled .card--collection .card__title {
    font-size: 1.8em !important;
    font-weight: 600 !important;
    margin-bottom: 1em !important;
}

/* Карточки актеров */
.netflix-styled .full-person {
    border-radius: 0.5em !important;
    overflow: hidden;
    transition: transform 0.3s ease !important;
}

.netflix-styled .full-person:hover {
    transform: scale(1.05);
}

/* Адаптивность */
@media screen and (max-width: 1400px) {
    .netflix-styled .full-start-new__title {
        font-size: 3.5em !important;
    }
}

@media screen and (max-width: 1024px) {
    .netflix-styled .full-start__body {
        padding: 3em 2em 2em 2em !important;
    }
    
    .netflix-styled .full-start__left {
        max-width: 70%;
    }
    
    .netflix-styled .full-start-new__title {
        font-size: 3em !important;
    }
}

@media screen and (max-width: 768px) {
    .netflix-styled .full-start::before {
        background: linear-gradient(
            to bottom,
            rgba(20, 20, 20, 0.4) 0%,
            rgba(20, 20, 20, 0.85) 40%,
            rgba(20, 20, 20, 1) 70%
        );
    }
    
    .netflix-styled .full-start__body {
        padding: 2em 1.5em !important;
        align-items: center;
    }
    
    .netflix-styled .full-start__left {
        max-width: 100%;
    }
    
    .netflix-styled .full-start-new__title {
        font-size: 2.5em !important;
    }
    
    .netflix-styled .full-start-new__description {
        font-size: 1.1em !important;
    }
    
    .netflix-styled .full-start-new__buttons .button {
        padding: 0.8em 2em !important;
        font-size: 1em !important;
    }
}

/* Анимации появления */
@keyframes netflixFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.netflix-styled .full-start__left > * {
    animation: netflixFadeIn 0.6s ease-out backwards;
}

.netflix-styled .full-start-new__title {
    animation-delay: 0.1s;
}

.netflix-styled .full-start-new__original-title {
    animation-delay: 0.2s;
}

.netflix-styled .full--tagline {
    animation-delay: 0.3s;
}

.netflix-styled .full-start__tags {
    animation-delay: 0.4s;
}

.netflix-styled .full-start-new__description {
    animation-delay: 0.5s;
}

.netflix-styled .full-start-new__buttons {
    animation-delay: 0.6s;
}
        `;

        document.head.appendChild(style);
        console.log('Netflix Style Plugin: Styles injected');
    }

    /**
     * Подписываемся на события полной карточки
     */
    function subscribeToFullCardEvents() {
        // Слушаем событие создания полной карточки
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'start' || e.type === 'complite') {
                console.log('Netflix Style Plugin: Full card event detected:', e.type);
                setTimeout(function() {
                    modifyFullCard(e.body);
                }, 100);
            }
        });

        console.log('Netflix Style Plugin: Event listeners attached');
    }

    /**
     * Модифицируем текущую открытую карточку
     */
    function modifyCurrentFullCard() {
        const fullCard = document.querySelector('.layer--wheight');
        if (fullCard) {
            console.log('Netflix Style Plugin: Current full card found, modifying...');
            modifyFullCard($(fullCard));
        }
    }

    /**
     * Применяем Netflix стиль к карточке
     * @param {jQuery} $body - jQuery объект карточки
     */
    function modifyFullCard($body) {
        if (!$body || !$body.length) {
            console.log('Netflix Style Plugin: No body element found');
            return;
        }

        const body = $body[0] || $body;
        const $element = $(body);

        // Проверяем, не применен ли уже стиль
        if ($element.hasClass('netflix-styled')) {
            console.log('Netflix Style Plugin: Already styled, skipping...');
            return;
        }

        console.log('Netflix Style Plugin: Applying Netflix style...');

        // Добавляем класс к основному контейнеру
        $element.addClass('netflix-styled');

        // Улучшаем фоновое изображение
        enhanceBackground($element);

        console.log('Netflix Style Plugin: Netflix style applied successfully');
    }

    /**
     * Улучшаем отображение фонового изображения
     * @param {jQuery} $element - jQuery объект карточки
     */
    function enhanceBackground($element) {
        const $background = $element.find('.full-start__background');
        
        if ($background.length) {
            // Если фон уже загружен, применяем стили сразу
            if ($background.hasClass('loaded')) {
                $background.css({
                    'object-fit': 'cover',
                    'object-position': 'center top'
                });
            }
            
            // Следим за загрузкой фона
            $background.on('load', function() {
                $(this).css({
                    'object-fit': 'cover',
                    'object-position': 'center top'
                });
            });
        }
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

