const ROWS = 3;
const COLS = 3;
/* This class Game creates a new game. It's methods involve getters and setters for the board, strategy, regretSum, Strategy */
const GameMap = new Map();

class Game {
  constructor() {
    this.infoset = "";
    this.strategy = [[0,0,0],[0,0,0],[0,0,0]];
    console.log("this.strategy: ", this.strategy)
    this.regretSum =[[0,0,0],[0,0,0],[0,0,0]];
    this.strategySum =[[0,0,0],[0,0,0],[0,0,0]];
    this.board = [[4,0,4],[0,0,0],[0,0,0]]; //shouldbe all zeros
    console.log("this.board: ", this.board);

  }
  /*This function takes in a game(state) and returns the strategy profile for 'this' game */
  getStrategy(realizationWeight){
    let num_actions = this.getActions().length;
    console.log("number of actions: ", num_actions)
    let normalizingSum = 0;

    for(let i=0; i< ROWS*COLS; i++){
      if(this.board[Math.floor(i/3)][i%3]!=0){
        //this.strategy[Math.floor(i/3)][i%3]=0;
        continue;
      }

      if(this.regretSum[Math.floor(i/3)][i%3]>0){
        this.strategy[Math.floor(i/3)][i%3] = this.regretSum[Math.floor(i/3)][i%3];
      }
      else{
        this.strategy[Math.floor((i)/3)][(i)%3] = 0;
      }

      normalizingSum += this.strategy[Math.floor((i)/3)][(i)%3];
    }

    for(let i = 0; i < ROWS*COLS; i++){
      if(this.board[Math.floor(i/3)][(i)%3]!=0){
        continue;
      }
      if (normalizingSum > 0){
        this.strategy[Math.floor(i/3)][(i)%3] /= normalizingSum;
      }
      else{
        this.strategy[Math.floor(i/3)][i%3] = 1.0/num_actions
        
      }
      this.strategySum[Math.floor(i/3)][i%3]+= realizationWeight * this.strategy[Math.floor(i/3)][i%3];
    }
      console.log("strategy: ", this.strategy);
      return this.strategy; 
  }

  getAverageStrategy(){
    let avgStrategy = [[0,0,0],[0,0,0],[0,0,0]];
    let normalizingSum = 0;
    let num_actions = this.getActions().length;

    for(let i=0 ; i < ROWS*COLS; i++){
      //if cell if full skip
      if(this.board[Math.floor(i/3)][(i)%3]!=0){
        continue;
      }
      
      normalizingSum += this.strategySum[Math.floor(i/3)][(i)%3];
    }

    for(let i=0; i< ROWS*COLS; i++){
      //if cell is full skip
      if(this.board[Math.floor(i/3)][(i)%3]!=0){
        continue;
      }

      if(normalizingSum>0){
        avgStrategy[Math.floor(i/3)][i%3] = (this.strategySum[Math.floor(i/3)][i%3]/normalizingSum).toFixed(2);
      }
      else{
        avgStrategy[Math.floor((i)/3)][(i)%3] = (1.0/num_actions).toFixed(2);
      }

    }

    console.log("aveStrategy: ", avgStrategy)
    return avgStrategy;

  }

  /*This function takes in a game(state) and return an array of possible actions*/
  getActions() {
    const actions = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (this.getBoardCell(i,j) == 0) {
          actions.push(3*i+j);
        }
      }
    }
    return actions;

  }

  getBoardStr(){
    console.log("getBoardStr()", this.board)
    return this.board.toString();
  }
  
  getBoardCell(row,col){
    return this.board[row][col];
  }

  getProbability(row,col){
    return this.strategy[row][col];
  }
  enterTurn(row, col, val){
    this.board[row][col]=val;
  }
  
}
function isPlayerWinner(game,player){
  let winner =gameIsWinner(game);
  if(winner == 0) return 0;
  if(winner == 1 && player == 0) return 1;
  if(winner ==-1 && player == 1) return 1;
  return -1;
}
/*this function takes in a game and determines if its board has a winning hand. it returns the player code (-1 or 1) if there is a winner 0 if there is no winner*/
function gameIsWinner(game){
  let sum;

  for(let i=0; i<ROWS;i++){
    sum = game.getBoardCell(0,i)+game.getBoardCell(1,i)+game.getBoardCell(2,i)
    if(sum==3 || sum==-3){
    }
  }
  for(let j=0; j<COLS;j++){
    sum = game.getBoardCell(j,0)+game.getBoardCell(j,1)+game.getBoardCell(j,2);
    if(sum==3 || sum==-3){
      return sum/3;
    }
  }

  sum = game.getBoardCell(0,0) + game.getBoardCell(1,1) + game.getBoardCell(2,2)
  if(sum == 3 || sum == -3){
    return sum/3;
  }

  sum = game.getBoardCell(0,2) + game.getBoardCell(1,1) + game.getBoardCell(2,0)
  if(sum == 3 || sum == -3){
    return sum/3;
  }

  return 0;
}

/*This function put the strategy on the cells*/
function displayStrategy(game){
  for(let i=0;i<ROWS;i++){
    for(let j=0; j<COLS;j++){
      let cellstr = "cell" + (3*i+j+1).toString();
      let cell=document.getElementById(cellstr);
      let num = Number.parseFloat(game.getProbability(i,j)).toFixed(2);
      cell.textContent= num.toString();
    }
  }
}

/*calcCounterfactualRegret is a recursive function which calcu */
function calcCounterfactualRegret(game, history, p0, p1) {

  plays = history.length;
  currentPlayer = plays % 2; console.log("currentPlayer:", currentPlayer);

  //return payoff for terminal games states
  if(plays>9) return 0; //draw

  let winner = isPlayerWinner(game,currentPlayer); //someone wins
  if(plays>3){
    if (winner!=0){
      return winner;
    }   //is a winner, return 1 or 0
  }

  //identify the infoset
  let playerSymbol = "";
  if(currentPlayer == 0){
    playerSymbol = "x";
  }
  else{
    playerSymbol = "o";
  }

  //identify infoset
  let infoset = playerSymbol+" : "+ game.getBoardStr();
  console.log("infoset: ", infoset,"history: ", history);
  
  //get (this?) game node or create it if it does not exist
  let game_exists = infoset in GameMap;
  let newGame = null;
  if(!game_exists){
    newGame = new Game();
    newGame.board=game.board;
    newGame.infoset = infoset;
    GameMap[infoset] = newGame; 
  }
  else{
    newGame= GameMap[infoset];
  }
  //for each action, recursively call cfr with additional history and probibility
  let param=p0;
  if(currentPlayer==1) param = p1;
  
  //console.log("new game strategy", newGame.getStrategy(param));
  let strategy = newGame.getStrategy(param); //get positive regrets at this information set
  // let actions = newGame.getActions();
  let util = [[0,0,0],[0,0,0],[0,0,0]];
  
  let gameUtil = 0;
  for(let i=0 ; i < ROWS*COLS; i++){
    //if cell if full skip
    if(newGame.getBoardCell(Math.floor(i/3),i%3) != 0) continue;
    
    console.log("game.board before copy to newGame.board:", game.board)
    newGame.board = game.board;
    console.log("game zero: ", game.board)
    console.log("board1: ", newGame.board);
    if(currentPlayer == 0) newGame.enterTurn(Math.floor(i/3),i%3,1);
    else newGame.enterTurn(Math.floor(i/3),i%3,-1);

    console.log("board2: ", newGame.board);

    let nextHistory = history + playerSymbol;
    if(currentPlayer==0) util[Math.floor(i/3)][i%3] = -calcCounterfactualRegret(newGame, nextHistory, p0*strategy[Math.floor(i/3)][i%3], p1);
    else util[Math.floor(i/3)][i%3] = -calcCounterfactualRegret(newGame, nextHistory, p0, p1*strategy[Math.floor(i/3)][i%3]);

    gameUtil += strategy[Math.floor(i/3)][i%3] * util[Math.floor(i/3)][i%3];
  }



  // for each action, compute and accumulate counterfactual regret
  for(let i=0 ; i < ROWS*COLS; i++){
    //if cell if full skip
    if(newGame.getBoardCell(Math.floor(i/3),(i)%3)!=0) continue;

    let regret = util[Math.floor(i/3)][(i)%3]- gameUtil;

    let oppPlayer = p1;
    if(currentPlayer==1) oppPlayer = p0;

    newGame.regretSum[Math.floor(i/3)][(i)%3] += oppPlayer*regret;
  }
 
  return gameUtil;

};

//train function takes in iterations and 
function train(iterations){
  console.log("train started")
  let gameSeed = new Game();
  //console.log("gameseed gameboard: ", gameSeed.board);
  let util =0;
  for(let i = 0; i<iterations;i++){
    util += calcCounterfactualRegret(gameSeed,"",1,1);
  }
  console.log("training end.")
}



//MAIN METHOD
trainbttn=document.getElementById('trainbttn');
trainbttn.onclick= function(){
  train(1);
}
// train(1);
