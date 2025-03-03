        const BOARD_WIDTH = 10;
        const BOARD_HEIGHT = 20;
        const EMPTY = 0;
        
        //formas que hay dentro del tetris
        const SHAPES = {
            I: [
                [1, 1, 1, 1]
            ],
            L: [
                [1, 0],
                [1, 0],
                [1, 1]
            ],
            J: [
                [0, 1],
                [0, 1],
                [1, 1]
            ],
            O: [
                [1, 1],
                [1, 1]
            ],
            Z: [
                [1, 1, 0],
                [0, 1, 1]
            ],
            S: [
                [0, 1, 1],
                [1, 1, 0]
            ],
            T: [
                [1, 1, 1],
                [0, 1, 0]
            ]
        };


        //asignarle primero el color necesario a cada ficha
        const COLORS = {
            I: 'cyan',
            L: 'orange',
            J: 'blue',
            O: 'yellow',
            Z: 'red',
            S: 'green',
            T: 'purple'
        };


//INICIALIZACION DE TODAS LAS VARIABLES

        //creacion del tablero
        let board = [];
        //pieza actual en pantalla
        let currentPiece = null;
        //posicion de la pieza en el tablero
        let currentPiecePosition = {x: 0, y: 0};
        //puntuacion
        let score = 0;
        //variable de control para detener la ejecucion
        let gameInterval = null;
        let gameOver = false;


        //Funcion creamos el tablero con las constantes de arriba
        function createBoard() {
            //se genera un array de dos dimensiones(matriz) inicializando todos los valores en 0
            board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(EMPTY));
            updateBoardView();
        }


        //Funcion creamos la pieza
        function createPiece() {
            const pieces = Object.keys(SHAPES);//objeto iterable el cual permite elegir una de las fichas
            
            const piece = pieces[Math.floor(Math.random() * pieces.length)];
            //random de las piezas para elegir la pieza que saldra

            //OBJETO CREADO de la pieza, el objeto consta de de forma(piece) y color (asignado arriba en un m)
            currentPiece = {
                shape: SHAPES[piece],
                color: COLORS[piece]
            };

            //Posicion ACTUAL de donde esta la pieza la x sera en medio siempre del tablero y la y en 0
            currentPiecePosition = {
                x: Math.floor((BOARD_WIDTH - currentPiece.shape[0].length) / 2),
                y: 0
            };
            //Si el movimiento es no valido (definimos justo despues que es esta funcion booleana) la variable de control game over se activa
            if (!isValidMove(currentPiecePosition.x, currentPiecePosition.y)) {
                gameOver = true;
                //define que la variable gameInterval ha terminado y no se generan mas piezas
                clearInterval(gameInterval);
                alert('Game Over! Score: ' + score);
            }
        }

        //COMPROBACION SI LA PIEZA SE MUEVE VALIDA parametros (posicion x & posicion y)
        function isValidMove(x, y) {
            for (let row = 0; row < currentPiece.shape.length; row++) {//lo que ocupa de filas tu pieza lo recorre
                for (let col = 0; col < currentPiece.shape[row].length; col++) {//Y por cada fila las columnas que hay
                    if (currentPiece.shape[row][col]) {//si justamente la pieza
                        const newX = x + col;
                        const newY = y + row;
                        
                        if (newX < 0 || newX >= BOARD_WIDTH || 
                            newY >= BOARD_HEIGHT ||
                            (newY >= 0 && board[newY][newX] !== EMPTY)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        //unir piezas
        function mergePiece() {
            for (let row = 0; row < currentPiece.shape.length; row++) {
                for (let col = 0; col < currentPiece.shape[row].length; col++) {
                    if (currentPiece.shape[row][col]) {
                        const newY = currentPiecePosition.y + row;
                        const newX = currentPiecePosition.x + col;
                        if (newY >= 0) {
                            board[newY][newX] = currentPiece.color;
                        }
                    }
                }
            }
        }

        function clearLines() {
            for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
                if (board[row].every(cell => cell !== EMPTY)) {
                    board.splice(row, 1);
                    board.unshift(Array(BOARD_WIDTH).fill(EMPTY));
                    score += 100;
                    document.getElementById('score').textContent = score;
                }
            }
        }

        function updateBoardView() {
            const boardElement = document.getElementById('board');
            boardElement.innerHTML = '';
            
            // Crear una copia temporal del tablero
            let displayBoard = board.map(row => [...row]);
            
            // Añadir la pieza actual al tablero temporal
            if (currentPiece) {
                for (let row = 0; row < currentPiece.shape.length; row++) {
                    for (let col = 0; col < currentPiece.shape[row].length; col++) {
                        if (currentPiece.shape[row][col]) {
                            const y = currentPiecePosition.y + row;
                            const x = currentPiecePosition.x + col;
                            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                                displayBoard[y][x] = currentPiece.color;
                            }
                        }
                    }
                }
            }
            
            // Renderizar el tablero
            displayBoard.forEach(row => {
                row.forEach(cell => {
                    const cellElement = document.createElement('div');
                    cellElement.className = 'cell';
                    if (cell !== EMPTY) {
                        cellElement.style.backgroundColor = cell;
                    }
                    boardElement.appendChild(cellElement);
                });
            });
        }

        function moveDown() {
            if (isValidMove(currentPiecePosition.x, currentPiecePosition.y + 1)) {
                currentPiecePosition.y++;
                updateBoardView();
            } else {
                mergePiece();
                clearLines();
                createPiece();
                updateBoardView();
            }
        }

        function moveLeft() {
            if (isValidMove(currentPiecePosition.x - 1, currentPiecePosition.y)) {
                currentPiecePosition.x--;
                updateBoardView();
            }
        }

        function moveRight() {
            if (isValidMove(currentPiecePosition.x + 1, currentPiecePosition.y)) {
                currentPiecePosition.x++;
                updateBoardView();
            }
        }

        function rotatePiece() {
            const rotated = currentPiece.shape[0].map((_, i) =>
                currentPiece.shape.map(row => row[i]).reverse()
            );
            
            const originalShape = currentPiece.shape;
            currentPiece.shape = rotated;
            
            if (!isValidMove(currentPiecePosition.x, currentPiecePosition.y)) {
                currentPiece.shape = originalShape;
            } else {
                updateBoardView();
            }
        }

        function handleKeyPress(event) {
            if (gameOver) return;
            
            switch(event.key) {
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'ArrowRight':
                    moveRight();
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
                case 'ArrowUp':
                    rotatePiece();
                    break;
            }
        }

        function startGame() {
            // Limpiar juego anterior si existe
            if (gameInterval) {
                clearInterval(gameInterval);
            }
            
            // Reiniciar variables
            score = 0;
            gameOver = false;
            document.getElementById('score').textContent = '0';
            
            // Inicializar juego
            createBoard();
            createPiece();
            
            // Configurar controles
            document.removeEventListener('keydown', handleKeyPress);
            document.addEventListener('keydown', handleKeyPress);
            
            // Iniciar loop del juego
            gameInterval = setInterval(() => {
                if (!gameOver) {
                    moveDown();
                }
            }, 1000);
        }
 
const start = document.getElementById("start")

start.addEventListener("click",startGame)