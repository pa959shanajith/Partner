import React from 'react';
import QueueAnim from 'rc-queue-anim';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ResetPassword from './ResetPassword';


const Article1 = () => (
  <article className="article">
    <h2 className="article-title">Login</h2>
    <div className="box box-default">
      <div className="box-body p-5">
        <LoginForm />
      </div>
    </div>
  </article>
);

const Article2 = () => (
  <article className="article">
    <h2 className="article-title">Sign Up</h2>
    <div className="box box-default">
      <div className="box-body p-5">
        <SignUpForm />
      </div>
    </div>
  </article>
);

const Article3 = () => (
  <article className="article">
    <h2 className="article-title">Reset Password</h2>
    <div className="box box-default">
      <div className="box-body p-5">
        <ResetPassword />
      </div>
    </div>
  </article>
);


const Page = () => {
  return(
    <div className="container-fluid container-mw-md chapter">
      <QueueAnim type="bottom" className="ui-animate">
        <div className="article__section" key="1"> <Article1 /> </div>
        <div className="article__section" key="2"> <Article2 /> </div>
        <div className="article__section" key="3"> <Article3 /> </div>
      </QueueAnim>
    </div>
  )
}

export default Page;