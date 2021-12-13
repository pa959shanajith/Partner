import { Icon, Layout } from 'antd';
import DEMO from 'constants/demoData';
import React from 'react';
const { Header } = Layout;

class Modal2 extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
}

class Modal3 extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
}

const Section = () => {
  return(
    <Header className="app-header">
      <div className="app-header-inner bg-white">
        <div className="header-left">
          <div className="list-unstyled list-inline">
            <a href={DEMO.link} className="list-inline-item"> <Icon type="menu-fold" className="list-icon" /> </a>
          </div>
        </div>

        <div className="header-right">
          <div className="list-unstyled list-inline">
            <div className="list-inline-item"><Modal2 /></div>
            <div className="list-inline-item"><Modal3 /></div>
          </div>
        </div>
      </div>
    </Header>
  );
}

export default Section;
