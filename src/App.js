import { Lightning, Utils } from 'wpe-lightning-sdk'
import Menu from './mainMenu/menu.js'
import OnDemand from './OnDemand/ondemand.js'
import ChannelBar_ from './channelBar/channelbar.js'
import Movie from './movie/movie.js'
import { setPlayerEndpoint, startPlayback } from './player/player.js'
import Model from './AppModel.js'

export default class App extends Lightning.Component {
  static getFonts() {
    return []
  }

  static _template() {
    return {
      Menu: { type: Menu, alpha: 0, signals: { select: true } },
      App: {
        type: OnDemand,
        alpha: 0,
        signals: { select: true },
        argument: 'App Page Under Construction. Please Press Enter key.'
      },
      Movie: {
        type: Movie,
        alpha: 0,
        signals: { select: true },
        argument: 'Movie Page Under Construction. Please Press Enter key.'
      },
      Setting: {
        type: OnDemand,
        alpha: 0,
        signals: { select: true },
        argument: 'Setting Under Construction. Please Press Enter key.'
      }
    }
  }

  _setup() {
    this._setState('Menu')
  }

  _construct() {
    this.model = new Model()
    this.model.data = {}
    
     //This fix will be removed once get acess body element through lighting framework.
    //issue ticket will  raised to lightning framework development 
     var style = document.createElement('style');
     document.head.appendChild(style);
     style.sheet.insertRule('@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body {  background-color:transparent; width: 100%; height: 100%;} }');
  
  }

  _init() {
    this.model.getAppModel().then(data => {
      this.model.data = data
      setPlayerEndpoint(data)
      this.patch({
        ChannelBar: {
          type: ChannelBar_,
          alpha: 0,
          signals: { select: true },
          argument:
            'Please Press Up/Down arrow key for channel navigation.Press Enter ,The main menu will appear'
        }
      })
    })
  }

  _captureKey(evt) {
    if ((evt.code === 'ArrowDown' || evt.code === 'ArrowUp') && this._stateIndex === 1) {
      this._setState('ChannelBar')
    }
    return false
  }

  static _states() {
    return [
      class Menu extends this {
        $enter() {
          this.tag('Menu').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Menu').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('Menu')
        }
        select({ item }) {
          this._setState(item.target)
        }
      },
      class App extends this {
        $enter() {
          this.tag('App').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('App').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('App')
        }
        select({ item }) {
          this._setState(item.target)
        }
      },
      class Movie extends this {
        $enter() {
          this.tag('Movie').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Movie').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('Movie')
        }
        select({ item }) {
          this._setState(item.target)
        }
      },
      class Setting extends this {
        $enter() {
          this.tag('Setting').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Setting').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('Setting')
        }
        select({ item }) {
          this._setState(item.target)
        }
      },
      class ChannelBar extends this {
        $enter() {
          this.tag('ChannelBar').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('ChannelBar').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('ChannelBar')
        }
        select({ item }) {
          this._setState(item.target)
        }
      }
    ]
  }
}