export const loadKatex = () => {
  // @ts-ignore
  renderMathInElement(document.body, {
    delimiters: [{left: '$', right: '$', display: false}],
    throwOnError: false,
    strict: false,
    trust: true,
    macros: {
      // Instances
      '\\Id': '\\mathrm{Id}',
      '\\F': '\\mathrm{F}',
      '\\G': '\\mathrm{G}',
      '\\H': '\\mathrm{H}',
      '\\GH': '\\mathrm{GH}',
      // functions
      '\\ap': '\\fn{ap}',
      '\\apply': '\\fn{apply}',
      '\\combineMany': '\\fn{combineM}\\kern{-3pt}\\fn{any}',
      '\\compose': '\\fn{compose}',
      '\\contramap': '\\fn{contr}\\kern{-2pt}\\fn{amap}',
      '\\coproduct': '\\fn{coproduct}',
      '\\coproductAll': '\\fn{coproductA}\\kern{-2pt}\\fn{ll}',
      '\\coproductMany': '\\fn{coproductM}\\kern{-3pt}\\fn{any}',
      '\\flatMap': '\\fn{f}\\kern{-1.5pt}\\fn{latM}\\kern{-3pt}\\fn{ap}',
      '\\fn': '\\htmlClass{fn}{#1}',
      '\\id': '\\fn{id}',
      '\\imap': '\\fn{imap}',
      '\\map': '\\fn{map}',
      '\\maxBound': '\\fn{maxB}\\!\\fn{o}\\!\\fn{und}',
      '\\minBound': '\\fn{minB}\\!\\fn{o}\\!\\fn{und}',
      '\\of': '\\fn{of}',
      '\\product': '\\fn{product}',
      '\\traverse':
        '\\fn{tr}\\kern{-1.5pt}\\fn{av}\\kern{-1.5pt}\\fn{er}\\kern{-1.5pt}\\fn{se}',
      // Symbols
      '∅': '\\htmlClass{empty}{\\varnothing}',
      '\\(': '\\big(',
      '\\)': '\\big)',
      '\\▹': '\\,\\:\\htmlClass{pipe}{\\footnotesize{▹}}\\,\\,',
      '\\∘': '\\:\\htmlClass{flow}{\\scriptsize{∘}}\\,',
      // Variables
      '\\fa': 'f\\kern{-1.25pt}a',
      '\\fab': 'f\\kern{-1pt}ab',
      '\\fbc': 'f\\kern{-0.5pt}bc',
      '\\afb': 'a\\kern{-1.25pt}f\\kern{-0.5pt}b',
      '\\bfc': 'b\\kern{-1.25pt}f\\kern{-1.5pt}c',
    },
  })
}
