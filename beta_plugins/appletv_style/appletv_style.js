(function() {
    'use strict';
    console.log('оооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо');

    if (window.appletv_pro_loaded) return;
    window.appletv_pro_loaded = true;

    // === CONFIGURATION ===
    const CONFIG = {
        logoSizes: { small: 60, medium: 100, large: 140, xlarge: 180 },
        companyIconSize: 40,
        ageRatingPadding: '0.3em 0.6em'
    };

    // === CSS INJECTION ===
    const injectStyles = () => {
        if (document.getElementById('appletv-pro-css')) return;
        
        $('<style>').attr('id', 'appletv-pro-css').text(`
.atv{background:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)!important}
.atv .full-start{padding:0!important;position:relative}
.atv .full-start__background{position:absolute!important;top:-8em!important;left:0!important;width:100%!important;height:45em!important;z-index:0!important;object-fit:cover;mask-image:linear-gradient(to bottom,rgba(0,0,0,.7) 0%,transparent 100%)!important;filter:blur(35px) saturate(1.4);opacity:0!important;transition:opacity .7s ease!important}
.atv .full-start__background.loaded{opacity:.5!important}
.atv .full-start__body{position:relative;z-index:1;padding:8em 5em 3em 5em!important;gap:4em!important;align-items:center!important}
.atv .full-start__right{order:1!important}
.atv .full-start__poster{width:22em!important;height:33em!important;border-radius:1.2em!important;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3),0 10px 30px rgba(0,0,0,.22);transition:all .3s cubic-bezier(.34,1.56,.64,1)}
.atv .full-start__poster:hover{transform:scale(1.05) translateY(-8px);box-shadow:0 30px 80px rgba(0,0,0,.35),0 15px 40px rgba(0,0,0,.25)}
.atv .full-start__left{order:2!important;max-width:50em!important;padding:0!important}
.atv-logo{display:block;max-width:100%;height:auto;max-height:140px;object-fit:contain;object-position:left center;margin-bottom:.8em}
.atv-meta{display:flex;align-items:center;gap:.8em;margin-bottom:1.2em;flex-wrap:wrap}
.atv-company{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid rgba(0,0,0,.1)}
.atv-genres{font-size:1.1em;color:#424245;font-weight:500}
.atv-age{font-size:1em;color:#1d1d1f;font-weight:700;background:rgba(255,255,255,.9);border:2px solid rgba(0,0,0,.15);border-radius:.3em;padding:.3em .6em}
.atv-descr{font-size:1.15em;line-height:1.7;color:#6e6e73;margin-bottom:1.5em}
.atv-info{display:flex;align-items:center;gap:1em;margin-bottom:2em;flex-wrap:wrap}
.atv-info span{font-size:1.1em;color:#424245;font-weight:500}
.atv-info .separator{color:#86868b}
.atv .full-start-new__buttons{gap:1em!important;margin-top:0!important}
.atv .full-start-new__buttons .button{padding:1.1em 3.2em!important;font-size:1.15em!important;font-weight:600!important;border-radius:1.5em!important;transition:all .3s cubic-bezier(.34,1.56,.64,1)!important;letter-spacing:.01em;box-shadow:0 4px 14px rgba(0,0,0,.15)}
.atv .full-start-new__buttons .button--play,.atv .full-start-new__buttons .button.view--torrent{background:linear-gradient(135deg,#0071e3 0%,#005bb5 100%)!important;color:#fff!important;border:none!important}
.atv .full-start-new__buttons .button--play:hover,.atv .full-start-new__buttons .button.view--torrent:hover{background:linear-gradient(135deg,#0077ed 0%,#0061c1 100%)!important;transform:scale(1.05) translateY(-2px);box-shadow:0 8px 20px rgba(0,113,227,.4)}
.atv .full-start-new__buttons .button:not(.button--play):not(.view--torrent){background:rgba(255,255,255,.9)!important;color:#1d1d1f!important;backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,.4)!important}
.atv .full-start-new__buttons .button:not(.button--play):not(.view--torrent):hover{background:rgba(255,255,255,1)!important;transform:scale(1.05) translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.2)}
.atv .full-descr,.atv .full-persons,.atv .card--collection{padding-left:5em!important;padding-right:5em!important}
.atv .full-descr__title,.atv .full-persons__title,.atv .card--collection .card__title{font-size:2.2em!important;font-weight:700!important;color:#1d1d1f!important}
.atv .full-descr__text{font-size:1.25em!important;line-height:1.75!important;color:#1d1d1f!important}
@media (max-width:1024px){.atv .full-start__body{padding:6em 3em 3em 3em!important;gap:3em!important}.atv .full-start__left{max-width:60%!important}.atv .full-start__poster{width:18em!important;height:27em!important}}
@media (max-width:768px){.atv .full-start__body{flex-direction:column!important;padding:4em 2em 2em 2em!important;gap:2em!important}.atv .full-start__left{max-width:100%!important;text-align:center}.atv-logo{object-position:center}.atv-meta{justify-content:center}.atv .full-start__poster{width:16em!important;height:24em!important;margin:0 auto}}
        `).appendTo('head');
    };

    // === DATA FETCHERS ===
    const fetchLogo = (movieId, isTV) => {
        const type = isTV ? 'tv' : 'movie';
        const url = Lampa.TMDB.api(`${type}/${movieId}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get('language')}`);
        return $.get(url).then(data => data.logos && data.logos[0] ? data.logos[0].file_path : null);
    };

    const fetchCompanyLogo = (companyId) => {
        const url = Lampa.TMDB.api(`company/${companyId}?api_key=${Lampa.TMDB.key()}`);
        return $.get(url).then(data => data.logo_path || null);
    };

    // === CONTENT BUILDERS ===
    const buildLogo = (logoPath) => {
        if (!logoPath) return '';
        const imageUrl = Lampa.TMDB.image(`/t/p/w500${logoPath}`);
        return `<img class="atv-logo" src="${imageUrl}" alt=""/>`;
    };

    const buildCompanyIcon = (logoPath) => {
        if (!logoPath) return '';
        const imageUrl = Lampa.TMDB.image(`/t/p/w200${logoPath}`);
        return `<img class="atv-company" src="${imageUrl}" alt=""/>`;
    };

    const buildGenres = (genres) => {
        if (!genres || !genres.length) return '';
        return genres.slice(0, 3).map(g => g.name).join(' · ');
    };

    const buildAgeRating = (card) => {
        const pg = Lampa.TMDB.parsePG ? Lampa.TMDB.parsePG(card) : null;
        return pg ? `<div class="atv-age">${pg}</div>` : '';
    };

    const buildMetaLine = (movie) => {
        const parts = [];
        const companyLogo = movie.production_companies && movie.production_companies[0] ? 
            movie.production_companies[0].logo_path : null;
        
        if (companyLogo) parts.push(`COMPANY_LOGO_${movie.production_companies[0].id}`);
        
        const genres = buildGenres(movie.genres);
        if (genres) parts.push(`<span class="atv-genres">${genres}</span>`);
        
        const ageRating = buildAgeRating(movie);
        if (ageRating) parts.push(ageRating);
        
        return parts.length ? `<div class="atv-meta">${parts.join('')}</div>` : '';
    };

    const buildDescription = (overview) => {
        if (!overview) return '';
        return `<div class="atv-descr">${overview}</div>`;
    };

    const buildInfoLine = (movie) => {
        const parts = [];
        const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
        if (year) parts.push(`<span>${year}</span>`);
        
        if (movie.runtime) {
            const time = Lampa.Utils.secondsToTime(movie.runtime * 60, true);
            parts.push(`<span>${time}</span>`);
        }
        
        return parts.length ? `<div class="atv-info">${parts.join('<span class="separator">·</span>')}</div>` : '';
    };

    // === MAIN RENDER ===
    const renderAppleTVLayout = async (e) => {
        const movie = e.data.movie;
        const activity = e.object.activity;
        const render = activity.render();
        
        // Add class
        render.addClass('atv');
        
        // Get logo
        const logoPath = await fetchLogo(movie.id, !!movie.name);
        
        // Find left container
        const leftContainer = render.find('.full-start__left');
        if (!leftContainer.length) return;
        
        // Build content
        let content = buildLogo(logoPath);
        const metaLine = buildMetaLine(movie);
        content += metaLine;
        content += buildDescription(movie.overview);
        content += buildInfoLine(movie);
        
        // Insert before buttons
        const buttonsContainer = leftContainer.find('.full-start-new__buttons');
        if (buttonsContainer.length) {
            buttonsContainer.before(content);
        } else {
            leftContainer.prepend(content);
        }
        
        // Hide original title
        leftContainer.find('.full-start-new__title').hide();
        leftContainer.find('.full-start-new__original-title').hide();
        leftContainer.find('.full--tagline').hide();
        leftContainer.find('.full-start__tags').hide();
        leftContainer.find('.full-start-new__description').hide();
        
        // Handle company logo async
        if (movie.production_companies && movie.production_companies[0]) {
            const companyId = movie.production_companies[0].id;
            const companyLogoPath = await fetchCompanyLogo(companyId);
            if (companyLogoPath) {
                const placeholder = leftContainer.find(`.atv-meta:contains("COMPANY_LOGO_${companyId}")`);
                if (placeholder.length) {
                    const html = placeholder.html();
                    placeholder.html(html.replace(`COMPANY_LOGO_${companyId}`, buildCompanyIcon(companyLogoPath)));
                }
            }
        }
    };

    // === INITIALIZATION ===
    const init = () => {
        injectStyles();
        
        Lampa.Listener.follow('full', (e) => {
            if (e.type === 'complite') {
                renderAppleTVLayout(e);
            }
        });
    };

    if (window.appready) init();
    else Lampa.Listener.follow('app', (e) => { if (e.type === 'ready') init(); });

})();
