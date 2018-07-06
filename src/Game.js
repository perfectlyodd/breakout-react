import React, { Component } from 'react';
import logo from './logo.svg';
import listenForOverlap from 'element-overlap';

import './App.css';
import Brick from './Brick';
import Ball from './Ball';
import Pad from './Pad';
import Bricks from './Bricks';
import PauseButton from './PauseButton';
import RefreshButton from './RefreshButton';

import Impact from './Impact';

class Game extends Component {
  
  static initialUsedArray = () => {
    var arr = [];
        // Note: calling slice(0) creates a clone of the original array--necessary because we don't
        // want to modify the original
    Bricks.rows.forEach((r) => {
        arr.push(
          Bricks.cols.slice(0).fill(2 * (Bricks.rows.length - r) - 1, 0, Bricks.cols.length)
        );
    });
    return arr;
}

  static initialState = () => ({
    paused: true,
    message: '',
    newGame: false,
    used: Game.initialUsedArray(),
    won: false,
    lost: false,
    numLives: 10,
    level: 1,
    playTime: 0,
    mechanicsOptions: {
        deathOption: Ball.deathOptions.PAUSE
    }
  });
  
  constructor(props) {
    super(props);
    this.state = Game.initialState();
    this.togglePause = this.togglePause.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.resetRefresh = this.resetRefresh.bind(this);
  }

  /* For debugging */
  // componentDidMount() {
  //   this.displayMessage(this.state.used[0][0].toString());
  // }

  refresh = () => {
    this.setState({
      newGame: true
    });
  }

  resetRefresh = () => {
    this.setState({
      newGame: false,
    });
  }

  togglePause() {
    this.setState(prevState => ({
      paused: !prevState.paused
    }));
  }

  /* For debugging */
  displayMessage(str) {
    this.setState({
      message: str
    });
  }

  addToMessage(str) {
    this.setState(prevState => ({
      message: prevState.message + str
    }));
  }

  getLevel(time) {
    return Math.ceil(time / Game.levelDelay) === 0 ? 1 : Math.ceil(time / Game.levelDelay);
  }

  componentDidMount() {
    this.levelTimer = setInterval(
      () => {
        if (!this.state.paused) {
          this.setState(prevState => ({
            playTime: prevState.playTime + 1,
            level: this.getLevel(prevState.playTime)
          }));
        }
        if (this.allBricksDestroyed()) {
            this.props.winGame();
        }
      },
      Game.statusCheckDelay
    );
  }

//   componentDidUpdate() {
//       if (this.allBricksDestroyed()) {
//           this.props.winGame();
//       }
//   }

  allBricksDestroyed = () => {
    var result = true;
    this.state.used.forEach((row, i) => {
        result &= row.every((elem) => elem <= 0);
    });
    return result;
  }

  /* Design decision: Check for all impacts at Game-level 
    Alternative: wrap impact-checking functionality in component functions */

  checkPadImpactY = () => {
    if (this.ball === undefined || this.pad === undefined) return 1;
    return Impact.vyMultiplier(this.ball.state.x, this.ball.state.y, Ball.ballDiameter, 
      this.pad.state.x, this.pad.state.y, Pad.padWidth, Pad.padHeight);
  }

  checkPadImpactX = () => {
    if (this.ball === undefined || this.pad === undefined) return 1;
    // var isHit = Impact.vxMultiplier(this.ball.state.x, this.ball.state.y, Ball.ballDiameter,
    //     this.pad.state.x, this.pad.state.y, Pad.padWidth, Pad.padHeight);
    var isHit = Impact.isOverlap(this.ball.state.x, this.ball.state.y, Ball.ballDiameter, 
        this.pad.state.x, this.pad.state.y, Pad.padWidth, Pad.padHeight);
    var spinFactor = -this.pad.state.v / this.ball.state.vx;
    spinFactor = Math.abs(spinFactor) <= 2 * Ball.maxSpeed / 3 ? spinFactor : 2 * Ball.maxSpeed / 3;
    spinFactor = this.ball.vx <= Ball.maxSpeed / 3 ? spinFactor : spinFactor / Ball.attenuationFactor;
    return Impact.vxMultiplier(this.ball.state.x, this.ball.state.y, Ball.ballDiameter,
        this.pad.state.x, this.pad.state.y, Pad.padWidth, Pad.padHeight) + (isHit ? spinFactor : 0);
  }
  
  checkBricksImpactX = () => {
    var multiplier = 1;

    Bricks.rows.forEach((row) => {
      Bricks.cols.forEach((col) => {
        if (this.state.used[row][col] === 1) {
          var isHit = Impact.vxMultiplier(this.ball.state.x, this.ball.state.y, Ball.ballDiameter,
            Bricks.leftmostPos + col*(Brick.brickWidth + Brick.border), 
            Bricks.topmostPos + row*(Brick.brickHeight + Brick.border), 
            Brick.brickWidth, Brick.brickHeight);
          if (isHit === -1) {
            this.setState(prevState => {
              return ({
                used: prevState.used.map((usedRowElem, usedRowNum) => 
                  usedRowElem.map((usedElem, usedColNum) => (usedRowNum === row && usedColNum === col) ? usedElem - 2 : usedElem)
                )
              });
            });
          }
          multiplier *= isHit;
        }
      });
    });
    return multiplier;
  }

  checkBricksImpactY = () => {
    var multiplier = 1;

    Bricks.rows.forEach((row) => {
      Bricks.cols.forEach((col) => {
        if (this.state.used[row][col] > 0) {
          var isHit = Impact.vyMultiplier(this.ball.state.x, this.ball.state.y, Ball.ballDiameter,
            Bricks.leftmostPos + col*(Brick.brickWidth + Brick.border), 
            Bricks.topmostPos + row*(Brick.brickHeight + Brick.border), 
            Brick.brickWidth, Brick.brickHeight);
          if (isHit === -1) {
            this.setState(prevState => {
              return ({
                used: prevState.used.map((usedRowElem, usedRowNum) => 
                  usedRowElem.map((usedElem, usedColNum) => (usedRowNum === row && usedColNum === col) ? usedElem - 2 : usedElem)
                )
              });
            });
          }
          multiplier *= isHit;
        }
      });
    });
    return multiplier;
  }

  checkFloorImpact = () => {
    if (this.ball === undefined || this.ball === null) return false;
    var result = this.ball.state.y + 3.5 * Ball.ballDiameter >= 100;
    if (result) this.decrementLives();
    return result;
  }

  checkImpactX = () => {
    if (this.ball === undefined || this.pad === undefined) return 1;
    return this.checkBricksImpactX() * this.checkPadImpactX();
  }

  checkImpactY = () => {
    if (this.ball === undefined || this.pad === undefined) {
      this.addToMessage('.');
      return 1;
    }
    return this.checkBricksImpactY() * this.checkPadImpactY();      
  }  

  decrementLives = () => {
    this.setState(prevState => ({
      numLives: prevState.numLives - 1
    }));
    if (this.state.numLives <= 0) {
        this.props.loseGame();
    }
  }
  
  render() {
    return (
      <div      className="GameFrame"
                style={this.props.gameStyle}>       

        <PauseButton  onClick={this.togglePause}
                      paused={this.state.paused} 
                      displayStyle={this.props.displayStyle} />
        <RefreshButton  onClick={this.refresh} 
                        displayStyle={this.props.displayStyle} />
        <Bricks       onClick={this.togglePause} 
                      paused={this.state.paused} 
                      ref={(bricks) => this.bricks = bricks} 
                      displayMessage={this.displayMessage} >          
          {Bricks.rows.map((row,i) => 
            (
              <div    style={Bricks.colStyle}>
                  {Bricks.cols.map((col,j) =>
                      (
                          <div        style={Bricks.rowStyle}>
                            <Brick    topPos={Bricks.topmostPos + row*(Brick.brickHeight + Brick.border)}
                                      leftPos={Bricks.leftmostPos + col*(Brick.brickWidth + Brick.border)}
                                      color={'#ffffff'} 
                                      visibility={this.state.used[row][col] >= 0 ? 1 : 0}
                                      zIndex={1} />
                            <Brick    topPos={Bricks.topmostPos + row*(Brick.brickHeight + Brick.border)}
                                      leftPos={Bricks.leftmostPos + col*(Brick.brickWidth + Brick.border)}
                                      color={this.state.paused ? '#669999' : '#' + Bricks.colors[(row + col) % Bricks.colors.length]} 
                                      visibility={this.state.used[row][col]} 
                                      maxOpacity={Bricks.maxBrickOpacity(row, col)}
                                      zIndex={2} />
                              
                          </div>
                      )
                  )}
              </div>
            )
          )}
        </Bricks >
        <div>
          <div style={Bricks.rowStyle}> {'Lives: ' + this.state.numLives} </div> 
          <div style={Bricks.rowStyle}> {'Level: ' + this.state.level} </div>
        </div>
        <div>
          <div style={Bricks.rowStyle}> {'Game Clock: ' + this.state.playTime} </div>
          <div style={Bricks.rowStyle}> {'Debug Message: ' + this.state.message} </div>
        </div>
        <Ball         newGame='true' 
                      paused={this.state.paused} 
                      refresh={this.state.newGame}
                      refreshed={this.resetRefresh} 
                      ref={(c) => this.ball = c} 
                      xMultiplier={this.checkImpactX}
                      yMultiplier={this.checkImpactY}
                      checkFloorImpact={this.checkFloorImpact} 
                      pauseGame={this.togglePause}
                      speedMultiplier={this.state.level}
                      deathOption={this.state.mechanicsOptions.deathOption}
                      displayStyle={this.props.displayStyle}
                      displayMessage={this.displayMessage} />
        <Pad          centerPos={100} 
                      displayStyle={this.props.displayStyle}
                      displayMessage={this.displayMessage} 
                      ref={(p) => this.pad = p} />

      </div>
    );
  }
}

Game.levelDelay = 5;
Game.statusCheckDelay = 1000;

Game.backgroundColors = [
  'ffffff',
  '000000'
]

Game.textColors = [
  '000000',
  'ffffff'
]


export default Game;