const ROWS = 3;
const COLS = 3;
const NUM_ACTIONS = ROWS*COLS;
/* This class Game creates a new game. It's methods involve getters and setters for the board, strategy, regretSum, Strategy */
const GameMap = new Map();

class gameNode {
  constructor() {
    this.infoset = "";
    this.strategy = [[0,0,0],[0,0,0],[0,0,0]];
    this.regretSum =[[0,0,0],[0,0,0],[0,0,0]];
    this.strategySum =[[0,0,0],[0,0,0],[0,0,0]];
  }

  /*This function takes in a game(state) and returns the strategy profile for 'this' game */
  getStrategy(realizationWeight,grid){
    let actions = getActions(grid);
    let num_actions = actions.length;

    let normalizingSum = 0;

    for(let i=0; i< num_actions; i++){
      let a = actions[i];

      if(this.regretSum[a]>0) this.strategy[a] = this.regretSum[a];
      else this.strategy[a] = 0;

      normalizingSum += this.strategy[a];
    }

    for(let i = 0; i < num_actions; i++){
      let a = actions[i];
      if (normalizingSum > 0) this.strategy[a] /= normalizingSum;
      else this.strategy[a] = 1.0/num_actions;
      
      this.strategySum[a]+= realizationWeight * this.strategy[a];
    }
      
    return this.strategy; 
  }

  getAverageStrategy(){
    let avgStrategy = [0,0,0,0,0,0,0,0,0];
    let normalizingSum = 0;

    for(let i=0 ; i < NUM_ACTIONS; i++){
      normalizingSum += this.strategySum[i];
    }

    for(let i=0; i< NUM_ACTIONS; i++){
      //if cell is full skip
      if(normalizingSum>0){
        avgStrategy[i] = (this.strategySum[i]/normalizingSum).toFixed(2);
      }
      else{
        avgStrategy[i] = (1.0/num_actions).toFixed(2);
      }

    }

    return avgStrategy;

  }

};

function  getActions(grid) {
    let actions = [];
    for (let i = 0; i < grid.length; i++) {
      if(grid[i]==0) actions.push(i);
    }
    return actions;
}
function isPlayerWinner(grid,player){
  let winner =hasWinner(grid);
  if(winner == 0) return 0;
  if(winner == 1 && player == 0) return 1;
  if(winner ==-1 && player == 1) return 1;
  return -1;
}
/*this function takes in a game and determines if its board has a winning hand. it returns the player code (-1 or 1) if there is a winner 0 if there is no winner*/
function hasWinner(grid){
  let sum;

  for(let i=0; i<ROWS;i++){
    sum = grid[i*3]+grid[i*3+1]+grid[i*3+2];
    if(sum==3 || sum==-3) return sum/3;
  }
  for(let j=0; j<COLS;j++){
    sum = grid[j]+grid[j+3]+grid[j+6];
    if(sum==3 || sum==-3) return sum/3;
  }

  sum = grid[0]+grid[4]+grid[8];
  if(sum==3 || sum ==-3) return sum/3;

  sum = grid[2]+grid[4]+grid[6];
  if(sum == 3 || sum == -3) return sum/3;
  

  return 0;
} 
function isFull(grid){
  for(let i=0;i<grid.length;i++){
    if (grid[i]==0) return false;
  }
  return true;
}

function getGridString(grid){
  let hash = "";
  for(let i =0;i<grid.length;i++){
    if (grid[i]==1) hash+="x";
    else if(grid[i]==-1) hash+="o";
    else hash+="-";
  }
  return hash;
}

/*calcCounterfactualRegret is a recursive function which calcu */
function calcCounterfactualRegret(grid, history, p0, p1) {
  plays = history.length;
  currentPlayer = plays % 2; 
  //console.log("currentPlayer:", currentPlayer);

  //return payoff for terminal games states
  
  if(plays>3){
    let winner = isPlayerWinner(grid,currentPlayer);//someone wins
    if (winner!=0){
      //console.log("hello");
      // let nodesPerLevel = 362880/factorial(9-plays);
      // renderNode(plays,nodesPerLevel);
      return winner;
    }
    if (isFull(grid)) {
      // let nodesPerLevel = 362880/factorial(9-plays);
      // renderNode(plays,nodesPerLevel);
      return 0;
    } //is a winner, return 1 or 0
  }

  //identify the playerSymbol
  let playerSymbol = "";
  if(currentPlayer == 0) playerSymbol = "x";
  else playerSymbol = "o";

  //identify infoset
  let infoset = playerSymbol+" : "+ getGridString(grid);
  console.log("infoset: ", infoset,"history: ", history);

  //get (this?) game node or create it if it does not exist
  let game_exists = infoset in GameMap;
  let game_node = null;
  if(!game_exists){
    game_node = new gameNode();
    game_node.infoset = infoset;
    GameMap[infoset] = game_node; 
  }
  else{
    game_node= GameMap[infoset];
  }
  let nodesPerLevel = (362880/factorial(9-plays));
  // console.log("nodesPerLevel[",plays,"]: ", nodesPerLevel);
  renderNode(plays+1,nodesPerLevel);

  //for each action, recursively call cfr with additional history and probibility
  let param=p0;
  if(currentPlayer==1) param = p1;
  
  //console.log("new game strategy", newGame.getStrategy(param));
  let strategy = game_node.getStrategy(param,grid); //get positive regrets at this information set
  let actions = getActions(grid);
  let util = [[0,0,0],[0,0,0],[0,0,0]];
  //console.log("actions: ", actions);
  //console.log("grid: ", grid);
  let gameUtil = 0;
  for(let i=0 ; i < actions.length; i++){
    let newgrid = grid.slice();
    if(currentPlayer == 0) {
      newgrid[actions[i]] = 1;
    }
    else {
      newgrid[actions[i]] = -1;
      //console.log("current player is not 0, hopefully 1")
    }
    
    let nextHistory = history + playerSymbol;
    
    if(currentPlayer==0) util[actions[i]] = -calcCounterfactualRegret(newgrid, nextHistory, p0*strategy[actions[i]], p1); 
    else util[actions[i]] = -calcCounterfactualRegret(newgrid, nextHistory, p0, p1*strategy[actions[i]]);
    
    
    gameUtil += strategy[actions[i]] * util[actions[i]];
    
  }

  // for each action, compute and accumulate counterfactual regret
  for(let i=0 ; i < actions.length; i++){

    let regret = util[actions[i]]- gameUtil;
    
    if(currentPlayer==0) game_node.regretSum[actions[i]] += p1 * regret;
    else game_node.regretSum[actions[i]] += p0 * regret;
  }
  
  // let nodesPerLevel = 362880/factorial(9-plays);
  // renderNode(plays,nodesPerLevel);
  return gameUtil;

}

//train function takes in iterations and 
function train(iterations){
  console.log("train started")
  let gameBoard = [0,0,0,0,0,0,0,0,0];
  //console.log("game seeded.");
  //console.log("gameseed.board: ", gameSeed.board[1] );
  let util;
  for(let i = 0; i<iterations;i++){
    util += calcCounterfactualRegret(gameBoard,"",1,1);
  }
  console.log("training end.")
}

/**
 * Takes in integer level and integer n, renders a node inside GameMap at position in GameMap
* @param l: describes which level in GameMap the node is to be placed.
*@param n: the number of nodes in level, l
*/
function renderNode(l,n){
  //create element
  let animationContainer = document.getElementById("gameMapOne");
  let element = document.createElement('div');
  element.classList = "node";
  animationContainer.appendChild(element);
  //append 
  let lstring = ((l*10)).toString()+"%";
  element.style.left = lstring;
  let nstring = ((1/n)*100).toPrecision(10).toString()+"%"
  element.style.top = nstring;
  console.log("level:", l);
  
  }

function factorial(n){
  //base case
  if(n == 0 || n == 1){
      return 1;
  //recursive case
  }else{
      return n * factorial(n-1);
  }
}

//MAIN METHOD
trainbttn=document.getElementById('trainbttn');
trainbttn.onclick= function(){
  let placeHolder = document.getElementById("placeHolder");//remove placeholder
  placeHolder.innerHTML="Wait for training <30sec";
  train(1); //train and fill out GameMap;

  //renderNode(0,1);
  
}
// train(1);

