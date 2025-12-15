(function () {
    'use strict';

    // Машина состояний для управления переходами между различными состояниями плеера
    class StateMachine {
        constructor(initialState, transitions) {
            this.currentState = initialState;
            this.transitions = transitions;
        }

        start() {
            this.dispatch(this.currentState);
        }

        dispatch(stateName) {
            const action = this.transitions[stateName];
            if (action) {
                action.call(this, this);
            }
        }
    }

    // YouTube плеер для воспроизведения трейлеров
    class YouTubePlayer {
        constructor(video) {
            this.video = video;
            this.paused = false;
            this.visible = false;
            this.ended = false;
            this.loaded = false;
            this.listener = Lampa.Subscribe();
            this.timer = null;
            
            this.createHTML();
            this.initPlayer();
        }

        createHTML() {
            this.html = $(`
                <div class="cardify-trailer">
                    <div class="cardify-trailer__youtube">
                        <div class="cardify-trailer__youtube-iframe"></div>
                        <div class="cardify-trailer__youtube-line one"></div>
                        <div class="cardify-trailer__youtube-line two"></div>
                    </div>
                    <div class="cardify-trailer__controlls">
                        <div class="cardify-trailer__title"></div>
                        <div class="cardify-trailer__remote">
                            <div class="cardify-trailer__remote-icon">
                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M32.5196 7.22042L26.7992 12.9408C27.8463 14.5217 28.4561 16.4175 28.4561 18.4557C28.4561 20.857 27.6098 23.0605 26.1991 24.7844L31.8718 30.457C34.7226 27.2724 36.4561 23.0667 36.4561 18.4561C36.4561 14.2059 34.983 10.2998 32.5196 7.22042Z" fill="white" fill-opacity="0.28"/>
                                    <path d="M31.262 31.1054L31.1054 31.262C31.158 31.2102 31.2102 31.158 31.262 31.1054Z" fill="white" fill-opacity="0.28"/>
                                    <path d="M29.6917 32.5196L23.971 26.7989C22.3901 27.846 20.4943 28.4557 18.4561 28.4557C16.4179 28.4557 14.5221 27.846 12.9412 26.7989L7.22042 32.5196C10.2998 34.983 14.2059 36.4561 18.4561 36.4561C22.7062 36.4561 26.6123 34.983 29.6917 32.5196Z" fill="white" fill-opacity="0.28"/>
                                    <path d="M5.81349 31.2688L5.64334 31.0986C5.69968 31.1557 5.7564 31.2124 5.81349 31.2688Z" fill="white" fill-opacity="0.28"/>
                                    <path d="M5.04033 30.4571L10.7131 24.7844C9.30243 23.0605 8.4561 20.857 8.4561 18.4557C8.4561 16.4175 9.06588 14.5217 10.113 12.9408L4.39251 7.22037C1.9291 10.2998 0.456055 14.2059 0.456055 18.4561C0.456054 23.0667 2.18955 27.2724 5.04033 30.4571Z" fill="white" fill-opacity="0.28"/>
                                    <path d="M6.45507 5.04029C9.63973 2.18953 13.8455 0.456055 18.4561 0.456055C23.0667 0.456054 27.2724 2.18955 30.4571 5.04034L24.7847 10.7127C23.0609 9.30207 20.8573 8.45575 18.4561 8.45575C16.0549 8.45575 13.8513 9.30207 12.1275 10.7127L6.45507 5.04029Z" fill="white" fill-opacity="0.28"/>
                                    <circle cx="18.4565" cy="18.4561" r="7" fill="white"/>
                                </svg>
                            </div>
                            <div class="cardify-trailer__remote-text">${Lampa.Lang.translate('cardify_enable_sound')}</div>
                        </div>
                    </div>
                </div>
            `);
        }

        initPlayer() {
            if (typeof YT === 'undefined' || !YT.Player) return;

            this.youtube = new YT.Player(this.html.find('.cardify-trailer__youtube-iframe')[0], {
                height: window.innerHeight * 2,
                width: window.innerWidth,
                playerVars: {
                    controls: 1,
                    showinfo: 0,
                    autohide: 1,
                    modestbranding: 1,
                    autoplay: 0,
                    disablekb: 1,
                    fs: 0,
                    enablejsapi: 1,
                    playsinline: 1,
                    rel: 0,
                    suggestedQuality: 'hd1080',
                    setPlaybackQuality: 'hd1080',
                    mute: 1
                },
                videoId: this.video.id,
                events: {
                    onReady: () => this.onPlayerReady(),
                    onStateChange: (state) => this.onPlayerStateChange(state),
                    onError: () => this.onPlayerError()
                }
            });
        }

        onPlayerReady() {
            this.loaded = true;
            this.listener.send('loaded');
        }

        onPlayerStateChange(state) {
            if (state.data === YT.PlayerState.PLAYING) {
                this.handlePlaying();
            } else if (state.data === YT.PlayerState.PAUSED) {
                this.handlePaused();
            } else if (state.data === YT.PlayerState.ENDED) {
                this.listener.send('ended');
            } else if (state.data === YT.PlayerState.BUFFERING) {
                state.target.setPlaybackQuality('hd1080');
            }
        }

        handlePlaying() {
            this.paused = false;
            clearInterval(this.timer);
            
            this.timer = setInterval(() => {
                const timeLeft = this.youtube.getDuration() - this.youtube.getCurrentTime();
                const fadeStart = 13;
                const fadeDuration = 5;

                if (timeLeft <= fadeStart + fadeDuration) {
                    const volume = 1 - (fadeStart + fadeDuration - timeLeft) / fadeDuration;
                    this.youtube.setVolume(Math.max(0, volume * 100));

                    if (timeLeft <= fadeStart) {
                        clearInterval(this.timer);
                        this.listener.send('ended');
                    }
                }
            }, 100);

            this.listener.send('play');
            if (window.cardify_first_unmute) this.unmute();
        }

        handlePaused() {
            this.paused = true;
            clearInterval(this.timer);
            this.listener.send('paused');
        }

        onPlayerError() {
            this.loaded = false;
            this.listener.send('error');
        }

        play() {
            try {
                this.youtube.playVideo();
            } catch (e) {}
        }

        pause() {
            try {
                this.youtube.pauseVideo();
            } catch (e) {}
        }

        unmute() {
            try {
                this.youtube.unMute();
                this.html.find('.cardify-trailer__remote').remove();
                window.cardify_first_unmute = true;
            } catch (e) {}
        }

        show() {
            this.html.addClass('display');
            this.visible = true;
        }

        hide() {
            this.html.removeClass('display');
            this.visible = false;
        }

        render() {
            return this.html;
        }

        destroy() {
            this.loaded = false;
            this.visible = false;

            try {
                this.youtube.destroy();
            } catch (e) {}

            clearInterval(this.timer);
            this.html.remove();
        }
    }

    // Управление трейлером на странице full
    class TrailerManager {
        constructor(fullObject, video) {
            this.object = fullObject;
            this.video = video;
            this.player = null;
            this.loadDelay = 1200;
            this.firstLaunch = false;
            this.timers = { load: null, show: null, anim: null };
            
            this.cacheElements();
            this.initStateMachine();
            this.start();
        }

        cacheElements() {
            this.elements = {
                background: this.object.activity.render().find('.full-start__background'),
                startBlock: this.object.activity.render().find('.cardify'),
                head: $('.head')
            };
        }

        initStateMachine() {
            this.state = new StateMachine('start', {
                start: (state) => {
                    clearTimeout(this.timers.load);
                    
                    if (this.player.visible) {
                        state.dispatch('play');
                    } else if (this.player.loaded) {
                        this.animateLoadProgress();
                        this.timers.load = setTimeout(() => state.dispatch('load'), this.loadDelay);
                    }
                },
                load: (state) => {
                    if (this.player.loaded && this.isActiveController() && this.isSameActivity()) {
                        state.dispatch('play');
                    }
                },
                play: () => {
                    this.player.play();
                },
                toggle: (state) => {
                    clearTimeout(this.timers.load);
                    
                    if (Lampa.Controller.enabled().name === 'cardify_trailer') {
                        return;
                    }
                    
                    if (this.isActiveController() && this.isSameActivity()) {
                        state.start();
                    } else if (this.player.visible) {
                        state.dispatch('hide');
                    }
                },
                hide: () => {
                    this.player.pause();
                    this.player.hide();
                    this.elements.background.removeClass('nodisplay');
                    this.elements.startBlock.removeClass('nodisplay');
                    this.elements.head.removeClass('nodisplay');
                    this.object.activity.render().find('.cardify-preview__loader').width(0);
                }
            });
        }

        isSameActivity() {
            return Lampa.Activity.active().activity === this.object.activity;
        }

        isActiveController() {
            return Lampa.Controller.enabled().name === 'full_start';
        }

        animateLoadProgress() {
            const loader = this.object.activity.render().find('.cardify-preview__loader').width(0);
            const startTime = Date.now();
            
            clearInterval(this.timers.anim);
            this.timers.anim = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed > this.loadDelay) {
                    clearInterval(this.timers.anim);
                }
                loader.width(Math.round(elapsed / this.loadDelay * 100) + '%');
            }, 100);
        }

        createPreview() {
            const preview = $(`
                <div class="cardify-preview">
                    <div>
                        <img class="cardify-preview__img" />
                        <div class="cardify-preview__line one"></div>
                        <div class="cardify-preview__line two"></div>
                        <div class="cardify-preview__loader"></div>
                    </div>
                </div>
            `);
            
            Lampa.Utils.imgLoad($('img', preview), this.video.img, () => {
                $('img', preview).addClass('loaded');
            });
            
            this.object.activity.render().find('.cardify__right').append(preview);
        }

        setupController() {
            const exitTrailer = () => {
                this.state.dispatch('hide');
                Lampa.Controller.toggle('full_start');
            };

            Lampa.Controller.add('cardify_trailer', {
                toggle: () => Lampa.Controller.clear(),
                enter: () => this.player.unmute(),
                left: exitTrailer,
                up: exitTrailer,
                down: exitTrailer,
                right: exitTrailer,
                back: () => {
                    this.player.destroy();
                    this.object.activity.render().find('.cardify-preview').remove();
                    exitTrailer();
                }
            });
            
            Lampa.Controller.toggle('cardify_trailer');
        }

        start() {
            this.object.activity.trailer_ready = true;
            
            // События
            const onToggle = () => this.state.dispatch('toggle');
            const onDestroy = (e) => {
                if (e.type === 'destroy' && e.object.activity === this.object.activity) {
                    this.cleanup();
                }
            };

            Lampa.Listener.follow('activity', onDestroy);
            Lampa.Controller.listener.follow('toggle', onToggle);

            this.cleanupCallbacks = () => {
                Lampa.Listener.remove('activity', onDestroy);
                Lampa.Controller.listener.remove('toggle', onToggle);
            };

            // Плеер
            this.player = new YouTubePlayer(this.video);
            
            this.player.listener.follow('loaded', () => {
                this.createPreview();
                this.state.start();
            });

            this.player.listener.follow('play', () => {
                clearTimeout(this.timers.show);

                if (!this.firstLaunch) {
                    this.firstLaunch = true;
                    this.loadDelay = 5000;
                }

                this.timers.show = setTimeout(() => {
                    this.player.show();
                    this.elements.background.addClass('nodisplay');
                    this.elements.startBlock.addClass('nodisplay');
                    this.elements.head.addClass('nodisplay');
                    this.setupController();
                }, 500);
            });

            this.player.listener.follow('ended,error', () => {
                this.state.dispatch('hide');
                
                if (Lampa.Controller.enabled().name !== 'full_start') {
                    Lampa.Controller.toggle('full_start');
                }
                
                this.object.activity.render().find('.cardify-preview').remove();
                setTimeout(() => this.cleanup(), 300);
            });

            this.object.activity.render().find('.activity__body').prepend(this.player.render());
            this.state.start();
        }

        cleanup() {
            Object.values(this.timers).forEach(timer => clearTimeout(timer));
            clearInterval(this.timers.anim);
            this.cleanupCallbacks?.();
            this.player?.destroy();
        }

        destroy() {
            this.cleanup();
        }
    }

    // Утилиты для работы с видео
    const VideoUtils = {
        findBestTrailer(data) {
            if (!data.videos?.results?.length) return null;

            const trailers = data.videos.results.map(video => ({
                title: Lampa.Utils.shortText(video.name, 50),
                id: video.key,
                code: video.iso_639_1,
                time: new Date(video.published_at).getTime(),
                url: `https://www.youtube.com/watch?v=${video.key}`,
                img: `https://img.youtube.com/vi/${video.key}/default.jpg`
            }));

            trailers.sort((a, b) => b.time - a.time);

            const userLang = Lampa.Storage.field('tmdb_lang');
            const langPriority = [
                trailers.filter(v => v.code === userLang),
                trailers.filter(v => v.code === 'en')
            ];

            return langPriority.flat()[0] || null;
        }
    };

    // Главная функция плагина
    function initializePlugin() {
        if (!Lampa.Platform.screen('tv')) {
            console.log('Cardify', 'TV mode only');
            return;
        }

        addTranslations();
        addCustomTemplate();
        addStyles();
        addSettings();
        attachEventListeners();
    }

    function addTranslations() {
        Lampa.Lang.add({
            cardify_enable_sound: {
                ru: 'Включить звук',
                en: 'Enable sound',
                uk: 'Увімкнути звук',
                be: 'Уключыць гук',
                zh: '启用声音',
                pt: 'Ativar som',
                bg: 'Включване на звук'
            },
            cardify_enable_trailer: {
                ru: 'Показывать трейлер',
                en: 'Show trailer',
                uk: 'Показувати трейлер',
                be: 'Паказваць трэйлер',
                zh: '显示预告片',
                pt: 'Mostrar trailer',
                bg: 'Показване на трейлър'
            }
        });
    }

    function addCustomTemplate() {
        const template = `<div class="full-start-new cardify">
        <div class="full-start-new__body">
            <div class="full-start-new__left hide">
                <div class="full-start-new__poster">
                    <img class="full-start-new__img full--poster" />
                </div>
            </div>

            <div class="full-start-new__right">
                <div class="cardify__left">
                    <div class="full-start-new__head"></div>
                    <div class="full-start-new__title">{title}</div>

                    <div class="cardify__details">
                        <div class="full-start-new__details"></div>
                    </div>

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

        Lampa.Template.add('full_start_new', template);
    }

    function addStyles() {
        const styles = `<style>
.cardify{transition:all .3s}.cardify .full-start-new__body{height:80vh}.cardify .full-start-new__right{display:flex;align-items:flex-end}.cardify .full-start-new__title{text-shadow:0 0 .1em rgba(0,0,0,0.3)}.cardify__left{flex-grow:1}.cardify__right{display:flex;align-items:center;flex-shrink:0;position:relative}.cardify__details{display:flex}.cardify .full-start-new__reactions{margin:0;margin-right:-2.8em}.cardify .full-start-new__reactions:not(.focus){margin:0}.cardify .full-start-new__reactions:not(.focus)>div:not(:first-child){display:none}.cardify .full-start-new__reactions:not(.focus) .reaction{position:relative}.cardify .full-start-new__reactions:not(.focus) .reaction__count{position:absolute;top:28%;left:95%;font-size:1.2em;font-weight:500}.cardify .full-start-new__rate-line{margin:0;margin-left:3.5em}.cardify .full-start-new__rate-line>*:last-child{margin-right:0!important}.cardify__background{left:0}.cardify__background.loaded:not(.dim){opacity:1}.cardify__background.nodisplay{opacity:0!important}.cardify.nodisplay{transform:translate3d(0,50%,0);opacity:0}.cardify-trailer{opacity:0;transition:opacity .3s}.cardify-trailer__youtube{background-color:#000;position:fixed;top:-60%;left:0;bottom:-60%;width:100%;display:flex;align-items:center}.cardify-trailer__youtube iframe{border:0;width:100%;flex-shrink:0}.cardify-trailer__youtube-line{position:fixed;height:6.2em;background-color:#000;width:100%;left:0;display:none}.cardify-trailer__youtube-line.one{top:0}.cardify-trailer__youtube-line.two{bottom:0}.cardify-trailer__controlls{position:fixed;left:1.5em;right:1.5em;bottom:1.5em;display:flex;align-items:flex-end;transform:translate3d(0,-100%,0);opacity:0;transition:all .3s}.cardify-trailer__title{flex-grow:1;padding-right:5em;font-size:4em;font-weight:600;overflow:hidden;text-overflow:'.';display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical;line-height:1.4}.cardify-trailer__remote{flex-shrink:0;display:flex;align-items:center}.cardify-trailer__remote-icon{flex-shrink:0;width:2.5em;height:2.5em}.cardify-trailer__remote-text{margin-left:1em}.cardify-trailer.display{opacity:1}.cardify-trailer.display .cardify-trailer__controlls{transform:translate3d(0,0,0);opacity:1}.cardify-preview{position:absolute;bottom:100%;right:0;border-radius:.3em;width:6em;height:4em;display:flex;background-color:#000;overflow:hidden}.cardify-preview>div{position:relative;width:100%;height:100%}.cardify-preview__img{opacity:0;position:absolute;left:0;top:0;width:100%;height:100%;background-size:cover;transition:opacity .2s}.cardify-preview__img.loaded{opacity:1}.cardify-preview__loader{position:absolute;left:50%;bottom:0;transform:translate3d(-50%,0,0);height:.2em;border-radius:.2em;background-color:#fff;width:0;transition:width .1s linear}.cardify-preview__line{position:absolute;height:.8em;left:0;width:100%;background-color:#000}.cardify-preview__line.one{top:0}.cardify-preview__line.two{bottom:0}.head.nodisplay{transform:translate3d(0,-100%,0)}body:not(.menu--open) .cardify__background{mask-image:linear-gradient(to bottom,white 50%,rgba(255,255,255,0) 100%)}
</style>`;
        
        Lampa.Template.add('cardify_css', styles);
        $('body').append(Lampa.Template.get('cardify_css', {}, true));
    }

    function addSettings() {
        const icon = `<svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1.5" width="33" height="25" rx="3.5" stroke="white" stroke-width="3"/>
            <rect x="5" y="14" width="17" height="4" rx="2" fill="white"/>
            <rect x="5" y="20" width="10" height="3" rx="1.5" fill="white"/>
            <rect x="25" y="20" width="6" height="3" rx="1.5" fill="white"/>
        </svg>`;

        Lampa.SettingsApi.addComponent({
            component: 'cardify',
            icon: icon,
            name: 'Cardify'
        });

        Lampa.SettingsApi.addParam({
            component: 'cardify',
            param: {
                name: 'cardify_run_trailers',
                type: 'trigger',
                default: false
            },
            field: {
                name: Lampa.Lang.translate('cardify_enable_trailer')
            }
        });
    }

    function attachEventListeners() {
        Lampa.Listener.follow('full', (event) => {
            if (event.type !== 'complite') return;

            // Улучшаем качество фона
            enhanceBackground(event);

            // Запускаем трейлер если включено в настройках
            if (Lampa.Storage.field('cardify_run_trailers')) {
                startTrailer(event);
            }
        });
    }

    function enhanceBackground(event) {
        const background = event.object.activity.render().find('.full-start__background');
        const currentSrc = background.attr('src');
        
        if (currentSrc) {
            background.addClass('cardify__background')
                     .attr('src', currentSrc.replace('w1280', 'original'));
        }
    }

    function startTrailer(event) {
        const trailer = VideoUtils.findBestTrailer(event.data);
        if (!trailer) return;

        const minVersion = 220;
        if (Lampa.Manifest.app_digital < minVersion) return;

        if (Lampa.Activity.active().activity === event.object.activity) {
            new TrailerManager(event.object, trailer);
        } else {
            const onActivityStart = (activityEvent) => {
                if (activityEvent.type === 'start' && 
                    activityEvent.object.activity === event.object.activity && 
                    !event.object.activity.trailer_ready) {
                    
                    Lampa.Listener.remove('activity', onActivityStart);
                    new TrailerManager(event.object, trailer);
                }
            };

            Lampa.Listener.follow('activity', onActivityStart);
        }
    }

    // Запуск плагина
    if (window.appready) {
        initializePlugin();
    } else {
        Lampa.Listener.follow('app', (event) => {
            if (event.type === 'ready') {
                initializePlugin();
            }
        });
    }

})();

