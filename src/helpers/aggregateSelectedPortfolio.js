import R from 'ramda'

const getPortfolioItems = R.compose(
  R.defaultTo([]),
  R.prop('items'),
  R.defaultTo({})
)

const getTotalWeight = R.compose(
  R.sum,
  R.map(R.prop('weight'))
)

const getTickerFromPortfolioItem = ({ asset }) => R.compose(
  R.defaultTo({}),
  R.find(R.propEq('id', asset))
)

const getTickerFromPosition = ({ ticker }) => R.compose(
  R.defaultTo({}),
  R.find(R.propEq('id', ticker))
)

const getAssetClass = ({ asset_class }) => R.compose(
  R.defaultTo({}),
  R.find(R.propEq('id', asset_class))
)

const getPosition = ({ id }) => R.compose(
  R.defaultTo({}),
  R.find(R.pathEq(['ticker', 'id'], id))
)

const getPositionsWithTickers = (positions, tickers) =>
  R.map(position => ({
    ...position,
    ticker: getTickerFromPosition(position)(tickers)
  }), positions)

const getCurrentValue = position =>
  R.isEmpty(position)
    ? 0
    : position.share * position.ticker.unit_price

const getCurrentWeight = (position, balance) =>
  R.isEmpty(position)
    ? 0
    : position.share * position.ticker.unit_price / balance

const getFromPortfolio = params => portfolioItem => {
  const { assetsClasses, balance, formatNumber, positions, tickers,
    totalWeight } = params
  const ticker = getTickerFromPortfolioItem(portfolioItem)(tickers)
  const position = getPosition(ticker)(positions)

  const usedWeight = portfolioItem.weight / totalWeight
  const targetShares = Math.floor(balance * usedWeight / ticker.unit_price)
  const targetValue = targetShares * ticker.unit_price

  return R.merge(portfolioItem, {
    assetClass: getAssetClass(ticker)(assetsClasses),
    currentWeight: getCurrentWeight(position, balance),
    percent: formatNumber(usedWeight, { format: 'percentDecimal' }) * 100,
    position,
    targetValue,
    ticker,
    type: 'portfolioItem',
    usedWeight,
    value: getCurrentValue(position)
  })
}

const getFromPositions = params => position => {
  const { assetsClasses, balance } = params
  const { ticker } = position

  return R.merge(position, {
    assetClass: getAssetClass(ticker)(assetsClasses),
    currentWeight: getCurrentWeight(position, balance),
    percent: 0,
    position,
    targetValue: 0,
    ticker,
    type: 'position',
    usedWeight: 0,
    value: getCurrentValue(position)
  })
}

export default function aggregateSelectedPortfolio (params) {
  const { positions, selectedPortfolio, tickers } = params
  const finalPositions = getPositionsWithTickers(positions, tickers)
  const portfolioItems = getPortfolioItems(selectedPortfolio)
  const totalWeight = getTotalWeight(portfolioItems)
  const itemsFromPortfolio = R.map(
    getFromPortfolio({ ...params, positions: finalPositions, totalWeight }),
    portfolioItems
  )

  const otherPositions = R.without(
    R.map(R.prop('position'), itemsFromPortfolio),
    finalPositions
  )

  const itemsFromPositions = R.map(
    getFromPositions({ ...params, totalWeight }),
    otherPositions
  )

  return R.concat(itemsFromPortfolio, itemsFromPositions)
}
