// gallery-script.js
// Данные о картинах
const paintings = [
    {
        id: 'p1',
        image: 'images/Chainay№5.jpg',
        title: 'Чайная №5',
        author: 'Алексей Алексеевич Моргунов',
        details: 'Яркий образец русского авангарда, сочетание кубизма и футуризма. Геометризация форм: фигуры людей, столы и чайники разложены на простые объемы. Ощущение динамики и шума толпы. Контрастные, открытые цвета создают напряжение и декоративность.',
        meaning: 'Изображение не конкретного помещения, а обобщённого образа городского дна или рабочей окраины. Через дробление форм художник передает ритм индустриального города и обезличенность толпы, где каждый посетитель — лишь часть единого механизма низового быта.',
        aspectRatio: 1.33,
        animation: null
    },
    {
        id: 'p2',
        image: 'images/Ulica.jpg',
        title: 'Улица',
        author: 'Иосиф Соломонович Школьник',
        details: 'Ранний образец символизма в русском искусстве. Хрупкие, бесплотные фигуры, напоминающие призраков или марионеток. Условное, декоративное пространство, отсутствие бытовых деталей. Таинственный полумрак и мерцающий свет фонарей создают атмосферу сна или театрального действа.',
        meaning: 'Не изображение реальной улицы, а символический образ городского одиночества и отчуждения. Застывшие фигуры словно разыгрывают безмолвную сцену, где город становится театром теней. Художник передает не событие, а настроение тревоги и зыбкости окружающего мира.',
        aspectRatio: 1.5,
        animation: null
    },
    {
        id: 'p3',
        image: 'images/Cveti.jpg',
        title: 'Цветы',
        author: 'Борис Михайлович Кустодиев',
        details: 'Натюрморт написан в 1924 году на даче в Луге. Букет садовых цветов (настурции и анютины глазки) в белой кружке размещён на деревянных перилах террасы. Фоном служит опушка леса, что создаёт ощущение глубины и единства с природой. Работа отличается декоративностью и чистотой красок, характерных для позднего периода художника.',
        meaning: 'Произведение стало воплощением творческой воли художника: прикованный к постели, он создавал полный жизни и света натюрморт по совету из письма к сыну, предлагая поставить "окрашенные предметы на воздухе". Это не просто изображение цветов, а гимн радости бытия, умение видеть красоту в простых вещах и передавать ощущение тёплого летнего дня.',
        aspectRatio: 1.2,
        animation: 'animations/cveti-animation.mp4'
    },
    {
        id: 'p4',
        image: 'images/Naturmort.Fructi.jpg',
        title: 'Натюрморт. Фрукты',
        author: 'Мартирос Сергеевич Сарьян',
        details: 'Картина создана в 1915 году и относится к серии работ, где натюрморт стал главным жанром для художника. Изображения плодов решены как крупные красочные пятна — своего рода колористические знаки, лишь напоминающие свои природные прототипы. Художник добивается выразительности через предельное обобщение цвета и упрощение формы, работая в технике темперы на холсте.',
        meaning: 'Произведение воплощает творческое кредо Сарьяна: краски в картине должны быть подобны солистам в ансамбле, а не безликому хору. Отойдя от академических правил, художник не имитирует реальность, а предоставляет зрителю свободу воображения. В основе замысла — утверждение красоты и радости жизни через чистоту и интенсивность цвета.',
        aspectRatio: 1.4,
        animation: 'animations/fructi-animation.mp4'
    },
    {
        id: 'p5',
        image: 'images/Dve jenshini.jpg',
        title: 'Две женщины',
        author: 'Аристарх Васильевич Лентулов',
        details: 'Картина 1919 года сочетает кубизм с декоративностью русского авангарда. Художник разбивает поверхность на цветовые плоскости, подчёркивая формальную выразительность. Две женщины сидят рядом: одна обнажённая, другая в голубом платье и красной косынке. На заднем плане — яркие крыши домов, небо насыщено красными, зелёными, синими и жёлтыми оттенками.',
        meaning: 'Воплощение свободы от академических канонов через обращение к обнажённой натуре. Художник передаёт внутреннюю энергию через динамику цвета и формы. Работа отражает синтез художественных течений — от кубизма до футуризма, утверждая самоценность живописной выразительности.',
        aspectRatio: 1.6,
        animation: null
    }
];

// Функция для получения оптимальной сетки пазла на основе соотношения сторон
function getOptimalGrid(complexity, aspectRatio) {
    const basePieces = {
        easy: 6,
        medium: 12,
        hard: 20
    };
    
    const totalPieces = basePieces[complexity];
    
    // Находим оптимальное количество колонок и строк, сохраняя пропорции
    let bestCols = Math.round(Math.sqrt(totalPieces * aspectRatio));
    let bestRows = Math.round(totalPieces / bestCols);
    
    // Корректируем, чтобы произведение давало нужное количество
    while (bestCols * bestRows < totalPieces) {
        bestRows++;
    }
    while (bestCols * bestRows > totalPieces + 2 && bestRows > 2) {
        bestRows--;
    }
    
    return { cols: bestCols, rows: bestRows };
}

// Состояние игры
const puzzleState = {
    config: null,
    selectedPiece: null,
    draggedPiece: null,
    solved: false,
    difficulty: 'easy',
    currentPaintingId: null,
    currentPaintingIndex: null,
    currentImageSrc: null,
    currentAspectRatio: 1,
    currentAnimation: null
};

// Получаем элементы
const puzzleBoard = document.getElementById('puzzleBoard');
const puzzleModal = document.getElementById('puzzleModal');
const puzzleModalTitle = document.getElementById('puzzleModalTitle');
const closePuzzleModal = document.getElementById('closePuzzleModal');
const modal = document.getElementById('modal');
const puzzleAnimation = document.getElementById('puzzleAnimation');

// Создаем элемент для статуса
const puzzleStatus = document.createElement('span');
puzzleStatus.className = 'puzzle-status';
puzzleStatus.textContent = '';

// Добавляем статус в заголовок после названия
document.querySelector('.puzzle-modal-header h2').appendChild(puzzleStatus);

// Функции для работы с пазлом
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isSolvedOrder(pieces) {
    return [...pieces].every((piece, index) => 
        Number(piece.dataset.correctIndex) === index
    );
}

function isSolvedNow() {
    return [...puzzleBoard.children].every((piece, index) => 
        Number(piece.dataset.correctIndex) === index
    );
}

function clearSelection() {
    if (puzzleState.selectedPiece) {
        puzzleState.selectedPiece.classList.remove('piece--selected');
        puzzleState.selectedPiece = null;
    }
}

function swapPieces(first, second) {
    if (!first || !second || first === second || !first.parentNode) return;

    const parent = first.parentNode;
    if (parent !== second.parentNode) return;

    const firstNext = first.nextSibling;
    const secondNext = second.nextSibling;

    if (firstNext === second) {
        parent.insertBefore(second, first);
        return;
    }

    if (secondNext === first) {
        parent.insertBefore(first, second);
        return;
    }

    parent.insertBefore(second, firstNext);
    parent.insertBefore(first, secondNext);
}

function updatePieceState() {
    [...puzzleBoard.children].forEach((piece, index) => {
        piece.classList.toggle('piece--correct', 
            Number(piece.dataset.correctIndex) === index
        );
    });
}

function showSolvedAnimation() {
    // Скрываем доску с пазлом
    puzzleBoard.style.display = 'none';
    
    // Если есть анимация для этой картины, показываем видео
    if (puzzleState.currentAnimation && puzzleAnimation) {
        puzzleAnimation.src = puzzleState.currentAnimation;
        puzzleAnimation.style.display = 'block';
        puzzleAnimation.style.width = puzzleBoard.style.width;
        puzzleAnimation.style.height = puzzleBoard.style.height;
        puzzleAnimation.play().catch(e => console.log('Автовоспроизведение не удалось:', e));
    } else {
        // Если нет анимации, показываем собранную картину как раньше
        puzzleBoard.style.display = 'grid';
        puzzleBoard.classList.add('puzzle-board--solved');
        puzzleBoard.style.setProperty('--solved-image', `url("${puzzleState.currentImageSrc}")`);
    }
}

function afterMove() {
    updatePieceState();

    if (isSolvedNow()) {
        puzzleState.solved = true;
        clearSelection();
        
        showSolvedAnimation();
        
        // Обновляем статус на желтой линии
        puzzleStatus.innerHTML = '✨<span>Картина собрана</span>💫';
    }
}

function resetPuzzleDisplay() {
    // Скрываем и сбрасываем видео
    if (puzzleAnimation) {
        puzzleAnimation.style.display = 'none';
        puzzleAnimation.pause();
        puzzleAnimation.currentTime = 0;
    }
    
    // Показываем доску с пазлом
    puzzleBoard.style.display = 'grid';
    puzzleBoard.classList.remove('puzzle-board--solved');
}

function attachPieceEvents(piece) {
    piece.addEventListener('dragstart', (event) => {
        if (puzzleState.solved) {
            event.preventDefault();
            return;
        }
        puzzleState.draggedPiece = piece;
        piece.classList.add('piece--dragging');
    });

    piece.addEventListener('dragend', () => {
        piece.classList.remove('piece--dragging');
    });

    piece.addEventListener('dragover', (event) => {
        if (!puzzleState.solved) {
            event.preventDefault();
        }
    });

    piece.addEventListener('drop', (event) => {
        event.preventDefault();
        if (puzzleState.solved || !puzzleState.draggedPiece || 
            puzzleState.draggedPiece === piece) {
            return;
        }
        swapPieces(puzzleState.draggedPiece, piece);
        puzzleState.draggedPiece = null;
        afterMove();
    });

    piece.addEventListener('click', () => {
        if (puzzleState.solved) return;

        if (!puzzleState.selectedPiece) {
            puzzleState.selectedPiece = piece;
            piece.classList.add('piece--selected');
            return;
        }

        if (puzzleState.selectedPiece === piece) {
            clearSelection();
            return;
        }

        const firstPiece = puzzleState.selectedPiece;
        clearSelection();
        swapPieces(firstPiece, piece);
        afterMove();
    });
}

// Функция для подгонки размера пазла под экран (с багетом)
// Функция для подгонки размера пазла под экран (с багетом)
function fitBoardToScreen(config, aspectRatio) {
    const container = document.querySelector('.puzzle-board-container');
    const frame = document.querySelector('.puzzle-frame');
    if (!container || !frame) return;
    
    // Получаем доступные размеры контейнера
    const containerRect = container.getBoundingClientRect();
    
    // Проверяем, мобильное устройство или нет
    const isMobile = window.innerWidth <= 768;
    
    // Доступное пространство (без отступов)
    const framePadding = isMobile ? 30 : 50; // Меньше отступов на мобильных
    const availableWidth = containerRect.width - framePadding;
    const availableHeight = isMobile ? 
        (containerRect.height - framePadding) : // На мобильных используем всю высоту
        (containerRect.height - framePadding);
    
    // Рассчитываем максимально возможный размер с сохранением пропорций картины
    let boardWidth, boardHeight;
    
    // Вычисляем размеры на основе доступного пространства
    if (availableWidth / availableHeight > aspectRatio) {
        // Контейнер шире, чем нужно для картины - ограничение по высоте
        boardHeight = availableHeight;
        boardWidth = boardHeight * aspectRatio;
        
        // Проверяем, не выходит ли за ширину
        if (boardWidth > availableWidth) {
            boardWidth = availableWidth;
            boardHeight = boardWidth / aspectRatio;
        }
    } else {
        // Контейнер выше, чем нужно для картины - ограничение по ширине
        boardWidth = availableWidth;
        boardHeight = boardWidth / aspectRatio;
        
        // Проверяем, не выходит ли за высоту
        if (boardHeight > availableHeight) {
            boardHeight = availableHeight;
            boardWidth = boardHeight * aspectRatio;
        }
    }
    
    // Убеждаемся, что размеры положительные
    boardWidth = Math.max(Math.min(boardWidth, availableWidth), 100);
    boardHeight = Math.max(Math.min(boardHeight, availableHeight), 100);
    
    // На мобильных устройствах используем процентные значения для лучшей адаптации
    if (isMobile) {
        // Для мобильных лучше использовать ширину 100% и авто-высоту
        puzzleBoard.style.width = '100%';
        puzzleBoard.style.height = 'auto';
        puzzleBoard.style.aspectRatio = aspectRatio;
    } else {
        // На десктопе используем фиксированные размеры
        puzzleBoard.style.width = `${Math.floor(boardWidth)}px`;
        puzzleBoard.style.height = `${Math.floor(boardHeight)}px`;
    }
    
    // Применяем такие же размеры к видео
    if (puzzleAnimation) {
        if (isMobile) {
            puzzleAnimation.style.width = '100%';
            puzzleAnimation.style.height = 'auto';
            puzzleAnimation.style.aspectRatio = aspectRatio;
        } else {
            puzzleAnimation.style.width = `${Math.floor(boardWidth)}px`;
            puzzleAnimation.style.height = `${Math.floor(boardHeight)}px`;
        }
    }
    puzzleBoard.style.setProperty('--aspect-ratio', aspectRatio);
    
    // Показываем доску после полной настройки размеров
    puzzleBoard.classList.add('ready');
    
    // На мобильных устройствах прокручиваем к пазлу
    if (isMobile) {
        setTimeout(() => {
            puzzleBoard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

function createPuzzle(config, imageSrc, aspectRatio) {
    resetPuzzleDisplay();
    puzzleBoard.innerHTML = '';
    puzzleBoard.classList.remove('puzzle-board--solved', 'ready');
    
    // Устанавливаем CSS переменные
    puzzleBoard.style.setProperty('--cols', config.cols);
    puzzleBoard.style.setProperty('--rows', config.rows);
    puzzleBoard.style.setProperty('--aspect-ratio', aspectRatio);
    
    // Сбрасываем возможные inline стили ширины/высоты
    puzzleBoard.style.width = '';
    puzzleBoard.style.height = '';
    
    // Сбрасываем статус
    puzzleStatus.textContent = '';

    const pieces = [];

    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const piece = document.createElement('button');
            piece.type = 'button';
            piece.className = 'piece';
            piece.draggable = true;
            piece.dataset.correctIndex = String(row * config.cols + col);

            piece.style.backgroundImage = `url("${imageSrc}")`;
            piece.style.backgroundSize = `${config.cols * 100}% ${config.rows * 100}%`;
            
            // Вычисляем позицию фона
            const bgX = (col / (config.cols - 1)) * 100;
            const bgY = (row / (config.rows - 1)) * 100;
            piece.style.backgroundPosition = `${bgX}% ${bgY}%`;

            attachPieceEvents(piece);
            pieces.push(piece);
        }
    }

    // Перемешиваем, пока не получится несобранное состояние
    do {
        shuffleArray(pieces);
    } while (isSolvedOrder(pieces));

    pieces.forEach(piece => puzzleBoard.appendChild(piece));
    updatePieceState();
    
    // Вызываем fitBoardToScreen немедленно, без задержки
    fitBoardToScreen(config, aspectRatio);
}

function startPuzzle(paintingId, difficulty, paintingIndex) {
    const painting = paintings.find(p => p.id === paintingId);
    if (!painting) return;

    // Получаем оптимальную сетку на основе сложности и соотношения сторон
    const grid = getOptimalGrid(difficulty, painting.aspectRatio || 1.5);
    
    puzzleState.config = { cols: grid.cols, rows: grid.rows };
    puzzleState.solved = false;
    puzzleState.currentPaintingId = paintingId;
    puzzleState.currentPaintingIndex = paintingIndex;
    puzzleState.difficulty = difficulty;
    puzzleState.currentImageSrc = painting.image;
    puzzleState.currentAspectRatio = painting.aspectRatio || 1.5;
    puzzleState.currentAnimation = painting.animation;
    
    clearSelection();
    puzzleBoard.classList.remove('puzzle-board--solved', 'ready');
    
    // Только название картины
    puzzleModalTitle.textContent = painting.title;
    
    createPuzzle(puzzleState.config, painting.image, painting.aspectRatio || 1.5);
}

// Функция для возврата к окну с описанием
function returnToPaintingInfo() {
    puzzleModal.classList.remove('active');
    puzzleState.solved = false;
    puzzleState.selectedPiece = null;
    
    // Сбрасываем видео
    if (puzzleAnimation) {
        puzzleAnimation.style.display = 'none';
        puzzleAnimation.pause();
        puzzleAnimation.currentTime = 0;
    }
    
    // Возвращаемся к окну с описанием картины
    if (puzzleState.currentPaintingIndex !== null) {
        // Открываем модальное окно с той же картиной
        openModal(puzzleState.currentPaintingIndex);
    }
}

// Функции для галереи
function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    const promises = paintings.map((p, index) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = p.image;
            img.onload = () => {
                // Сохраняем реальное соотношение сторон
                paintings[index].aspectRatio = img.width / img.height;
                resolve({
                    index: index,
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.width / img.height
                });
            };
            img.onerror = () => {
                resolve({
                    index: index,
                    width: 300,
                    height: 350,
                    aspectRatio: 300/350
                });
            };
        });
    });

    Promise.all(promises).then((results) => {
        results.sort((a, b) => a.index - b.index);
        
        results.forEach((result) => {
            const p = paintings[result.index];
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const baseHeight = 350;
            const calculatedWidth = Math.round(baseHeight * result.aspectRatio);
            item.style.width = calculatedWidth + 'px';
            
            const img = document.createElement('img');
            img.src = p.image;
            img.alt = p.title;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/350x350?text=No+Image';
            };
            
            item.appendChild(img);
            item.addEventListener('click', () => openModal(result.index));
            gallery.appendChild(item);
        });
    });
}

function openModal(index) {
    const p = paintings[index];
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = p.image;
    modalImage.onerror = function() {
        this.src = 'https://via.placeholder.com/800x600?text=No+Image';
    };
    
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalAuthor').textContent = p.author;
    document.getElementById('modalDetails').innerHTML = `<h3>Детали</h3><p>${p.details}</p>`;
    document.getElementById('modalMeaning').innerHTML = `<h3>Смысл картины</h3><p>${p.meaning}</p>`;
    modal.style.display = 'flex';
    
    // Сохраняем ID и индекс текущей картины
    puzzleState.currentPaintingId = p.id;
    puzzleState.currentPaintingIndex = index;
    
    // Скрываем меню сложности при открытии нового модального окна
    document.getElementById('difficultyMenu').style.display = 'none';
    
    // Убираем активный класс у кнопок сложности
    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
    
    // Прокручиваем модальное окно вверх
    setTimeout(() => {
        document.querySelector('.modal-content').scrollTop = 0;
    }, 100);
}

// Инициализация обработчиков событий
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для модального окна с информацией
    document.getElementById('closeModal').addEventListener('click', function() {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    // Обработчик для кнопки пазла
    document.getElementById('puzzleBtn').addEventListener('click', function() {
        const menu = document.getElementById('difficultyMenu');
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    });

    // Обработчики для кнопок сложности
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const difficulty = this.getAttribute('data-difficulty');
            const paintingId = puzzleState.currentPaintingId;
            const paintingIndex = puzzleState.currentPaintingIndex;
            
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Закрываем информационное модальное окно
            modal.style.display = 'none';
            
            // Открываем модальное окно пазла
            puzzleModal.classList.add('active');
            
            // Запускаем пазл
            startPuzzle(paintingId, difficulty, paintingIndex);
        });
    });

    // Обработчик для кнопки закрытия пазла (стрелка)
    closePuzzleModal.addEventListener('click', function() {
        returnToPaintingInfo();
    });

    // Закрытие по клику на фон
    puzzleModal.addEventListener('click', function(e) {
        if (e.target === this) {
            returnToPaintingInfo();
        }
    });

    // Обработка ресайза окна
    window.addEventListener('resize', function() {
        if (puzzleModal.classList.contains('active') && puzzleState.config) {
            clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(() => {
                fitBoardToScreen(puzzleState.config, puzzleState.currentAspectRatio);
                
                // Обновляем размер видео при ресайзе
                if (puzzleAnimation && puzzleAnimation.style.display === 'block') {
                    const container = document.querySelector('.puzzle-board-container');
                    if (container) {
                        puzzleAnimation.style.width = puzzleBoard.style.width;
                        puzzleAnimation.style.height = puzzleBoard.style.height;
                    }
                }
            }, 150);
        }
    });

    window.addEventListener('orientationchange', function() {
        if (puzzleModal.classList.contains('active') && puzzleState.config) {
            setTimeout(() => {
                fitBoardToScreen(puzzleState.config, puzzleState.currentAspectRatio);
            }, 100);
        }
    });

    // Обработчик для выхода
    const exitTrigger = document.getElementById('exitTrigger');
    const EXIT_CODE = '1234';

    exitTrigger.addEventListener('click', function() {
        const code = prompt('Введите код для выхода:');
        if (code === EXIT_CODE) {
            window.location.href = 'index.html';
        } else if (code !== null) {
            alert('Неверный код');
        }
    });

    // Инициализация галереи
    renderGallery();
    
    // Обновление галереи при ресайзе
    window.addEventListener('resize', renderGallery);
});