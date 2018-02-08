import React from 'react'
import { IntlProvider, intlShape } from 'react-intl'
import { mount } from 'enzyme'
import config from 'config'

// Helper function from https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl#helper-function-1

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider(config.intl, {})
const { intl } = intlProvider.getChildContext()

// When using React-Intl `injectIntl` on components, props.intl is required.
function nodeWithIntlProp (node) {
  return React.cloneElement(node, { intl })
}

export default function mountWithIntl (node, { context, childContextTypes } = {}) {
  return mount(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes)
  })
}
