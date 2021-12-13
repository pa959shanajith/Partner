import { Layout } from 'antd';
import LoadingComponent from 'components/Loading';
import React from 'react';
import loadable from 'react-loadable';
import { withRouter } from 'react-router';
import { Route,Switch } from 'react-router-dom';
import requireAuthentication from '../../AuthenticatedComponentHOC';
import NotFoundPage from '../../error404/NotFoundPage2';
const { Content } = Layout;

let AsynEventDetails = loadable({
  loader: () => import('routes/eventdetails/'),
  loading: LoadingComponent
})
let AsyncProfileSearch = loadable({
  loader: () => import('routes/profilesearch/'),
  loading: LoadingComponent
})
let AsyncJobs = loadable({
  loader: () => import('routes/jobs/'),
  loading: LoadingComponent
})
let AsyncRecruiters = loadable({
  loader: () => import('routes/recruiters/'),
  loading: LoadingComponent
})
let AsyncDashboard = loadable({
  loader: () => import('routes/dashboard/'),
  loading: LoadingComponent
})
let AsyncFeedback = loadable({
  loader: () => import('routes/feedback/'),
  loading: LoadingComponent
})
let AsyncPage = loadable({
  loader: () => import('routes/page/'),
  loading: LoadingComponent
})
let AsyncLayout = loadable({
  loader: () => import('routes/layout/'),
  loading: LoadingComponent
})
let AsyncTrainingPartnerDashboard = loadable({
  loader: () => import('routes/dashboard-tp/'),
  loading: LoadingComponent
})
let AsyncJobSearch = loadable({
  loader: () => import('routes/jobsearch/'),
  loading: LoadingComponent
})
let AsyncProfileSubmissions = loadable({
  loader: () => import('routes/profilesubmissions/'),
  loading: LoadingComponent
})

let AsysnAccountSetting = loadable({
  loader: () => import('routes/accountsetting/'),
  loading: LoadingComponent
})

class AppContent extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Content id='app-content'>
        <Switch>
        <Route path={`${match.url}/dashboard`} component={requireAuthentication(AsyncDashboard)} />
        <Route path={`${match.url}/profilesubmissions`} component={requireAuthentication(AsyncProfileSubmissions)} />
        <Route path={`${match.url}/account`} component={requireAuthentication(AsysnAccountSetting)} />
        <Route path={`${match.url}/jobs`} component={requireAuthentication(AsyncJobs)} />
        <Route path={`${match.url}/jobsearch`} component={requireAuthentication(AsyncJobSearch)} />
        <Route path={`${match.url}/recruiters`} component={requireAuthentication(AsyncRecruiters)} />
        <Route path={`${match.url}/eventdetails`} component={requireAuthentication(AsynEventDetails)} />
        <Route path={`${match.url}/profilesearch`} component={requireAuthentication(AsyncProfileSearch)} />
        <Route path={`${match.url}/feedback`} component={requireAuthentication(AsyncFeedback)} />
        <Route path={`${match.url}/page`} component={requireAuthentication(AsyncPage)} />
        <Route path={`${match.url}/layout`} component={requireAuthentication(AsyncLayout)} />
        <Route path={`${match.url}/dashboard-tp`} component={requireAuthentication(AsyncTrainingPartnerDashboard)} />
        <Route component={requireAuthentication(NotFoundPage)} />
        </Switch>
      </Content>
    );
  }
}

export default withRouter(AppContent);
