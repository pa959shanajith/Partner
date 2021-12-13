import React from 'react';
import QueueAnim from 'rc-queue-anim';
import JobSearch from './JobSearch';

const JobSearchWrapper = (props) => (
  <div className="container-fluid no-breadcrumb page-dashboard">
    <QueueAnim type="bottom" className="ui-animate">

      <JobSearch />

    </QueueAnim>
  </div>
);

export default JobSearchWrapper;
