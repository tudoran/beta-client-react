import { Button } from 'react-bootstrap'
import { Size, State, Style } from 'react-bootstrap/lib/utils/StyleConfig'
import { bsStyles, bsSizes, bsClass }
  from 'react-bootstrap/lib/utils/bootstrapUtils'
import R from 'ramda'

const buttonStyles = R.concat(
  [State.SUCCESS, State.WARNING, State.DANGER, State.INFO],
  [Style.DEFAULT, Style.PRIMARY, Style.LINK, 'circle', 'circle-success',
    'round', 'round-success']
)

export default bsStyles(
  buttonStyles,
  Style.DEFAULT,
  bsSizes([Size.LARGE, Size.SMALL, Size.XSMALL], bsClass('btn', Button))
)
