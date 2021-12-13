import React from 'react';
import { Route, Redirect,Switch } from 'react-router-dom';
import loadable from 'react-loadable';
import LoadingComponent from 'components/Loading';
import NotFoundPage from './error404/NotFoundPage'

// 3rd
import 'styles/antd.less';
import 'styles/bootstrap/bootstrap.scss'
// custom
import "styles/layout.scss"
import "styles/theme.scss"
import "styles/ui.scss"
import "styles/vendors.scss"


let AsyncAppLayout = loadable({
  loader: () => import('components/Layout/AppLayout/'),
  loading: LoadingComponent
})
let AsyncException = loadable({
  loader: () => import('routes/exception/'),
  loading: LoadingComponent
})
// let AsyncProfileSubmission = loadable({
//   loader: () => import('routes/profilesubmissions'),
//   loading: LoadingComponent
// })
let AsyncAccount = loadable({
  loader: () => import('routes/user/'),
  loading: LoadingComponent
})
let AsyncCampaign = loadable({
  loader: () => import('routes/campaign/'),
  loading: LoadingComponent
})


class App extends React.Component {
  render() {
    const { match, location } = this.props;
    const isRoot = location.pathname === '/' ? true : false;
    if (isRoot) {
      return (<Redirect to={'/user/login'} />);
    }

    return (
      <div id="app">
        <Switch>
        <Route path={`${match.url}app`} component={AsyncAppLayout} />
        {/* <Route path={`${match.url}app/profilesubmissions`} exact={true} component={AsyncProfileSubmission} /> */}
        <Route path={`${match.url}exception`} component={AsyncException} />
        <Route path={`${match.url}user`} component={AsyncAccount} />
        <Route path={`${match.url}partnerupload`} component={AsyncCampaign} />
        <Route  component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
