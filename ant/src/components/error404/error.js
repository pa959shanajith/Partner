import React from 'react';
import { NavLink } from "react-router-dom";

import { Result, Button } from 'antd';
const Error = (props) => {
  return (
    <>
  <Result
    status="404"
    style={{height:props.height}}
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<NavLink to={props.link}><Button type="primary">Back Home</Button></NavLink>}
  />

  </>
  )
}

export default Error;