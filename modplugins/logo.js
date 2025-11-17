(function() {
    'use strict';

    // Добавляем CSS стили для адаптивных логотипов
    var logoStyles = "\n        <style>\n        .logo-plugin-img {\n            display: block;\n            margin-top: 0.3em;\n            width: auto;\n            height: auto;\n            object-fit: contain;\n            object-position: left center;\n        }\n        \n        /* Для оригинального качества - не применяем фиксированные высоты */\n        .logo-plugin-quality-original .logo-plugin-img {\n            height: auto !important;\n            max-width: 100%;\n        }\n        \n        /* Размеры логотипов - фиксированная высота независимо от качества */\n        .logo-plugin-size-small .logo-plugin-img {\n            height: 80px;\n            max-width: 100%;\n        }\n        \n        .logo-plugin-size-medium .logo-plugin-img {\n            height: 125px;\n            max-width: 100%;\n        }\n        \n        .logo-plugin-size-large .logo-plugin-img {\n            height: 180px;\n            max-width: 100%;\n        }\n        \n        .logo-plugin-size-xlarge .logo-plugin-img {\n            height: 250px;\n            max-width: 100%;\n        }\n        \n        /* Адаптивность для разных устройств */\n        @media (max-width: 767px) {\n            .logo-plugin-img {\n                height: 60px !important;\n                max-width: 100%;\n            }\n            .logo-plugin-quality-original .logo-plugin-img {\n                height: auto !important;\n            }\n        }\n        \n        @media (min-width: 768px) and (max-width: 1279px) {\n            .logo-plugin-size-small .logo-plugin-img {\n                height: 100px;\n            }\n            .logo-plugin-size-medium .logo-plugin-img {\n                height: 150px;\n            }\n            .logo-plugin-size-large .logo-plugin-img {\n                height: 220px;\n            }\n            .logo-plugin-size-xlarge .logo-plugin-img {\n                height: 300px;\n            }\n            .logo-plugin-quality-original .logo-plugin-img {\n                height: auto !important;\n            }\n        }\n        \n        @media (min-width: 1920px) {\n            .logo-plugin-size-small .logo-plugin-img {\n                height: 120px;\n            }\n            .logo-plugin-size-medium .logo-plugin-img {\n                height: 180px;\n            }\n            .logo-plugin-size-large .logo-plugin-img {\n                height: 260px;\n            }\n            .logo-plugin-size-xlarge .logo-plugin-img {\n                height: 350px;\n            }\n            .logo-plugin-quality-original .logo-plugin-img {\n                height: auto !important;\n            }\n        }\n        \n        @media (min-width: 3840px) {\n            .logo-plugin-size-small .logo-plugin-img {\n                height: 160px;\n            }\n            .logo-plugin-size-medium .logo-plugin-img {\n                height: 240px;\n            }\n            .logo-plugin-size-large .logo-plugin-img {\n                height: 340px;\n            }\n            .logo-plugin-size-xlarge .logo-plugin-img {\n                height: 480px;\n            }\n            .logo-plugin-quality-original .logo-plugin-img {\n                height: auto !important;\n            }\n        }\n        </style>\n    ";
    
    if (typeof Lampa !== 'undefined' && Lampa.Template) {
        Lampa.Template.add('logo_plugin_styles', logoStyles);
        $('body').append(Lampa.Template.get('logo_plugin_styles', {}, true));
    } else {
        $('body').append(logoStyles);
    }

    // Хранилище данных о текущих логотипах для обновления
    var currentLogos = [];
    
    
    // Функция для обработки года из full-start-new__head
    function processYear(activity) {
        if (!activity) return;
        
        try {
            var render = activity.render();
            var headElement = render.find('.full-start-new__head');
            
            if (headElement.length > 0) {
                // Скрываем элемент
                headElement.css('display', 'none');
                
                // Извлекаем год из первого span
                var yearSpan = headElement.find('span').first();
                var year = yearSpan.text().trim();
                
                // Находим элемент cardify__details и внутри него full-start-new__details
                var detailsContainer = render.find('.cardify__details .full-start-new__details');
                
                if (detailsContainer.length > 0 && year) {
                    // Проверяем, не добавлен ли уже год (чтобы не дублировать)
                    var existingYear = detailsContainer.find('span:contains("' + year + '")').filter(function() {
                        return $(this).text().trim() === year;
                    });
                    
                    if (existingYear.length === 0) {
                        // Добавляем разделитель и год перед закрывающим div
                        detailsContainer.append('<span class="full-start-new__split">●</span><span>' + year + '</span>');
                    }
                }
            }
        } catch (e) {
            // Игнорируем ошибки
        }
    }
    
    
    // Функция для применения логотипа с текущими настройками
    function applyLogo(activity, logoPath) {
        if (!activity || !logoPath) return;
        
        // Получаем настройки
        var size = Lampa.Storage.get('logo_size') || 'medium';
        var quality = Lampa.Storage.get('logo_quality') || 'w500';
        
        // Определяем путь к изображению
        var imagePath = logoPath.replace('.svg', '.png');
        var imageUrl = Lampa.TMDB.image('/t/p/' + quality + imagePath);
        
        // Создаем класс для размера
        var sizeClass = 'logo-plugin-size-' + size;
        
        // Находим контейнер (поддерживаем оба интерфейса - старый и новый)
        var titleContainer = activity.render().find('.full-start-new__title, .new-interface-info__title');
        
        if (titleContainer.length > 0) {
            // Удаляем старые классы размера
            titleContainer.removeClass('logo-plugin-size-small logo-plugin-size-medium logo-plugin-size-large logo-plugin-size-xlarge');
            
            // Если качество оригинал, добавляем специальный класс
            if (quality === 'original') {
                titleContainer.addClass('logo-plugin-quality-original');
            } else {
                titleContainer.removeClass('logo-plugin-quality-original');
                // Добавляем класс размера только если не оригинал
                titleContainer.addClass(sizeClass);
            }
            
            // Обновляем изображение (добавляем timestamp для принудительной перезагрузки при изменении качества)
            var img = titleContainer.find('.logo-plugin-img');
            if (img.length > 0) {
                img.attr('src', imageUrl + '?t=' + Date.now());
            } else {
                titleContainer.html('<img class="logo-plugin-img" src="' + imageUrl + '" alt=""/>');
                img = titleContainer.find('.logo-plugin-img');
            }
            
            // Если качество оригинал, ограничиваем высоту оригинальным размером изображения
            if (quality === 'original' && img.length > 0) {
                var tempImg = new Image();
                tempImg.onload = function() {
                    var naturalHeight = this.naturalHeight;
                    if (naturalHeight > 0) {
                        img.css({
                            'max-height': naturalHeight + 'px',
                            'height': 'auto'
                        });
                    }
                };
                tempImg.onerror = function() {
                    // Если не удалось загрузить, используем стандартные размеры
                    titleContainer.removeClass('logo-plugin-quality-original');
                    titleContainer.addClass(sizeClass);
                };
                tempImg.src = imageUrl;
            } else {
                // Убираем ограничение max-height для неоригинального качества
                img.css('max-height', '');
            }
            
            // Обрабатываем год
            processYear(activity);
        }
    }
    
    // Функция для обновления всех видимых логотипов на странице
    function updateAllLogos() {
        if (Lampa.Storage.get('logo_glav') == '1') {
            // Если логотипы отключены, удаляем их
            $('.full-start-new__title, .new-interface-info__title').find('.logo-plugin-img').remove();
            $('.full-start-new__title, .new-interface-info__title').removeClass('logo-plugin-size-small logo-plugin-size-medium logo-plugin-size-large logo-plugin-size-xlarge logo-plugin-quality-original');
            return;
        }
        
        // Получаем настройки
        var size = Lampa.Storage.get('logo_size') || 'medium';
        var quality = Lampa.Storage.get('logo_quality') || 'w500';
        
        // Обновляем все видимые логотипы на странице
        $('.full-start-new__title, .new-interface-info__title').each(function() {
            var titleContainer = $(this);
            var img = titleContainer.find('.logo-plugin-img');
            
            if (img.length > 0) {
                // Получаем текущий src и извлекаем путь к логотипу
                var currentSrc = img.attr('src');
                if (currentSrc) {
                    // Извлекаем путь к логотипу из URL (убираем параметры и путь к качеству)
                    var logoMatch = currentSrc.match(/\/(w\d+|original)(.+\.(png|jpg|jpeg))/i);
                    if (logoMatch && logoMatch[2]) {
                        var logoPath = logoMatch[2];
                        var imagePath = logoPath.replace('.svg', '.png');
                        var imageUrl = Lampa.TMDB.image('/t/p/' + quality + imagePath);
                        
                        // Удаляем старые классы размера
                        titleContainer.removeClass('logo-plugin-size-small logo-plugin-size-medium logo-plugin-size-large logo-plugin-size-xlarge');
                        
                        // Если качество оригинал, добавляем специальный класс
                        if (quality === 'original') {
                            titleContainer.removeClass('logo-plugin-quality-original');
                            titleContainer.addClass('logo-plugin-quality-original');
                        } else {
                            titleContainer.removeClass('logo-plugin-quality-original');
                            // Добавляем класс размера только если не оригинал
                            titleContainer.addClass('logo-plugin-size-' + size);
                        }
                        
                        // Обновляем изображение
                        img.attr('src', imageUrl + '?t=' + Date.now());
                        
                        // Если качество оригинал, ограничиваем высоту оригинальным размером изображения
                        if (quality === 'original') {
                            var tempImg = new Image();
                            tempImg.onload = function() {
                                var naturalHeight = this.naturalHeight;
                                if (naturalHeight > 0) {
                                    img.css({
                                        'max-height': naturalHeight + 'px',
                                        'height': 'auto'
                                    });
                                }
                            };
                            tempImg.onerror = function() {
                                // Если не удалось загрузить, используем стандартные размеры
                                titleContainer.removeClass('logo-plugin-quality-original');
                                titleContainer.addClass('logo-plugin-size-' + size);
                            };
                            tempImg.src = imageUrl;
                        } else {
                            // Убираем ограничение max-height для неоригинального качества
                            img.css('max-height', '');
                        }
                    }
                }
            }
        });
        
        // Также обновляем сохраненные логотипы
        for (var i = 0; i < currentLogos.length; i++) {
            try {
                var logoData = currentLogos[i];
                if (logoData && logoData.activity && logoData.logoPath) {
                    applyLogo(logoData.activity, logoData.logoPath);
                }
            } catch (e) {
                // Игнорируем ошибки для неактивных активностей
            }
        }
    }
    
    function startPlugin() {
        window.logoplugin = !0;
        
        // Слушаем события full для загрузки логотипов
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var data = e.data.movie;
                if (data && e.object && e.object.activity) {
                    // Обрабатываем год независимо от наличия логотипа
                    processYear(e.object.activity);
                    
                    if (Lampa.Storage.get('logo_glav') != '1') {
                        var type = data.name ? 'tv' : 'movie';
                        if (data.id != '') {
                            var url = Lampa.TMDB.api(type + '/' + data.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language'));
                            $.get(url, function(imagesData) {
                                if (imagesData.logos && imagesData.logos[0]) {
                                    var logo = imagesData.logos[0].file_path;
                                    if (logo != '') {
                                        // Сохраняем данные для последующего обновления
                                        currentLogos.push({
                                            activity: e.object.activity,
                                            logoPath: logo
                                        });
                                        
                                        // Применяем логотип
                                        applyLogo(e.object.activity, logo);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
        
        // Переменные для отслеживания изменений настроек
        var lastLogoSize = Lampa.Storage.get('logo_size') || 'medium';
        var lastLogoQuality = Lampa.Storage.get('logo_quality') || 'w500';
        var lastLogoGlav = Lampa.Storage.get('logo_glav') || '0';
        
        // Слушаем изменения настроек через Storage listener
        if (typeof Lampa !== 'undefined' && Lampa.Storage && Lampa.Storage.listener) {
            Lampa.Storage.listener.follow('change', function(e) {
                if (e.name === 'logo_size' || e.name === 'logo_quality' || e.name === 'logo_glav') {
                    // Небольшая задержка для применения изменений
                    setTimeout(function() {
                        updateAllLogos();
                    }, 100);
                }
            });
        }
        
        // Альтернативный способ через Subscribe, если Storage.listener недоступен
        if (typeof Lampa !== 'undefined' && Lampa.Subscribe) {
            var storageSubscribe = Lampa.Subscribe('storage');
            if (storageSubscribe) {
                storageSubscribe.follow('change', function(e) {
                    if (e.name === 'logo_size' || e.name === 'logo_quality' || e.name === 'logo_glav') {
                        setTimeout(function() {
                            updateAllLogos();
                        }, 100);
                    }
                });
            }
        }
        
        // Периодическая проверка изменений настроек (fallback, если listener не работает)
        var settingsCheckInterval = setInterval(function() {
            var currentSize = Lampa.Storage.get('logo_size') || 'medium';
            var currentQuality = Lampa.Storage.get('logo_quality') || 'w500';
            var currentGlav = Lampa.Storage.get('logo_glav') || '0';
            
            if (currentSize !== lastLogoSize || currentQuality !== lastLogoQuality || currentGlav !== lastLogoGlav) {
                lastLogoSize = currentSize;
                lastLogoQuality = currentQuality;
                lastLogoGlav = currentGlav;
                updateAllLogos();
            }
        }, 500);
        
        // Очистка неактивных логотипов каждые 30 секунд
        setInterval(function() {
            currentLogos = currentLogos.filter(function(logoData) {
                try {
                    // Проверяем, активна ли еще activity
                    if (logoData.activity && logoData.activity.render) {
                        var container = logoData.activity.render().find('.full-start-new__title, .new-interface-info__title');
                        return container.length > 0 && container.find('.logo-plugin-img').length > 0;
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            });
        }, 30000);
    }
    
    // Настройка: показывать/скрывать логотипы
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_glav',
            type: 'select',
            values: {
                1: 'Скрыть',
                0: 'Отображать',
            },
            default: '0',
        },
        field: {
            name: 'Логотипы вместо названий',
            description: 'Отображает логотипы фильмов вместо текста',
        }
    });
    
    // Настройка: размер логотипа
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_size',
            type: 'select',
            values: {
                'small': 'Маленький',
                'medium': 'Средний',
                'large': 'Большой',
                'xlarge': 'Очень большой',
            },
            default: 'medium',
        },
        field: {
            name: 'Размер логотипа',
            description: 'Размер отображаемого логотипа (адаптивно под размер экрана)',
        }
    });
    
    // Настройка: качество изображения
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_quality',
            type: 'select',
            values: {
                'w300': 'Низкое (w300)',
                'w500': 'Среднее (w500)',
                'w780': 'Высокое (w780)',
                'original': 'Оригинал',
            },
            default: 'w500',
        },
        field: {
            name: 'Качество логотипа',
            description: 'Качество загружаемого изображения логотипа',
        }
    });
    
    if (!window.logoplugin) startPlugin();
})()