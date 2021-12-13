import { Icon } from 'antd';
import PAGEROUTES from 'constants/pageRoutes';
import React from 'react';

const Section = () => {
  
  return (
    <div className="row">
      <div className="col-xl-3 mb-4">
        <a href={PAGEROUTES.dashboardComponentLinks.recommendedjobs} >
          <div className="number-card-v1">
            <div className="card-top">
              <Icon type="code" className="text-primary" />
            </div>
            <div className="card-info">
              <span>Recommended Jobs</span>
            </div>
            <div className="card-bottom">
              
            </div>
          </div>
        </a>
      </div>

      <div className="col-xl-3 mb-4">
        <a href={PAGEROUTES.dashboardComponentLinks.savedjobs}>
          <div className="number-card-v1">
            <div className="card-top">
              
            </div>
            <div className="card-info">
              <span>Saved Jobs</span>
            </div>
            <div className="card-bottom">
              <Icon type="book" className="text-success" />
            </div>
          </div>
        </a>
      </div>

      <div className="col-xl-3 mb-4">
        <div className="number-card-v1">
          <div className="card-top">
            <Icon type="book" className="text-info" />
          </div>
          <div className="card-info">
            <span>Applied Jobs</span>
          </div>
          <div className="card-bottom">
            
          </div>
        </div>
      </div>

      <div className="col-xl-3 mb-4">
        <a href={PAGEROUTES.dashboardComponentLinks.profileviews}>
          <div className="number-card-v1">
            <div className="card-top">
              <span>55</span>
            </div>
            <div className="card-info">
              <span>Profile Views</span>
            </div>
            <div className="card-bottom">
              <Icon type="eye" className="text-warning" />
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Section;
