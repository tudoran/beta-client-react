import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import AccountSettings from './AccountSettings/AccountSettings'
import Activity from './Activity'
import Account from './Account/Account'
import Allocation from './Allocation/Allocation'
import App from './App/App'
import Client from './Client'
import ExistingGoal from './SetupGoal/ExistingGoal'
import FourOhFour from './FourOhFour/FourOhFour'
import Goal from './Goal/Goal'
import NewGoal from './SetupGoal/NewGoal'
import NoAccount from './NoAccount/NoAccount'
import NoClient from './NoClient/NoClient'
import NoViewedSettings from './Allocation/NoViewedSettings/NoViewedSettings'
import Overview from './Overview/Overview'
import Performance from './Performance/Performance'
import Portfolio from './Portfolio/Portfolio'
import RiskProfileWizard from './RiskProfileWizard/RiskProfileWizard'
import Transfer from './Transfer/Transfer'
import UserSettings from './UserSettings'
import RetireSmartz from './RetireSmartz/RetireSmartz'
import Projection from './RetireSmartz/Projection/Projection'
import RetireSmartzStart from './RetireSmartz/RetireSmartzStart/RetireSmartzStart'
import RetireSmartzSetup from './RetireSmartzSetup/RetireSmartzSetup'

const allocationRootComponent = (_props) =>
  <div>
    {_props.children}
  </div>

export default (
  <Route path='/' component={App}>
    <IndexRoute component={NoClient} />
    <Redirect from=':clientId/app' to=':clientId' />
    <Route path=':clientId' component={Client}>
      <IndexRoute component={NoAccount} />
      <Route path='account(/:accountId)' component={Account}>
        <IndexRoute component={Overview} />
        <Route path='create-goal' component={NewGoal} />
        <Route path='goal/:goalId' component={Goal}>
          <Route path='activity' component={Activity} />
          <Route path='allocation' component={allocationRootComponent}>
            <IndexRoute component={NoViewedSettings} />
            <Route path=':viewedSettings' component={Allocation} />
          </Route>
          <Route path='portfolio' component={Portfolio} />
          <Route path='transfer' component={Transfer} />
          <Route path='update-goal' component={ExistingGoal} />
        </Route>
        <Route path='performance' component={Performance} />
        <Route path='retiresmartz' component={RetireSmartz}>
          <Route path='projection' component={Projection} />
          <Route path='setup' component={RetireSmartzStart} />
          <Route path='setup/:stepId' component={RetireSmartzSetup} />
        </Route>
        <Route path='settings' component={AccountSettings} />
      </Route>
      <Route path='account/:accountId/risk-profile-wizard(/:questionIndex)'
        component={RiskProfileWizard} />
      <Route path='settings' component={UserSettings} />
    </Route>
    <Route path='404' component={FourOhFour} />
    <Redirect from='*' to='/404' />
  </Route>
)
