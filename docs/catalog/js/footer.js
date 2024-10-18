/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/// <reference lib="dom" />
import {BaseElement} from './base.js'
import {setVar, tagPair, tags} from './dom.js'
import {getWidth} from './measure.js'

/**
 * @returns {HTMLElement}
 */
export const getFooter = () =>
  /** @type {HTMLElement} */ (tags('info-footer')[0])

export class InfoFooter extends BaseElement {
  /** @type {boolean} */
  _dirty = true

  /** @type {HTMLElement} */
  _article = this

  /** @type {HTMLElement} */
  _shadow = this

  constructor() {
    super()
  }

  nextFrame() {
    requestAnimationFrame(() => {
      this.refresh()
    })
  }

  refresh() {
    if (!this._dirty) {
      this.nextFrame()
      return
    }

    const delta =
      (
        Math.max(0, getWidth(this._article) - getWidth(this._shadow)) / 2
      ).toString() + 'px'

    setVar('footer-delta', delta)

    this._dirty = false
    this.nextFrame()
  }

  /**
   * @override
   */
  render() {
    const [article, scrollBox] = tagPair('article', 'scroll-box')
    this._article = article
    this._shadow = /** @type {HTMLElement} */ (scrollBox.firstElementChild)

    new ResizeObserver(() => {
      this._dirty = true
    }).observe(this)

    this.nextFrame()
  }
}
