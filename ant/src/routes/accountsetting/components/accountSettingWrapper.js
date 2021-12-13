import React from 'react';
import AccountForm from './AccountForm'
import ProfileSubmissionCredits from './ProfileSubmissionCredits'
import {Tabs,Icon} from 'antd';

const { TabPane } = Tabs;
const AccountSettingWrapper = (props) => {

    const callback = (key) => {
        console.log(key)
    }
   const redirectToDashboard = () => {
      props.history.push('/app/dashboard')
    }
    return (
      <>
      <h5 
      onClick={redirectToDashboard} 
      style={{
            fontSize: '14px',
           padding:'5px 10px',
            margin: 'auto',
            cursor: 'pointer',
            backgroundColor:'white'
          }}><Icon type="left" />Back to dashboard</h5>
        <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane id="Partner_account_ProfileSubmissionCredits" tab="Profile Submission Credits" key="1">
          <ProfileSubmissionCredits />
        </TabPane>
        <TabPane id="Partner_account_ProfileSelectionCredits" tab="Profile Selection Credits" key="2">
          Profile Selection Credits
        </TabPane>
        <TabPane id="Partner_Accounts" tab="Accounts" key="3">
          <AccountForm/>
        </TabPane>
      </Tabs>
      
      </>
    )
}

export default AccountSettingWrapper