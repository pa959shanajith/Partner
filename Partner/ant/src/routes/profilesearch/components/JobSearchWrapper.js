import { Icon } from 'antd';
import React from 'react';
import CandidateProfileDetailComponent from './candidate-profile-details';
import JobSearch from './candidate-search-list/index';


class JobSearchWrapper extends React.Component {
  render() {
    return (
      <div className="container-fluid page-dashboard">
        <div className="col-lg-12 searchpage">
          <h5 style={{ fontSize: '16px' }}><Icon type="left" style={{ fontSize: '14px' }}/>Back to dashboard</h5>
          <div className="profile-card-v2 h-100 row">
            <div className="mt-1 col-5 mb-2">
              <JobSearch />
            </div>
            <div className="mt-1 col-7 mb-2">
              <CandidateProfileDetailComponent />
            </div>
          </div>
        </div>

      </div>

    )
  }
}

export default JobSearchWrapper;
