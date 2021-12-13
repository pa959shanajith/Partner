import React from 'react';
import { Steps } from 'antd';
const Step = Steps.Step;

const Box = () => {
  return(
    <div className="box box-default">
      <div className="box-header">Vertical mini version</div>
      <div className="box-body">
        <Steps direction="vertical" size="small" current={1}>
          <Step title="Finished" description="This is a description." />
          <Step title="In Progress" description="This is a description." />
          <Step title="Waiting" description="This is a description." />
        </Steps>
      </div>
    </div>
  )
}

export default Box;