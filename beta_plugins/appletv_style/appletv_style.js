(function() {
    'use strict';

    /**
     * Apple TV+ Style Plugin для Lampa
     * 
     * Архитектура:
     * - Переопределяет шаблон full_start_new (как cardify)
     * - Улучшает фон до original качества
     * - Добавляет кастомную информацию о фильме
     * - Интегрируется с существующей системой
     */

    // ==================== CSS СТИЛИ ====================
    const CSS_STYLES = `
        /* Базовые стили cardify */
        .cardify {
            transition: all 0.3s;
        }

        .cardify .full-start-new__body {
            height: 80vh;
        }

        .cardify .full-start-new__right {
            display: flex;
            align-items: flex-end;
        }

        .cardify .full-start-new__title {
            text-shadow: 0 0 0.1em rgba(0,0,0,0.3);
        }

        .cardify__left {
            flex-grow: 1;
        }

        .cardify__right {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            position: relative;
        }

        .cardify .full-start-new__reactions {
            margin: 0;
            margin-right: -2.8em;
        }

        .cardify .full-start-new__reactions:not(.focus) {
            margin: 0;
        }

        .cardify .full-start-new__reactions:not(.focus) > div:not(:first-child) {
            display: none;
        }

        .cardify .full-start-new__reactions:not(.focus) .reaction {
            position: relative;
        }

        .cardify .full-start-new__reactions:not(.focus) .reaction__count {
            position: absolute;
            top: 28%;
            left: 95%;
            font-size: 1.2em;
            font-weight: 500;
        }

        .cardify .full-start-new__rate-line {
            margin: 0;
            margin-left: 3.5em;
        }

        .cardify .full-start-new__rate-line > *:last-child {
            margin-right: 0 !important;
        }

        /* Фон как в cardify */
        .cardify__background.loaded:not(.dim) {
            opacity: 1;
        }

        .cardify__background.nodisplay {
            opacity: 0 !important;
        }

        body:not(.menu--open) .cardify__background {
            mask-image: linear-gradient(to bottom, white 50%, rgba(255,255,255,0) 100%);
        }

        /* Кастомные элементы Apple TV+ */
        .appletv-info__logo {
            max-height: 180px;
            max-width: 100%;
            object-fit: contain;
            object-position: left;
            margin-bottom: 0.8em;
            display: none;
        }

        .appletv-info__logo.visible {
            display: block;
        }

        /* Скрыть заголовок если есть логотип */
        .appletv-info__logo.visible ~ .full-start-new__head,
        .appletv-info__logo.visible ~ .full-start-new__title {
            display: none !important;
        }

        /* Логотип стриминга */
        .appletv-info__streaming-logo {
            height: 40px;
            width: auto;
            object-fit: contain;
            margin-bottom: 0.8em;
            display: none;
        }

        .appletv-info__streaming-logo.visible {
            display: block;
        }

        /* Метаданные */
        .appletv-info__meta {
            display: flex;
            align-items: center;
            gap: 0.6em;
            flex-wrap: wrap;
            font-size: 1.14em;
            color: rgba(255,255,255,1);
            margin-bottom: 0.8em;
            margin-top: 0.8em;
        }

        .appletv-info__meta-separator {
            opacity: 0.5;
        }

        .appletv-info__age-rating {
            border: 1px solid rgba(255,255,255,0.5);
            padding: 0.15em 0.5em;
            border-radius: 0.3em;
            font-size: 0.9em;
            line-height: 1;
        }

        /* Описание */
        .appletv-info__description {
            font-size: 0.9em;
            line-height: 1.5;
            color: rgba(255,255,255,0.65);
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            max-width: 33%;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Год и продолжительность */
        .appletv-info__year-runtime {
            font-size: 0.9em;
            color: rgba(255,255,255,0.6);
            margin-bottom: 1em;
        }

        /* Адаптивность */
        @media (max-width: 1280px) {
            .appletv-info__description {
                max-width: 50%;
            }
        }

        @media (max-width: 768px) {
            .appletv-info__description {
                max-width: 100%;
            }
        }
    `;

    // ==================== HTML ШАБЛОН ====================
    const TEMPLATE_HTML = `<div class="full-start-new cardify">
        <div class="full-start-new__body">
            <div class="full-start-new__left hide">
                <div class="full-start-new__poster">
                    <img class="full-start-new__img full--poster" />
                </div>
            </div>

            <div class="full-start-new__right">
                
                <div class="cardify__left">
                    <img class="appletv-info__logo" alt="" />
                    <img class="appletv-info__streaming-logo" alt="" />
                    
                    <div class="full-start-new__head"></div>
                    <div class="full-start-new__title">{title}</div>

                    <div class="appletv-info__meta"></div>
                    <div class="appletv-info__description">{descr}</div>
                    <div class="appletv-info__year-runtime"></div>

                    <div class="full-start-new__buttons">
                        <div class="full-start__button selector button--play">
                            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="14" cy="14.5" r="13" stroke="currentColor" stroke-width="2.7"/>
                                <path d="M18.0739 13.634C18.7406 14.0189 18.7406 14.9811 18.0739 15.366L11.751 19.0166C11.0843 19.4015 10.251 18.9204 10.251 18.1506L10.251 10.8494C10.251 10.0796 11.0843 9.5985 11.751 9.9834L18.0739 13.634Z" fill="currentColor"/>
                            </svg>
                            <span>#{title_watch}</span>
                        </div>

                        <div class="full-start__button selector button--book">
                            <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z" stroke="currentColor" stroke-width="2.5"/>
                            </svg>
                            <span>#{settings_input_links}</span>
                        </div>

                        <div class="full-start__button selector button--reaction">
                            <svg width="38" height="34" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M37.208 10.9742C37.1364 10.8013 37.0314 10.6441 36.899 10.5117C36.7666 10.3794 36.6095 10.2744 36.4365 10.2028L12.0658 0.108375C11.7166 -0.0361828 11.3242 -0.0361227 10.9749 0.108542C10.6257 0.253206 10.3482 0.530634 10.2034 0.879836L0.108666 25.2507C0.0369593 25.4236 3.37953e-05 25.609 2.3187e-08 25.7962C-3.37489e-05 25.9834 0.0368249 26.1688 0.108469 26.3418C0.180114 26.5147 0.28514 26.6719 0.417545 26.8042C0.54995 26.9366 0.707139 27.0416 0.880127 27.1131L17.2452 33.8917C17.5945 34.0361 17.9869 34.0361 18.3362 33.8917L29.6574 29.2017C29.8304 29.1301 29.9875 29.0251 30.1199 28.8928C30.2523 28.7604 30.3573 28.6032 30.4289 28.4303L37.2078 12.065C37.2795 11.8921 37.3164 11.7068 37.3164 11.5196C37.3165 11.3325 37.2796 11.1471 37.208 10.9742ZM20.425 29.9407L21.8784 26.4316L25.3873 27.885L20.425 29.9407ZM28.3407 26.0222L21.6524 23.252C21.3031 23.1075 20.9107 23.1076 20.5615 23.2523C20.2123 23.3969 19.9348 23.6743 19.79 24.0235L17.0194 30.7123L3.28783 25.0247L12.2918 3.28773L34.0286 12.2912L28.3407 26.0222Z" fill="currentColor"/>
                                <path d="M25.3493 16.976L24.258 14.3423L16.959 17.3666L15.7196 14.375L13.0859 15.4659L15.4161 21.0916L25.3493 16.976Z" fill="currentColor"/>
                            </svg>                
                            <span>#{title_reactions}</span>
                        </div>

                        <div class="full-start__button selector button--subscribe hide">
                            <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.01892 24C6.27423 27.3562 9.07836 30 12.5 30C15.9216 30 18.7257 27.3562 18.981 24H15.9645C15.7219 25.6961 14.2632 27 12.5 27C10.7367 27 9.27804 25.6961 9.03542 24H6.01892Z" fill="currentColor"/>
                                <path d="M3.81972 14.5957V10.2679C3.81972 5.41336 7.7181 1.5 12.5 1.5C17.2819 1.5 21.1803 5.41336 21.1803 10.2679V14.5957C21.1803 15.8462 21.5399 17.0709 22.2168 18.1213L23.0727 19.4494C24.2077 21.2106 22.9392 23.5 20.9098 23.5H4.09021C2.06084 23.5 0.792282 21.2106 1.9273 19.4494L2.78317 18.1213C3.46012 17.0709 3.81972 15.8462 3.81972 14.5957Z" stroke="currentColor" stroke-width="2.5"/>
                            </svg>
                            <span>#{title_subscribe}</span>
                        </div>

                        <div class="full-start__button selector button--options">
                            <svg width="38" height="10" viewBox="0 0 38 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="4.88968" cy="4.98563" r="4.75394" fill="currentColor"/>
                                <circle cx="18.9746" cy="4.98563" r="4.75394" fill="currentColor"/>
                                <circle cx="33.0596" cy="4.98563" r="4.75394" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="cardify__right">
                    <div class="full-start-new__reactions selector">
                        <div>#{reactions_none}</div>
                    </div>

                    <div class="full-start-new__rate-line">
                        <div class="full-start__pg hide"></div>
                        <div class="full-start__status hide"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="hide buttons--container">
            <div class="full-start__button view--torrent hide">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
                    <path d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M40.5,30.963c-3.1,0-4.9-2.4-4.9-2.4 S34.1,35,27,35c-1.4,0-3.6-0.837-3.6-0.837l4.17,9.643C26.727,43.92,25.874,44,25,44c-2.157,0-4.222-0.377-6.155-1.039L9.237,16.851 c0,0-0.7-1.2,0.4-1.5c1.1-0.3,5.4-1.2,5.4-1.2s1.475-0.494,1.8,0.5c0.5,1.3,4.063,11.112,4.063,11.112S22.6,29,27.4,29 c4.7,0,5.9-3.437,5.7-3.937c-1.2-3-4.993-11.862-4.993-11.862s-0.6-1.1,0.8-1.4c1.4-0.3,3.8-0.7,3.8-0.7s1.105-0.163,1.6,0.8 c0.738,1.437,5.193,11.262,5.193,11.262s1.1,2.9,3.3,2.9c0.464,0,0.834-0.046,1.152-0.104c-0.082,1.635-0.348,3.221-0.817,4.722 C42.541,30.867,41.756,30.963,40.5,30.963z" fill="currentColor"/>
                </svg>
                <span>#{full_torrents}</span>
            </div>

            <div class="full-start__button selector view--trailer">
                <svg height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M71.2555 2.08955C74.6975 3.2397 77.4083 6.62804 78.3283 10.9306C80 18.7291 80 35 80 35C80 35 80 51.2709 78.3283 59.0694C77.4083 63.372 74.6975 66.7603 71.2555 67.9104C65.0167 70 40 70 40 70C40 70 14.9833 70 8.74453 67.9104C5.3025 66.7603 2.59172 63.372 1.67172 59.0694C0 51.2709 0 35 0 35C0 35 0 18.7291 1.67172 10.9306C2.59172 6.62804 5.3025 3.2395 8.74453 2.08955C14.9833 0 40 0 40 0C40 0 65.0167 0 71.2555 2.08955ZM55.5909 35.0004L29.9773 49.5714V20.4286L55.5909 35.0004Z" fill="currentColor"></path>
                </svg>
                <span>#{full_trailers}</span>
            </div>
        </div>
    </div>`;

    // ==================== УТИЛИТЫ ====================

    /**
     * Инъекция CSS
     */
    function injectCSS() {
        if (!document.getElementById('appletv-style-css')) {
            const style = document.createElement('style');
            style.id = 'appletv-style-css';
            style.textContent = CSS_STYLES;
            document.head.appendChild(style);
        }
    }

    /**
     * Улучшение фона (original качество)
     */
    function enhanceBackground(activity) {
        const backgroundElement = activity.render().find('.full-start__background');
        const currentSrc = backgroundElement.attr('src');
        
        if (currentSrc && !backgroundElement.hasClass('cardify__background')) {
            backgroundElement
                .addClass('cardify__background')
                .attr('src', currentSrc.replace('w1280', 'original'));
        }
    }

    /**
     * Форматирование времени
     */
    function formatRuntime(minutes) {
        if (!minutes || minutes === 0) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours} ч ${mins} мин` : `${mins} мин`;
    }

    /**
     * Получение логотипа фильма
     */
    function fetchMovieLogo(movieId, type, callback) {
        if (!movieId) return;
        
        const url = Lampa.TMDB.api(`${type}/${movieId}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get('language')}`);
        
        $.get(url, function(data) {
            if (data.logos && data.logos[0]) {
                const logoPath = data.logos[0].file_path;
                const quality = Lampa.Storage.get('logo_quality') || 'w500';
                const logoUrl = Lampa.TMDB.image(`/t/p/${quality}${logoPath}`);
                callback(logoUrl);
            }
        }).fail(function() {
            // Игнорируем ошибки
        });
    }

    /**
     * Извлечение возрастного рейтинга
     */
    function extractAgeRating(render) {
        // Пытаемся найти в full-start__pg
        const pgElement = render.find('.full-start__pg');
        if (pgElement.length && !pgElement.hasClass('hide')) {
            const pgText = pgElement.text().trim();
            // Извлекаем число из текста типа "18+" или "PG-13"
            const match = pgText.match(/(\d+)/);
            if (match) {
                return match[1] + '+';
            }
        }
        return null;
    }

    /**
     * Определение типа медиа
     */
    function getMediaType(movieData) {
        if (movieData.name) return 'Сериал';
        if (movieData.title) return 'Фильм';
        return 'Медиа';
    }

    /**
     * Заполнение кастомной информации
     */
    function populateCustomInfo(activity, movieData) {
        if (!activity || !activity.render || !movieData) return;

        const render = activity.render();
        const type = movieData.name ? 'tv' : 'movie';

        // Логотип фильма
        if (Lampa.Storage.get('logo_glav') !== '1') {
            fetchMovieLogo(movieData.id, type, function(logoUrl) {
                const logoImg = render.find('.appletv-info__logo');
                if (logoImg.length) {
                    logoImg.attr('src', logoUrl).addClass('visible');
                }
            });
        }

        // Логотип стриминга (вместо компании)
        // Пока оставляем пустым, можно добавить позже логику определения стриминга

        // Метаданные: Тип · Жанр · Поджанр
        const metaContainer = render.find('.appletv-info__meta');
        if (metaContainer.length) {
            const metaParts = [];

            // Тип медиа
            const mediaType = getMediaType(movieData);
            metaParts.push(mediaType);

            // Жанры (максимум 2)
            if (movieData.genres && movieData.genres.length > 0) {
                const genres = movieData.genres.slice(0, 2).map(g => g.name);
                metaParts.push(...genres);
            }

            // Возрастной рейтинг
            const ageRating = extractAgeRating(render);
            if (ageRating) {
                metaParts.push(`<span class="appletv-info__age-rating">${ageRating}</span>`);
            }

            if (metaParts.length > 0) {
                metaContainer.html(metaParts.join(' <span class="appletv-info__meta-separator">·</span> '));
            }
        }

        // Год и продолжительность
        const yearRuntimeContainer = render.find('.appletv-info__year-runtime');
        if (yearRuntimeContainer.length) {
            const parts = [];
            
            const releaseDate = movieData.release_date || movieData.first_air_date || '';
            const year = releaseDate ? releaseDate.slice(0, 4) : '';
            if (year) parts.push(year);

            const runtime = formatRuntime(movieData.runtime);
            if (runtime) parts.push(runtime);

            if (parts.length > 0) {
                yearRuntimeContainer.text(parts.join(' · '));
            }
        }
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================

    function init() {
        // Инъекция CSS
        injectCSS();

        // Переопределение шаблона
        if (typeof Lampa !== 'undefined' && Lampa.Template) {
            Lampa.Template.add('full_start_new', TEMPLATE_HTML);
        }

        // Обработка событий full
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite' && e.data && e.data.movie && e.object && e.object.activity) {
                // Улучшаем фон
                enhanceBackground(e.object.activity);
                
                // Небольшая задержка чтобы full-start__pg успел заполниться
                setTimeout(function() {
                    populateCustomInfo(e.object.activity, e.data.movie);
                }, 100);
            }
        });
    }

    // ==================== ЗАПУСК ====================

    if (!window.appletv_style_plugin) {
        window.appletv_style_plugin = true;
        
        if (typeof Lampa !== 'undefined') {
            init();
        } else {
            window.addEventListener('DOMContentLoaded', init);
        }
    }

})();
