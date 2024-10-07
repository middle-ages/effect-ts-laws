/// <reference lib="dom" />
import {BaseElement} from './base.js'
import {getNumericVar, tagPair} from './dom.js'
import {getWidth} from './measure.js'

export class InfoFooter extends BaseElement {
  /** @type {boolean} */
  _dirty = true

  /** @type {number} */
  _pad = 0

  /** @type {HTMLElement} */
  _article = this

  /** @type {HTMLElement} */
  _scrollBox = this

  constructor() {
    super()
  }

  refresh() {
    if (!this._dirty) {
      requestAnimationFrame(() => this.refresh())
      return
    }

    const delta =
      Math.max(0, getWidth(this._article) - getWidth(this._scrollBox)) / 2 +
      this._pad
    const margin = delta.toString() + 'px'
    this.style.setProperty('margin-left', margin)
    this.style.setProperty('margin-right', margin)

    this._dirty = false
    requestAnimationFrame(() => this.refresh())
  }

  /**
   * @override
   */
  render() {
    this._pad = getNumericVar('pad')
    const [article, scrollBox] = tagPair('article', 'scroll-box')
    this._article = article
    this._scrollBox = scrollBox

    new ResizeObserver(() => {
      this._dirty = true
    }).observe(this)

    requestAnimationFrame(() => this.refresh())
  }
}
