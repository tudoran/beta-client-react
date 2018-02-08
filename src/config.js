import R from 'ramda'

export default {
  intl: {
    locale: 'en',
    formats: {
      date: {
        numericDate: {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        },
        monthAndYear: {
          month: 'long',
          year: 'numeric'
        },
        dayMonthAndYear: {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        },
        currencyWithoutCents: {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 2
        },
        percentDecimal: {
          style: 'decimal',
          minimumFractionDigits: 1,
          maximumFractionDigits: 2
        }
      }
    }
  },

  riskDescriptions: [
    { when: ({ maxRec, minRec, value }) =>
      (R.lte(value, maxRec) && R.gte(value, minRec)) ||
      (R.gt(value, maxRec) && R.lte(value - maxRec, 0.1)) ||
      (R.gt(minRec, value) && R.lte(minRec - value, 0.1)),
      label: 'Moderate (Growth)', className: 'text-success' },
    { when: ({ maxRec, minRec, value }) =>
      R.gt(value - maxRec, 0.1) && R.lte(value - maxRec, 0.2),
      label: 'Semi-Dynamic', className: 'text-warning' },
    { when: ({ maxRec, minRec, value }) =>
      R.gt(minRec - value, 0.1) && R.lte(minRec - value, 0.2),
      label: 'Semi-Protected', className: 'text-warning' },
    { when: ({ maxRec, minRec, value }) => R.gt(value - maxRec, 0.2),
      label: 'Dynamic', className: 'text-danger' },
    { when: ({ maxRec, minRec, value }) => R.gt(minRec - value, 0.2),
      label: 'Protected', className: 'text-danger' }
  ],

  goalMetric: {
    type: { // or metricType
      values: {
        METRIC_TYPE_PORTFOLIO_MIX: 0,
        METRIC_TYPE_RISK_SCORE: 1
      },
      labels: {
        0: 'Portfolio Mix',
        1: 'RiskScore'
      }
    },
    comparison: {
      values: {
        METRIC_COMPARISON_MINIMUM: 0,
        METRIC_COMPARISON_EXACTLY: 1,
        METRIC_COMPARISON_MAXIMUM: 2
      },
      labels: {
        0: 'Minimum',
        1: 'Exactly',
        2: 'Maximum'
      }
    }
  },

  goalsStates: ['active', 'archiveRequested', 'closing', 'archived']
}
