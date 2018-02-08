const e = 0.396
const t = 0.2
const n = 0.133
const r = 0.038
const i = o(e)
const s = o(t)

function o (e) {
  return (r + e) * (1 - n) + n
}

export default {
  LONG_TERM_RATE: s,
  SHORT_TERM_RATE: i
}
