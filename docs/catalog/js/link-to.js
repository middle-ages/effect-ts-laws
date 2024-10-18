/// <reference lib="DOM" />
/* eslint-disable @typescript-eslint/no-useless-constructor */
import {BaseElement} from './base.js'
import {fancyLink} from './dom.js'
import {measureText} from './measure.js'

const computeSource = (/** @type {string} */ href) =>
  href.startsWith('http')
    ? href
    : 'https://github.com/Effect-TS/effect/blob/main/packages/' + href

export class LinkTo extends BaseElement {
  /** @type {string | null} */
  _name = null

  /** @type {number} */
  _keydown = 0

  constructor() {
    super()
  }

  get href() {
    return this.get('href')
  }
  get span() {
    return this.get('span')
  }

  buildLink(/** @type {Node[]} */ content) {
    const hasTitle = this.title !== ''
    const title = hasTitle
      ? this.title
      : `${this._name ?? 'anonymous'} typeclass source code (effect-ts)`

    return fancyLink(
      6,
      computeSource(this.href),
      title,
      this._name ?? 'anonymous',
      content,
    )
  }

  /**
   * @override
   */
  render() {
    const text = this.innerText
    this._name = this.span === '' ? text : this.span

    const width = measureText(this, text, 0)

    this.add(this.buildLink(this.erase())).css({
      opacity: '1',
    })

    const rectHeight = 1.5 * 18 - 2 - 0.5
    const rectWidth = width + 2 * 8 - 2
    const circumference = 2 * (rectWidth + rectHeight) - 1.5
    const dots = Math.floor(circumference / 3)
    const dash = circumference / dots
    this.style.setProperty('--dash', dash.toString())
  }
}
