import React from 'react';
import QueueAnim from 'rc-queue-anim';
import NumberCards from './NumberCards';

const JobSearchWrapper = () => (
  <div className="container-fluid no-breadcrumb page-dashboard">
    <QueueAnim type="bottom" className="ui-animate">
      <div key="1"> <NumberCards /></div>
    </QueueAnim>
  </div>
);

export default JobSearchWrapper;
