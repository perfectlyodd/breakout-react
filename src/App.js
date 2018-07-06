import React, { Component } from 'react';
import logo from './logo.svg';
import Game from './Game';
import WinFrame from './WinFrame';
import LossFrame from './LossFrame';
import Panel from './Panel';

class App extends Component {
  static initialState = () => ({
    won: false,
    lost: false,
    displayStyle: App.displayOptions.DARK,
  })
  constructor(props) {
    super(props);
    this.state = App.initialState();
    this.winGame = this.winGame.bind(this);
    this.loseGame = this.loseGame.bind(this);
  }
  frameStyle = () => {
    var GameWidth = window.innerWidth * .8;
    var GameHeight = window.innerHeight * .8;
    return ({
      width: GameWidth + 'px',
      height: GameHeight + 'px',
      backgroundColor: '#' + Game.backgroundColors[this.state.displayStyle],
      color: '#' + Game.textColors[this.state.displayStyle]
    });
  }
  winGame() {
    this.setState({
      won: true
    });
  }
  loseGame() {
    this.setState({
      lost: true
    });
  }
  resetGame() {
    this.setState(App.initialState())
  }
  selectFrame = () => {
    if (this.state.won) return (
      <WinFrame frameStyle={this.frameStyle()} />
    );
    if (this.state.lost) return (
      <LossFrame frameStyle={this.frameStyle()} />
    );
    return (
      <Game loseGame={this.loseGame}
            winGame={this.winGame} 
            gameStyle={this.frameStyle()} 
            displayStyle={this.state.displayStyle} />
    );
};
  render() {
    return (
      <div      className="App">  
        <Panel >
        </Panel >     
        {this.selectFrame()}      
      </div>
    );
  }
}

App.displayOptions = {
  LIGHT: 0,
  DARK: 1
}

export default App;
