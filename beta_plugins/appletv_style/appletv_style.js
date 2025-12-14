(function() {
    'use strict';

    /**
     * Apple TV+ Style Plugin для Lampa
     * Создает премиум-дизайн страницы карточки фильма в стиле Apple TV+
     * 
     * Архитектура:
     * 1. Переопределяет шаблон full_start_new ДО загрузки страницы
     * 2. Инжектирует CSS синхронно в head
     * 3. Интегрируется с logo.js для получения логотипов
     * 4. Извлекает данные компании из полученных данных фильма
     */

    // ==================== CSS СТИЛИ ====================
    const CSS_STYLES = `
        .appletv-full .full-start-new__body {
            display: flex;
            align-items: flex-end;
            padding: 3em 4em 2em 4em;
            min-height: 75vh;
        }

        .appletv-full .full-start-new__left {
            flex: 0 0 35%;
            max-width: 35%;
            padding-right: 3em;
        }

        .appletv-full .full-start-new__right {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.8em;
        }

        /* Логотип фильма */
        .appletv-full .full-start-new__logo {
            max-height: 180px;
            max-width: 100%;
            object-fit: contain;
            object-position: left;
            margin-bottom: 1em;
        }

        /* Логотип компании */
        .appletv-full .full-start-new__company-logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
            border-radius: 50%;
            margin-bottom: 0.8em;
            background: rgba(255,255,255,0.05);
            padding: 8px;
        }

        /* Жанры и метаданные */
        .appletv-full .full-start-new__meta {
            display: flex;
            align-items: center;
            gap: 0.5em;
            flex-wrap: wrap;
            font-size: 0.95em;
            color: rgba(255,255,255,0.75);
            margin-bottom: 0.5em;
        }

        .appletv-full .full-start-new__meta-separator {
            opacity: 0.5;
        }

        .appletv-full .full-start-new__age-rating {
            border: 1px solid rgba(255,255,255,0.5);
            padding: 0.15em 0.4em;
            border-radius: 0.25em;
            font-size: 0.9em;
        }

        /* Описание */
        .appletv-full .full-start-new__description {
            font-size: 0.9em;
            line-height: 1.5;
            color: rgba(255,255,255,0.65);
            max-width: 90%;
            margin-bottom: 0.8em;
        }

        /* Год и продолжительность */
        .appletv-full .full-start-new__year-runtime {
            font-size: 0.9em;
            color: rgba(255,255,255,0.6);
            margin-bottom: 1.2em;
        }

        /* Кнопки */
        .appletv-full .full-start-new__buttons {
            display: flex;
            gap: 0.8em;
            flex-wrap: wrap;
        }

        .appletv-full .full-start__button {
            padding: 0.7em 1.8em;
            border-radius: 0.5em;
            font-size: 0.95em;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            background: rgba(255,255,255,0.12);
            backdrop-filter: blur(10px);
        }

        .appletv-full .full-start__button:hover,
        .appletv-full .full-start__button.focus {
            background: rgba(255,255,255,0.18);
            transform: scale(1.02);
        }

        .appletv-full .button--play {
            background: rgba(255,255,255,0.95);
            color: #000;
        }

        .appletv-full .button--play:hover,
        .appletv-full .button--play.focus {
            background: rgba(255,255,255,1);
        }

        /* Постер */
        .appletv-full .full-start-new__poster {
            border-radius: 1em;
            overflow: hidden;
            box-shadow: 0 15px 50px rgba(0,0,0,0.6);
        }

        .appletv-full .full-start-new__img {
            width: 100%;
            height: auto;
            display: block;
        }

        /* Скрываем элементы оригинального дизайна */
        .appletv-full .full-start-new__title,
        .appletv-full .full-start-new__tagline,
        .appletv-full .full-start-new__rate-line,
        .appletv-full .full-start-new__details,
        .appletv-full .full-start-new__reactions,
        .appletv-full .full-start-new__head {
            display: none;
        }

        /* Адаптивность */
        @media (max-width: 1280px) {
            .appletv-full .full-start-new__body {
                padding: 2em;
            }
            
            .appletv-full .full-start-new__logo {
                max-height: 140px;
            }
        }

        @media (max-width: 768px) {
            .appletv-full .full-start-new__body {
                flex-direction: column;
                align-items: flex-start;
                padding: 1.5em;
            }

            .appletv-full .full-start-new__left {
                flex: 0 0 auto;
                max-width: 100%;
                padding-right: 0;
                margin-bottom: 2em;
            }

            .appletv-full .full-start-new__logo {
                max-height: 100px;
            }

            .appletv-full .full-start__button {
                padding: 0.6em 1.4em;
                font-size: 0.9em;
            }
        }
    `;

    // ==================== HTML ШАБЛОН ====================
    const TEMPLATE_HTML = `<div class="full-start-new appletv-layout">
    <div class="full-start-new__body">
        <div class="full-start-new__left">
            <div class="full-start-new__poster">
                <img class="full-start-new__img full--poster" />
            </div>
        </div>

        <div class="full-start-new__right">
            <img class="full-start-new__logo" style="display:none;" />
            <img class="full-start-new__company-logo" style="display:none;" />
            
            <div class="full-start-new__meta"></div>
            <div class="full-start-new__description">{descr}</div>
            <div class="full-start-new__year-runtime"></div>

            <div class="full-start-new__buttons">
                <div class="full-start__button selector button--play">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor">
                        <path d="M2 0L16 10L2 20V0Z"/>
                    </svg>
                    <span>#{title_watch}</span>
                </div>

                <div class="full-start__button selector button--book">
                    <svg width="21" height="32" viewBox="0 0 21 32" fill="none">
                        <path d="M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z" stroke="currentColor" stroke-width="2.5"/>
                    </svg>
                    <span>#{settings_input_links}</span>
                </div>

                <div class="full-start__button selector button--reaction">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>#{title_reactions}</span>
                </div>

                <div class="full-start__button selector button--subscribe hide">
                    <svg viewBox="0 0 25 30" fill="none">
                        <path d="M6.01892 24C6.27423 27.3562 9.07836 30 12.5 30C15.9216 30 18.7257 27.3562 18.981 24H15.9645C15.7219 25.6961 14.2632 27 12.5 27C10.7367 27 9.27804 25.6961 9.03542 24H6.01892Z" fill="currentColor"/>
                        <path d="M3.81972 14.5957V10.2679C3.81972 5.41336 7.7181 1.5 12.5 1.5C17.2819 1.5 21.1803 5.41336 21.1803 10.2679V14.5957C21.1803 15.8462 21.5399 17.0709 22.2168 18.1213L23.0727 19.4494C24.2077 21.2106 22.9392 23.5 20.9098 23.5H4.09021C2.06084 23.5 0.792282 21.2106 1.9273 19.4494L2.78317 18.1213C3.46012 17.0709 3.81972 15.8462 3.81972 14.5957Z" stroke="currentColor" stroke-width="2.6"/>
                    </svg>
                    <span>#{title_subscribe}</span>
                </div>

                <div class="full-start__button selector button--options">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                    </svg>
                </div>
            </div>

            <!-- Скрытые оригинальные элементы для совместимости -->
            <div class="full-start-new__head" style="display:none;"></div>
            <div class="full-start-new__title" style="display:none;">{title}</div>
            <div class="full-start-new__tagline" style="display:none;">{tagline}</div>
            <div class="full-start-new__rate-line" style="display:none;"></div>
            <div class="full-start-new__details" style="display:none;"></div>
            <div class="full-start-new__reactions" style="display:none;"></div>
        </div>
    </div>

    <div class="hide buttons--container">
        <div class="full-start__button view--torrent hide">
            <svg><use xlink:href="#sprite-torrent"></use></svg>
            <span>#{full_torrents}</span>
        </div>
        <div class="full-start__button selector view--trailer">
            <svg><use xlink:href="#sprite-trailer"></use></svg>
            <span>#{full_trailers}</span>
        </div>
    </div>
</div>`;

    // ==================== УТИЛИТЫ ====================

    /**
     * Инъекция CSS в head
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
     * Форматирование времени из минут в часы и минуты
     */
    function formatRuntime(minutes) {
        if (!minutes || minutes === 0) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
    }

    /**
     * Получение логотипа фильма через TMDB API
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
     * Обработка данных и заполнение кастомного интерфейса
     */
    function enhanceLayout(activity, movieData) {
        if (!activity || !activity.render || !movieData) return;

        const render = activity.render();
        const type = movieData.name ? 'tv' : 'movie';

        // Получаем логотип фильма
        if (Lampa.Storage.get('logo_glav') !== '1') {
            fetchMovieLogo(movieData.id, type, function(logoUrl) {
                const logoImg = render.find('.full-start-new__logo');
                if (logoImg.length) {
                    logoImg.attr('src', logoUrl).show();
                }
            });
        }

        // Логотип компании
        if (movieData.production_companies && movieData.production_companies.length > 0) {
            const company = movieData.production_companies[0];
            if (company.logo_path) {
                const companyLogoUrl = Lampa.TMDB.image(`/t/p/w200${company.logo_path}`);
                const companyLogo = render.find('.full-start-new__company-logo');
                if (companyLogo.length) {
                    companyLogo.attr('src', companyLogoUrl).attr('alt', company.name).show();
                }
            }
        }

        // Метаданные (жанры, рейтинг)
        const metaContainer = render.find('.full-start-new__meta');
        if (metaContainer.length) {
            const metaParts = [];

            // Жанры
            if (movieData.genres && movieData.genres.length > 0) {
                const genres = movieData.genres.slice(0, 3).map(g => g.name).join(' · ');
                metaParts.push(genres);
            }

            // Возрастной рейтинг
            const pg = movieData.age_rating || movieData.content_rating;
            if (pg) {
                metaParts.push(`<span class="full-start-new__age-rating">${pg}</span>`);
            }

            metaContainer.html(metaParts.join(' <span class="full-start-new__meta-separator">·</span> '));
        }

        // Год и продолжительность
        const yearRuntimeContainer = render.find('.full-start-new__year-runtime');
        if (yearRuntimeContainer.length) {
            const parts = [];
            
            const releaseDate = movieData.release_date || movieData.first_air_date || '';
            const year = releaseDate ? releaseDate.slice(0, 4) : '';
            if (year) parts.push(year);

            const runtime = formatRuntime(movieData.runtime);
            if (runtime) parts.push(runtime);

            yearRuntimeContainer.text(parts.join(' · '));
        }
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================

    function init() {
        // 1. Инъекция CSS синхронно
        injectCSS();

        // 2. Переопределение шаблона ДО загрузки
        if (typeof Lampa !== 'undefined' && Lampa.Template) {
            Lampa.Template.add('full_start_new', TEMPLATE_HTML);
        }

        // 3. Применение класса и обработка данных
        Lampa.Listener.follow('activity', function(e) {
            if (e.type === 'create' && e.component === 'full' && e.object && e.object.activity) {
                const render = e.object.activity.render();
                if (render && !render.hasClass('appletv-full')) {
                    render.addClass('appletv-full');
                }
            }
        });

        // 4. Обогащение данными после загрузки
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite' && e.data && e.data.movie && e.object && e.object.activity) {
                enhanceLayout(e.object.activity, e.data.movie);
            }
        });
    }

    // ==================== ЗАПУСК ====================

    if (!window.appletv_style_plugin) {
        window.appletv_style_plugin = true;
        
        if (typeof Lampa !== 'undefined') {
            init();
        } else {
            // Если Lampa еще не загружена, ждем
            window.addEventListener('DOMContentLoaded', init);
        }
    }

})();
