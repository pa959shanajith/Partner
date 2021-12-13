import React from 'react';
import { Icon } from 'antd'
import JobPagesComponent from './job-pages/';

const StyleSheet_maxWidth = {
  maxWidth: '1000px',
  margin: 'auto'
}
const StyleSheet_maxWidth2 = {
  alignItems: 'center',
  justifyContent: 'center'
}
const StyleSheet_Heading3 = {
  color: '#707070',
  fontSize: '26px',
  fontWeight: '600',
  padding: '20px',
  float: 'left'
}

const AboutCompany = () => {
  return (
    <div className="row" style={StyleSheet_maxWidth2}>
      <div className="col-lg-12 container">
      {/* <h5 style={{ fontSize: '18px' }}><Icon type="left" />Back to Dashboard</h5> */}
        <div className="profile-card-v2 h-100 row" style={StyleSheet_maxWidth}>
          <h2 style={StyleSheet_Heading3}>Post a job</h2>
          <JobPagesComponent />
        </div>
      </div>
    </div>
  )
}

export default AboutCompany;