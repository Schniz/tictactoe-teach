(function() {
  var Board = function() {
    this.player = 1;
    this._board = [0,0,0,0,0,0,0,0,0];
  };

  Board.prototype._newTurn = function() {
    var emptyCells = this._board.filter(function(cell) {
      return cell === 0;
    }).length;

    if (emptyCells === 0) {
      this.finishGame({ status: 'tie', player: 'no one' });
    } else {
      this.player = this.player % 2 + 1; // 1 or 2
    }
  };

  Board.prototype.draw = function(x, y) {
    // Don't do the move if there is already something there.
    if (this.getCell(x, y)) return;

    // Do the move.
    this._board[this._xyToOne(x,y)] = this.player;

    // If this player is the winner, finish the game
    if (this.isWinner(this.player)) {
      this.finishGame({ status: 'win', player: this.player });
    } else {
      this._newTurn();
    }
  };

  Board.prototype.finishGame = function(data) {
    setTimeout(function() {
      alert("The game has ended with a " + data.status + ". " + data.player + " is the winner.");
      $("#restart").trigger('click');
    });
  };

  Board.prototype._xyToOne = function(x, y) {
    return 3*(y-1) + (x-1);
  };

  Board.prototype.getCell = function(x, y) {
    return this._board[this._xyToOne(x,y)];
  };

  Board.prototype.getMatrix = function() {
    var matrix = [];
    for (var y = 1; y <= 3; y++) {
      var matrixRow = [];
      for (var x = 1; x <= 3; x++) {
        matrixRow.push(this.getCell(x, y));
      }
      matrix.push(matrixRow);
    }
    return matrix;
  };

  Board.prototype.isWinner = function(player) {
    var cell = this.getCell.bind(this);
    var oneWillWin = [
      [ cell(1,1), cell(1,2), cell(1,3) ],
      [ cell(2,1), cell(2,2), cell(2,3) ],
      [ cell(3,1), cell(3,2), cell(3,3) ],
      [ cell(1,1), cell(2,1), cell(3,1) ],
      [ cell(1,2), cell(2,2), cell(3,2) ],
      [ cell(1,3), cell(2,3), cell(3,3) ],
      [ cell(1,1), cell(2,2), cell(3,3) ],
      [ cell(1,3), cell(2,2), cell(3,1) ]
    ];

    return oneWillWin.some(function(set) {
      return set.every(function(move) {
        return move === player;
      });
    });
  };

  var numberToPlayer = function(number) {
    if (number === 0) return '#';
    if (number === 1) return 'X';
    return 'O';
  };

  var redraw = function() {
    var boardMatrix = window.board.getMatrix();
    var elements = boardMatrix.map(function(rowData, rowIndex) {
      var cellElements = rowData.map(function(cellData, cellIndex) {
        return $("<td />").addClass("tictactoe").data('position', { y: rowIndex + 1, x: cellIndex + 1 }).text(numberToPlayer(cellData));
      });
      
      return $("<tr />").append(cellElements);
    });
    $("#game").html('');
    $("#game").append(elements);
    $("#player").text(numberToPlayer(window.board.player));
  };

  $("#restart").click(function(e) {
    e.preventDefault();
    window.board = new Board();
    redraw();
  }).trigger('click');

  $(document).on('click', '.tictactoe', function(e) {
    var position = $(this).data('position');
    window.board.draw(position.x, position.y);
    redraw();
  });
})(window);
