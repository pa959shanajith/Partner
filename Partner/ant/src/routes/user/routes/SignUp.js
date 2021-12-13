import React from 'react';
import QueueAnim from 'rc-queue-anim';
import SignUpForm from 'routes/form/routes/forms/components/SignUpForm';

const FormCard = () => (
  <section className="form-card-page form-card row no-gutters">
    <div className="form-card__img form-card__img--left col-lg-6" style={{ backgroundImage: "url('assets/images-demo/covers/PartnersLogin.png')" }}>
      <a href="https://www.shenzyn.com/"><img src='https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/Shenzyn-TM-white.svg' alt="Shenzyn" /></a>
    </div>
    <div className="form-card__body col-lg-6 p-5 px-lg-6 d-flex align-items-center">
      <SignUpForm />
    </div>
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
