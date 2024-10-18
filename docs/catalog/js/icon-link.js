/* eslint-disable @typescript-eslint/no-useless-constructor */
/// <reference lib="dom" />
import {BaseElement} from './base.js'
import {fancyLink} from './dom.js'

export class IconLink extends BaseElement {
  constructor() {
    super()
  }

  buildLink(/** @type {Node[]} */ content) {
    return fancyLink(
      18,
      this.get('href'),
      this.get('title'),
      this.get('name'),
      content,
    )
  }

  /**
   * @override
   */
  render() {
    this.style.setProperty(
      '--px-width',
      parseInt(this.get('width')).toString() + 'px',
    )
    this.add(this.buildLink(this.erase())).css({
      opacity: '1',
    })
    this.firstElementChild?.setAttribute('tabindex', '1')
  }
}
