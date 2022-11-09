let tictactoe = {};

function create() {
  //Initializes variables and grid
  tictactoe.turn = 0;
  tictactoe.grid = [[0,0,0],
                    [0,0,0],
                    [0,0,0]];
  tictactoe.h_line1 = this.add.rectangle(150,100,300,5,0x000000);
  tictactoe.h_line2 = this.add.rectangle(150,200,300,5,0x000000);
  tictactoe.v_line1 = this.add.rectangle(100,150,5,300,0x000000);
  tictactoe.v_line2 = this.add.rectangle(200,150,5,300,0x000000);
  tictactoe.shapes = this.add.group();
  //Adds X or O when clicked
  this.input.on('pointerup', function(pointer) {
    const x = roundNum(pointer.x);
    const y = roundNum(pointer.y);
    const i = Math.round(x/100);
    const j = Math.round(y/100);
    if (tictactoe.grid[i][j] == 0) {
      if (tictactoe.turn % 2 == 0) {
        const temp = generateX(this,x + 50,y + 50);
        for (let i = 0; i < 2; i++) {
          tictactoe.shapes.add(temp[i]);
        }
        tictactoe.grid[i][j] = 1;
      } else {
        tictactoe.shapes.add(generateO(this,x + 50,y + 50));
        tictactoe.grid[i][j] = 2;
      }
      tictactoe.turn += 1;
    }
    if (tictactoe.turn < 9) {
      const outcome = checkWin(tictactoe.grid);
      if (outcome == 1) {
        console.log(tictactoe.grid);
        alert("Player 1 wins!");
        reset();
      } else if (outcome == 2) {
        console.log(tictactoe.grid);
        alert("Player 2 wins!");
        reset();
      }
    } else {
      reset();
      alert("It was a draw!");
    }
  }, this);
}

const config = {
  type: Phaser.AUTO,
  height: 300,
  width: 300,
  backgroundColor: 0xFFFFFF,
  scene: {
    create
  }
};

const game = new Phaser.Game(config);

function checkWin(grid) {
  //Check for diagonals win
  if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) {
    return grid[0][0];
  }
  if (grid[2][0] == grid[1][1] && grid[1][1] == grid[0][2]) {
    return grid[2][0];
  }
  //Check for vertical wins
  for (let j = 0; j < 3; j++) {
    if (grid[0][j] == grid[1][j] && grid[1][j] == grid[2][j]) {
      return grid[0][j];
    }
  }
  //Check for horizontal wins
  for (let i = 0; i < 3; i++) {
    if (grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]) {
      return grid[i][0];
    }
  }
  return 0;
}

function generateX(scene,x,y) {
  return [scene.add.rectangle(x,y,75,5,0xFF0000).setAngle(45), scene.add.rectangle(x,y,75,5,0xFF0000).setAngle(-45)];
}

function generateO(scene,x,y) {
  return scene.add.circle(x,y,30).setStrokeStyle(5,0x0000FF);
}

function roundNum(num) {
  return Math.round((num - 50)/100)*100;
}

function reset() {
  tictactoe.shapes.clear(true, true);
  tictactoe.turn = 0;
  tictactoe.grid = [[0,0,0],
                    [0,0,0],
                    [0,0,0]];
}