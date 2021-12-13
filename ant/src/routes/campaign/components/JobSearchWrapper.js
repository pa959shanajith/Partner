import React from 'react';
import QueueAnim from 'rc-queue-anim';
import JobList from './JobList';


const JobSearchWrapper = () => (
  <div className="container-fluid no-breadcrumb page-dashboard">
    <QueueAnim type="bottom" className="ui-animate">

    <div key="1"> <JobList /></div>

    </QueueAnim>
  </div>
);

export default JobSearchWrapper;
