import React from 'react';
import {  Divider } from 'antd';
// import Moment from 'react-moment';
import { withRouter } from 'react-router-dom'

class ProfileTrainingPartner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultCompanyLogo: "assets/partner/company_default.png",
        }
    }
    render() {
        // const eventData = this.props.clickedEventData;
        var profileData = this.props.basicData;

        return (

            <div style={{ borderRadius: '5px', boxShadow: '0px 0px 35px #00000029', background: '#fff', padding: '20px' }}>
                <h4>Personal Details</h4>

                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Profile Picture:</h5>
                    </div>
                    <div class="col-sm-8">
                        <img src={profileData.TrainingPartnerDetails && profileData.TrainingPartnerDetails.imgURL ? profileData.TrainingPartnerDetails.imgURL : 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png'} height='80px' width='80px' alt="Profile" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Name:</h5>
                    </div>
                    <div class="col-sm-8">
                        <p>{profileData.TrainingPartnerDetails && profileData.TrainingPartnerDetails.name ? profileData.TrainingPartnerDetails.name : "Not Found"}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Email:</h5>
                    </div>
                    <div class="col-sm-8">
                        <p>{profileData.emailId ? profileData.emailId:"Not Found" }</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Contact No:</h5>
                    </div>
                    <div class="col-sm-8">
                        <p>{profileData.contactNo ? profileData.contactNo:"Not Found" }</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Address:</h5>
                    </div>
                    <div class="col-sm-8">
                        <p>{profileData.TrainingPartnerDetails && profileData.TrainingPartnerDetails.address ? profileData.TrainingPartnerDetails.address:"Not Found" }</p>
                    </div>
                </div>
                <Divider />
                <h4>Professional Details</h4>
                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Experience:</h5>
                    </div>
                    <div class="col-sm-8">
                        <p>{profileData.TrainingPartnerDetails && profileData.TrainingPartnerDetails.PastTrainings_or_Experience ? profileData.TrainingPartnerDetails.PastTrainings_or_Experience:"Not Found" }</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Location:</h5>
                    </div>
                    <div class="col-sm-8">
                        <p>{profileData.TrainingPartnerDetails && profileData.TrainingPartnerDetails.location ? profileData.TrainingPartnerDetails.location:"Not Found" }</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 ">
                        <h5>Description:</h5>
                    </div>
                    <div class="col-sm-8">
                        <p>{profileData.TrainingPartnerDetails && profileData.TrainingPartnerDetails.TrainerDescription ? profileData.TrainingPartnerDetails.TrainerDescription:"Not Found" }</p>
                    </div>
                </div>

            </div>);
    }
}

export default withRouter(ProfileTrainingPartner);