# Funciones del Juego de Tetris

## `createBoard()`
Esta función crea el tablero del juego

- Se define `board` como una matriz de `BOARD_HEIGHT` filas y `BOARD_WIDTH` columnas
- Se rellena toda la matriz con `EMPTY` (0), lo que indica que inicialmente todas las celdas están vacías
- Finalmente, se llama a `updateBoardView()` para actualizar la vista del tablero en la interfaz

**Implementación interna:**  
Se utiliza `Array(BOARD_HEIGHT).fill()` para crear un array con `BOARD_HEIGHT` elementos. Como `.fill()` reutiliza la misma referencia, se usa `.map(() => Array(BOARD_WIDTH).fill(EMPTY))` para asegurar que cada fila sea un array independiente

## `createPiece()`
Genera una nueva pieza aleatoria y la coloca en la parte superior del tablero

- Obtiene un array con los nombres de las piezas (`I`, `L`, `J`, etc)
- Selecciona una al azar usando `Math.random() * pieces.length`
- Crea un objeto `currentPiece` con la forma (`SHAPES[piece]`) y el color (`COLORS[piece]`)
- Posiciona la pieza en el centro horizontal (`x = (ancho del tablero - ancho de la pieza) / 2`) y arriba (`y = 0`)
- Si la nueva pieza no tiene un movimiento válido (`isValidMove()` retorna `false`), el juego termina (`gameOver = true`) y se detiene el intervalo (`clearInterval(gameInterval)`)

## `isValidMove(x, y)`
Verifica si la pieza puede moverse a una nueva posición sin salirse del tablero o chocar con otra pieza

- Recorre cada celda de la forma actual de la pieza (`currentPiece.shape`)
- Calcula las coordenadas `newX` y `newY` en el tablero sumando `x` y `y` a la posición de la celda dentro de la pieza
- Verifica:
  - Que no se salga del tablero (`newX` entre `0` y `BOARD_WIDTH`, `newY < BOARD_HEIGHT`)
  - Que no choque con otra pieza (`board[newY][newX] !== EMPTY`)

## `mergePiece()`
Fija la pieza actual en el tablero cuando ya no puede moverse más

- Recorre la forma de la pieza (`currentPiece.shape`)
- Obtiene su posición absoluta (`newX` y `newY`)
- Si la celda está dentro del tablero (`newY >= 0`), la añade al `board`, cambiando el valor de `EMPTY` a `currentPiece.color`

## `clearLines()`
Elimina filas completas y suma puntos

- Empieza a recorrer el tablero desde abajo (`BOARD_HEIGHT - 1`)
- Verifica si una fila está completamente llena (`board[row].every(cell => cell !== EMPTY)`)
- Si está llena:
  - Elimina esa fila con `board.splice(row, 1)`
  - Añade una nueva fila vacía al principio (`board.unshift(Array(BOARD_WIDTH).fill(EMPTY))`)
  - Suma 100 puntos y actualiza la puntuación en pantalla

## `updateBoardView()`
Actualiza la interfaz gráfica del tablero

- Limpia el tablero en el HTML (`boardElement.innerHTML = ''`)
- Crea una copia temporal del `board` para dibujar la pieza sin modificar el estado real
- Si hay una `currentPiece`, la coloca en la copia del `board`
- Recorre el tablero y crea `div` para cada celda, aplicándole el color si está ocupada

## `moveDown()`
Mueve la pieza una posición hacia abajo

- Si `isValidMove(x, y + 1)`, aumenta `y` y actualiza la vista
- Si no puede bajar más:
  - Fija la pieza en el tablero (`mergePiece()`)
  - Elimina líneas completas (`clearLines()`)
  - Genera una nueva pieza (`createPiece()`)

## `moveLeft()` y `moveRight()`
Mueven la pieza lateralmente

- Para izquierda: si `isValidMove(x - 1, y)`, reduce `x`
- Para derecha: si `isValidMove(x + 1, y)`, aumenta `x`
- Actualizan la vista llamando a `updateBoardView()`

## `rotatePiece()`
Rota la pieza 90 grados en sentido horario

- Usa `map()` y `reverse()` para rotar la matriz que representa la forma
- Guarda la forma original en `originalShape`
- Intenta asignar la forma rotada a `currentPiece.shape`
- Si el movimiento no es válido, restaura la forma original

## `handleKeyPress(event)`
Gestiona las teclas de dirección

- Si el juego terminó (`gameOver`), ignora las teclas
- Según la tecla:
  - `ArrowLeft`: mueve a la izquierda
  - `ArrowRight`: mueve a la derecha
  - `ArrowDown`: acelera la caída
  - `ArrowUp`: rota la pieza

## `startGame()`
Inicia o reinicia el juego

- Si hay un juego activo (`gameInterval`), lo detiene y comienza uno nuevo