import React from 'react';
import QueueAnim from 'rc-queue-anim';
import AddTraineesForm from 'routes/form/routes/forms/components/AddTraineesForm';

const FormCard = () => (
    <section className="form-card-page form-card row no-gutters">
  
      <div className="form-card__img form-card__img--left col-lg-6" style={{ backgroundImage: "url('assets/images-demo/covers/PartnersLogin.png')" }}>
        <a href="https://www.shenzyn.com/"><img src='https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/Shenzyn-TM-white.svg' alt="Shenzyn Logo" /></a>
      </div>
      <div className="form-card__body col-lg-6 p-5 px-lg-8 d-flex align-items-center">
        <AddTraineesForm />
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