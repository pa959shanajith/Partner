import React from 'react';
import QueueAnim from 'rc-queue-anim';
import PartnerOTPPage from '../../form/routes/forms/components/PartnerOTPPage';

const FormCard = () => (
  <section className="form-card-page form-card  no-gutters" >
    <PartnerOTPPage />
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
