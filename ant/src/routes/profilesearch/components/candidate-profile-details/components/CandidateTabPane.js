import { Collapse, Icon, Tabs } from 'antd';
import React from 'react';
import Moment from 'react-moment';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

class CandidateTabPane extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="mt-1 mb-4">
                <div className="profile-box-detail row">
                    <Tabs>
                        <TabPane tab="Personal Details" key="1">
                            <div className="pl-2">
                                <h4>Full Name</h4>
                                <p>Diljit</p>
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Date of Birth</h4>
                                {/* <p>{e.DOB}</p> */}
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Email ID</h4>
                                {/* <p>{e.emailId}</p> */}
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Contact Number</h4>
                                {/* <p>{e.contactNo}</p> */}
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Current Location</h4>
                                {/* <p>{e.currentLocation}</p> */}
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Nationality</h4>
                                {/* <p>{e.nationality}</p> */}
                            </div>
                        </TabPane>

                        <TabPane tab="Education" key="2">
                            {/* {e.educationDetails.map((ed, index) => ( */}
                            <div className="pl-2">
                                {/* <Collapse bordered={false} defaultActiveKey={['1']}> */}
                                <Collapse bordered={false}>
                                    {/* <Panel header={`Education ${index + 1}`} key="1"> */}
                                    <Panel header="Education" key="1">
                                        <div className="pl-2">
                                            <h4>Highest Qualifications</h4>
                                            {/* <p>{ed.highestQualification}</p> */}
                                            <div className="divider divider-solid mb-1"></div>
                                            <h4>Degree</h4>
                                            {/* <p>{ed.degree}</p> */}
                                            <div className="divider divider-solid mb-1"></div>
                                            <h4>Specialization</h4>
                                            {/* <p>{ed.specialization}</p> */}
                                            <div className="divider divider-solid mb-1"></div>
                                            <h4>Institute</h4>
                                            {/* <p>{ed.institute}</p> */}
                                            <div className="divider divider-solid mb-1"></div>
                                            <h4>Education Type</h4>
                                            {/* <p>{ed.educationType}</p> */}
                                            <div className="divider divider-solid mb-1"></div>
                                            <h4>Passing Year and Month</h4>
                                            <Moment format="YYYY MMM">
                                                {/* {ed.passingYear} */}
                                            </Moment>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>
                            {/* ))} */}
                        </TabPane>

                        {/* {e.isFresher == false ? */}
                        <TabPane tab="Employment" key="3">

                            {/* {e.workExperiences.map((work, index) => ( */}
                            <div className="pl-2">
                                {/* <Collapse bordered={false} defaultActiveKey={['1']}> */}
                                <Collapse bordered={false}>
                                    {/* <Panel header={`Employment ${index + 1}`} key="1"> */}
                                    <Panel header="Employment" key="1">
                                        <div className="divider divider-solid mb-1"></div>
                                        <h4>Current Designation</h4>
                                        {/* <p>{work.currentDesignation}</p> */}
                                        <div className="divider divider-solid mb-1"></div>
                                        <h4>Current Company</h4>
                                        {/* <p>{work.currentCompany}</p> */}
                                        <div className="divider divider-solid mb-1"></div>
                                        <h4>Current CTC</h4>
                                        {/* <p>{this.Currency(parseInt(work.currentCtc))}</p> */}
                                        <div className="divider divider-solid mb-1"></div>
                                        <h4>Joining Date in Current Company</h4>
                                        <Moment format="YYYY/MM/DD">
                                            {/* {work.joiningDate} */}
                                        </Moment>
                                        <div className="divider divider-solid mb-1"></div>
                                        <h4>Is on Notice Period?</h4>
                                        {/* <p>{work.servingNoticePeriod == true ? 'Yes' : 'No'}</p> */}
                                        <div className="divider divider-solid mb-1"></div>
                                        <h4>Description</h4>
                                        {/* <p>{work.employmentDescription}</p> */}
                                    </Panel>
                                </Collapse>
                            </div>
                            {/* // ))} */}
                            {/* </TabPane> : */}
                        </TabPane>
                        <TabPane tab="Employment" key="4">
                            <div className='d-flex justify-content-center'>
                                <span className="mr-2"><Icon type="frown" /></span><span> No More Details About Employment !!!</span>
                            </div>
                        </TabPane>
                        {/* }   */}

                        <TabPane tab="Projects " key="5">
                            {/* {e.projects.map((d, index) => ( */}
                            <div className="pl-2">
                                {/* <Collapse bordered={false} defaultActiveKey={['1']}> */}
                                <Collapse bordered={false} >
                                    {/* <Panel header={`Project ${index + 1}`} key="1"> */}
                                    <Panel header="Project" key="1">
                                        {/* <h4><strong>Title</strong>: {d.projectTitle}</h4> */}
                                        <h4>Skills : <span>
                                            {/* {d.skillsUtilized.map((s) => s)} */}
                                        </span>
                                        </h4>
                                        <h4>Description : </h4>
                                        {/* <p>{d.projectDescription}</p> */}
                                    </Panel>
                                </Collapse>
                            </div>
                            {/* ))} */}
                        </TabPane>

                        <TabPane tab="Skills " key="6">
                            {/* {e.technicalSkills.map((ts) => ( */}
                            <div className="pl-2">
                                {/* <h4>{ts.skillName}</h4> */}
                                {/* <p>Proficiency : <span><Rate disabled defaultValue={parseInt(ts.skillLevel)} /></span></p> */}
                            </div>
                            {/* ))} */}
                            {/* {e.certifications.map((cer, index) => ( */}
                            <div className="pl-2">
                                {/* <Collapse bordered={false} defaultActiveKey={[]}> */}
                                <Collapse bordered={false}>
                                    {/* <Panel header={`Certification ${index + 1}`} key="1"> */}
                                    <Panel header="Certification" key="1">
                                        {/* <h4>Certification Name : {cer.certificationName}</h4> */}
                                        <h4>Certification Name : </h4>
                                        <h4>Certification Authority : <span>
                                            {/* {cer.certificationBody} */}
                                        </span>
                                        </h4>
                                    </Panel>
                                </Collapse>
                            </div>
                            {/* ))} */}
                        </TabPane>

                        <TabPane tab="Preferences " key="7">
                            <div className="pl-2">
                                <h4>Company Size</h4>
                                {/* <p>{e.preferredCompanies[0].companySize}({this.companySizeCheck(e.preferredCompanies[0].companySize)})</p> */}
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Top Companies of your preference</h4>
                                {/* {e.preferredCompanies.map((comp) => (
                                <p>
                                    {comp.companyName.map((cmpName) => (
                                        <span>
                                            {cmpName},
                                        </span>
                                    )
                                    )}
                                </p>
                            ))} */}
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Desired Annual CTC (in Lakhs)</h4>
                                {/* <p>{this.Currency(e.preferredCompanies[0].desiredCTC)}</p> */}
                                {/* <p>20 LPA</p> */}
                                <div className="divider divider-solid mb-1"></div>
                                <h4>Preferred Location(s)</h4>
                                <p>
                                    {/* {e.preferredLocation.map((loc) => (<span>{loc},</span>))} */}
                                </p>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }

}

export default CandidateTabPane;