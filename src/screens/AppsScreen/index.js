/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Liberty Global B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Utils, Log } from 'wpe-lightning-sdk'
import BaseScreen from '../BaseScreen'
import { getDomain } from '@/domain'
import Background from '@/components/Background'
import ListWithLine from './components/ListWithLine'
import WarningModal from '@/components/WarningModal'
import commonConstants from '@/constants/default'
import constants from './constants'

export default class AppsScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background,
      },
      Mask: {
        clipping: true,
        w: commonConstants.screen.width,
        h: commonConstants.screen.height,
        Container: {
          x: constants.CONTAINER_X,
          alpha: constants.CONTAINER_ALPHA,
          Lists: {
            y: constants.CONTAINER_LIST_Y,
          },
        },
        Popup: {
          type: WarningModal,
          headerText: "Apps is not available",
          bodyText: "Implementation is planned for future versions of the application",
          x: constants.POPUP_X,
          y: constants.POPUP_Y,
          visible: false
        }
      },
    }
  }

  _handleEnter() {
    this.tag("Popup").visible = true
    setTimeout(() => {
      this.tag("Popup").visible = false
      this._refocus()
    }, constants.POPUP_TIMEOUT)
  }

  setIndex(index) {
    this._index = index
  }

  _getFocused() {
    if (this.tag("Popup").visible) {
      return this.tag("Popup")
    } else {
      return this.activeList
    }
  }

  get lists() {
    return this.tag('Lists').children
  }

  get activeList() {
    return this.lists[this._index]
  }

  async _init() {
    const response = await fetch(Utils.asset(`cache/mocks/${getDomain()}/apps.json`))
    const { layout } = await response.json()
    this._categories = layout.body
    this.rowsTopPositions = []
    const children = layout.body.map(({ label, items, itemWidth, itemHeight }, index, lists) => {
      let yPosition = 0
      for (let i = 0; i < index; i++) {
        const element = lists[i]
        yPosition += (element.itemHeight || 100) + 140
      }
      return {
        type: ListWithLine,
        itemSize: { w: itemWidth, h: itemHeight },
        label: label,
        items: items,
        y: yPosition,
      }
    })
    this._index = 0
    this.tag('Lists').children = children
    this.animate()
  }

  animate() {
    this.tag('Container').alpha = 0
    this.tag('Container').setSmooth('alpha', 1, { duration: 2 })

    for (let i = 0; i < this.lists.length; i++) {
      const list = this.lists[i]
      if (this.rowsTopPositions.length - 1 < i) {
        this.rowsTopPositions.push(list.y)
      }
      const y = this.rowsTopPositions[i]
      list.y = y + 200
      list.setSmooth('y', y, { delay: 0.1 * i, duration: 1 })
    }
  }

  _handleUp() {
    if (this._index > 0) {
      this.setIndex(this._index - 1)
    }
  }

  _handleDown() {
    if (this._index < this.lists.length - 1) {
      this.setIndex(this._index + 1)
      return true
    }
    return false
  }
}
