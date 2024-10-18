import {setNumericVar, setPxVar} from './dom.js'

const pad = 8, // base padding used everywhere.
  gap = 6, // top/bottom pad of laws box
  separator = 8, // gap between law boxes
  stroke = 1.2

const fontSize = 16,
  fontSizeTitle = 31,
  fontSizeLink = 14,
  fontSizeTex = 18,
  fontSizeTypeclass = 18,
  fontSizeTableHeader = 14,
  fontSizeFooter = 14

const lineHeightFactor = 7 / 4,
  lineHeightFactorBase = 3 / 2

const configuration = {
  pad,
  gap,
  separator,
  stroke,

  fontSize,
  fontSizeTitle,
  fontSizeLink,
  fontSizeTex,
  fontSizeTypeclass,
  fontSizeTableHeader,
  fontSizeFooter,
  lineHeight: lineHeightFactor * fontSize,
  lineHeightTitle: lineHeightFactorBase * fontSizeTitle,
  lineHeightTypeclass: lineHeightFactorBase * fontSizeTypeclass,
  lineHeightTableHeader: lineHeightFactor * fontSizeTableHeader,
  lineHeightFooter: lineHeightFactorBase * fontSizeFooter,
}

export const setConfiguration = () => {
  for (const [rawKey, value] of Object.entries(configuration)) {
    const key = dash(rawKey)
    setPxVar(key, value)
    setNumericVar(`${key}-num`, value)

    setPxVar(`${key}-half`, value / 2)
    setPxVar(`${key}-quarter`, value / 4)
    setPxVar(`${key}-three-halves`, (3 * value) / 2)
    setPxVar(`${key}-three-quarters`, (3 * value) / 4)

    setPxVar(`${key}-2`, 2 * value)
    setPxVar(`${key}-3`, 3 * value)
    setPxVar(`${key}-4`, 4 * value)
  }
}

/**
 * @param {string} s
 * @returns string
 */
const dash = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
