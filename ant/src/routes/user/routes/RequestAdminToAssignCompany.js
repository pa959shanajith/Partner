import React from 'react';
import QueueAnim from 'rc-queue-anim';
import RequestAdminToGrantCompany from '../../form/routes/forms/components/RequestAdminToGrantCompany';

const FormCard = () => (
  <section className="form-card-page form-card row no-gutters">
    <RequestAdminToGrantCompany />
  </section>
)

const Page = () => (
  <QueueAnim type="bottom" className="ui-animate">
    <div key="1">
      <FormCard />
    </div>
  </QueueAnim>
)

export default Page;
