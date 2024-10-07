/// <reference lib="dom" />
import {BaseElement} from './base.js'
import {add, element, svgRect} from './dom.js'
import {measureText} from './measure.js'

const computeSource = (/** @type {string} */ href) =>
  href.startsWith('http')
    ? href
    : 'https://github.com/Effect-TS/effect/blob/main/packages/' + href

export class LinkTo extends BaseElement {
  /** @type {string | null} */
  _name = null

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
    return add(
      element('a', {href: computeSource(this.href), title}),
      add(element('span', {id: this._name ?? 'anonymous'}), ...content),
      svgRect(),
    )
  }

  /**
   * @override
   */
  isLoaded() {
    return this.innerText !== ''
  }

  /**
   * @override
   */
  render() {
    const text = this.innerText
    this._name = this.span === '' ? text : this.span

    measureText(this, text)
    this.add(this.buildLink(this.erase())).css({
      opacity: '1',
    })
  }
}
