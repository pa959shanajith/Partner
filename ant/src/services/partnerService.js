import ServiceBase from './serviceBase'
import api from 'constants/pageRoutes';

export default class partnerService {
    email = localStorage.getItem('email');
    companyName = localStorage.getItem('companyName');
    // Getting List Of Degrees
    degrees() {
        return ServiceBase.get(api.endPointUrl.default + 'autocomplete/degrees');
    }
    // Locations List
    locations() {
        return ServiceBase.get(api.endPointUrl.default + 'autocomplete/locations');
    }
    // country codes
    getAllCountryCodes() {
        return ServiceBase.get(api.endPointUrl.default + 'autocomplete/countrycodes');
    }
    getBasicDetails() {
        return ServiceBase.get(api.endPointUrl.default + 'partner/getbasicdetails');
    }
    getPartnerCompanyDetails(companyName) {
        return ServiceBase.get(api.endPointUrl.default + 'partner/getPartnerCompanyDetails/' + companyName);
    }
    // get All Future Events
    getAllEvents() {
        return ServiceBase.get(api.endPointUrl.default + 'events/getAllEvents');
    }
    // get All Enrolled Events
    getAllEnrolledEvents(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/getAllSubscribedEvents', data)
    }
    getAllAssignedEvents(){
        return ServiceBase.get(api.endPointUrl.default + 'events/getallassignedevents')
    }
    // Enroll the Event
    enrollEvent(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/subscribed', data)
    }
    //Update profile 
    updateProfileDetails(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/updateProfileDetails', data)
    }
    // get All Recruiter Created by Partner
    //TODO : Dont send emaail parameter, it is in authcode
    getAllRecruiters() {
        return ServiceBase.get(api.endPointUrl.default + 'partner/profile')
    }

    // get List of Recruiter by Company Name
    getRecruiterbyCompanyName() {
        return ServiceBase.get(api.endPointUrl.default + 'partner/getrecruitersbycompanyname/' + this.companyName.replace(/['"]+/g, ''))
    }
    // Get All Cards Counts
    getCounts(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/getallcounts', data);
    }
    // Upload the Candidate Resume
    CandidateResumeParser(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/AddApplicant/resumeparser', data)
    }
    // Add profiles For Event
    addProfile(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/addprofiles', data);
    }
    // edit profiles
    editProfile(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/editprofiles', data);
    }
    // get All candidates after add profile
    getAllProfile(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/getallprofiles', data)
    }
    // get All candidates after add profile For Partner Admin
    getAllProfileForPartnerAdmin(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/getallprofilesforadmin', data)
    }

    // get profile match for a job/event and update table
    updateEventProfileMatch(data) {
        return ServiceBase.post(api.endPointUrl.default + 'recommendation/updateProfileMatch', data)
    }

    // Check Subscription
    //TODO : Subscription checks to be based on company, you need not send email as it is a protected route and you can get it from auth.
    // API call be to modified to fetch details by cmpany of requester and then change here
    getSubscription() {
        return ServiceBase.get(api.endPointUrl.default + 'payments/getsubscriptioninfo')
    }
    getPartnerSubscriptionforRecruiter(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/getsubscriptioninfoforrecruiter', data)
    }
    // get Training partner subscription info
    //TODO : Dont send emaail parameter, it is in authcode
    getTrainingSubscription() {
        return ServiceBase.get(api.endPointUrl.default + 'payments/gettrainingsubscriptioninfo')
    }
    // get Payment Details
    getPaymentDetails(data) {
        return ServiceBase.post(api.endPointUrl.default + 'payments/generatepartnerpaymentdetails', data)
    }
    // get Training Payment Details
    getTrainingPaymentDetails(data) {
        return ServiceBase.post(api.endPointUrl.default + 'payments/generatetrainingpartnerpaymentdetails', data)
    }
    // Partner Last Transaction Details
    //TODO : Dont send emaail parameter, it is in authcode
    getLastTransactions() {
        return ServiceBase.get(api.endPointUrl.default + 'payments/getlasttransactioninfo')
    }
    // training Partner Last Transaction Details
    //TODO : Dont send emaail parameter, it is in authcode
    getLastTrainingTransactions() {
        return ServiceBase.get(api.endPointUrl.default + 'payments/getlasttrainingtransactioninfo')
    }
    // set basic plan Details
    //TODO : Dont send emaail parameter, it is in authcode
    setBasicPlan() {
        return ServiceBase.get(api.endPointUrl.default + 'partner/setbasicplan')
    }

    // update Profile status
    updateProfileStatus(data) {
        return ServiceBase.post(api.endPointUrl.default + 'events/updatestatus', data)
    }
    // Create Training Partner Profile
    createTrainingPartner(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/createtrainingpartner', data);
    }
    // edit Training Partner Profile
    // EditTrainingPartner(data){
    //     return ServiceBase.post(api.endPointUrl.default+'partner/edittrainingpartner',data);
    // }

    // Create /Edit Training partner professional Details
    createProfessionDetails(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/createprofessionaldetails', data);
    }
    // Create Training Event
    createTrainingEvent(data) {
        return ServiceBase.post(api.endPointUrl.default + 'training/createtrainingevent', data);
    }
    // Edit Training Event
    editTrainingEvent(data) {
        return ServiceBase.post(api.endPointUrl.default + 'training/edittrainingevent', data);
    }
    //get the List of Training Event
    //TODO : Dont send emaail parameter, it is in authcode
    getTrainingEvent() {
        return ServiceBase.get(api.endPointUrl.default + 'training/getalltraining');
    }
    // get Training Event Based on _id
    getClickedTraining(data) {
        return ServiceBase.post(api.endPointUrl.default + 'training/getclickedtraining', data)
    }
    //upload profile pic
    uploadprofilepic(data) {
        return ServiceBase.post(api.endPointUrl.default + 'training/uploadlogo', data)
    }
    // inivite all participant
    inviteallparticipants(data) {
        return ServiceBase.post(api.endPointUrl.default + 'training/inviteall', data);
    }
    // invite single partcipant
    inviteParticipant(data) {
        return ServiceBase.post(api.endPointUrl.default + 'training/invite', data);
    }
    // get Training details
    getTraining(data) {
        return ServiceBase.get(api.endPointUrl.default + 'training/gettraining/' + data.trainingId);
    }

    getOTPDetails(code) {
        return ServiceBase.get(api.endPointUrl.default + 'payments/generatepartnerotpdetails/' + code);
    }
    getLastOTPTxnDetails(email) {
        // return ServiceBase.get(api.endPointUrl.default + 'payments/generatepartnerotpdetails/' + code);
        return ServiceBase.get(api.endPointUrl.default + 'payments/getlastOTPtransactioninfo/' + email)
    }

    // getAdvancedDetails() {
    //     return ServiceBase.get(api.endPointUrl.default + 'company/getadvancedetails');
    // }
    // updateBasicDetails(emailId, updateData) {
    //     return ServiceBase.put(api.endPointUrl.default + 'company/updatebasicdetails/' + emailId.replace(/['"]+/g, ''), updateData);
    // }
    // updateAdvanceDetails(emailId, updateData) {
    //     return ServiceBase.put(api.endPointUrl.default + 'company/updateadvancedetails/' + emailId.replace(/['"]+/g, ''), updateData);
    // }
    // getJobStats(data) {
    //     var email = data.emailId;
    //     return ServiceBase.get(api.endPointUrl.default + 'company/getjobstats', email);
    // }
    // //get all posted jobs for dashboard
    getAllPostedJobs(companyName) {
        return ServiceBase.get(api.endPointUrl.default + 'company/getallpostedjobsbycompany/' + companyName);
    }
    // //update company profile
    // updatecompanydetails(updateData) {
    //     return ServiceBase.put(api.endPointUrl.default + 'company/updatecompanydetails/' + this.email.replace(/['"]+/g, ''), updateData);
    // }
    //update job details - job posting
    // updatejobpostingjobdetails(updateData) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/postjobdetails', updateData);
    // }
    //update candidate details - job posting
    // updatejobpostingcandidatedetails(updateData) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/postcandidatedetails', updateData);
    // }
    //update education details - job posting
    // async updatejobpostingeducationdetails(updateData) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/posteducationdetails', updateData);
    // }
    //update response details - job posting
    // updatejobpostingresponseetails(updateData) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/postmanageresponses', updateData);
    // }
    //reject a job posting - by admin
    // rejectjobposting(updateData) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/rejectjobpost', updateData);
    // }
    //approve a job posting - by admin
    // approvejobposting(updateData) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/approvejobpost', updateData);
    // }
    //get a job posting details - by job id
    // getjobdetails(jobId) {
    //     return ServiceBase.get(api.endPointUrl.default + 'recruiter/getjobdetails/' + jobId.replace(/['"]+/g, ''));
    // }
    //get candidate details for a job posting- by job id
    // getcandidatedetailsforjobpost(jobId) {
    //     return ServiceBase.get(api.endPointUrl.default + 'recruiter/getcandidatedetails/' + jobId.replace(/['"]+/g, ''));
    // }
    //get educational details for a job posting- by job id
    // geteducationaldetailsforjobpost(jobId) {
    //     return ServiceBase.get(api.endPointUrl.default + 'recruiter/geteducationaldetails/' + jobId.replace(/['"]+/g, ''));
    // }
    //get response details - job posting
    // getjobpostingresponseetails(jobId) {
    //     return ServiceBase.get(api.endPointUrl.default + 'recruiter/getmanageresponses/' + jobId.replace(/['"]+/g, ''));
    // }
    //get all active jobs - returns based on role
    // getallactivejobpost(emailId, companyName, isRecruiter) {
    //     if (isRecruiter) {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getallactivepostedjobsbyrecruiter/' + emailId.replace(/['"]+/g, ''));
    //     }
    //     else {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getallactivepostedjobsbycompany/' + companyName.replace(/['"]+/g, ''));
    //     }
    // }
    //get all active jobs - returns based on role
    // getallinactivejobpost(emailId, companyName, isRecruiter) {
    //     if (isRecruiter) {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getallinactivepostedjobsbyrecruiter/' + emailId.replace(/['"]+/g, ''));
    //     }
    //     else {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getallinactivepostedjobsbycompany/' + companyName.replace(/['"]+/g, ''));
    //     }
    // }

    //get job applicants for a given job id
    // getapplicantdetails(jobId) {
    //     return ServiceBase.post(api.endPointUrl.default + 'company/getapplicantsdetails', { "list": jobId });
    // }
    // //shortlist a job
    // shortlistjob(data) {
    //     return ServiceBase.post(api.endPointUrl.default + 'company/shortlist', data);
    // }
    //shortlist a job
    // shortlistjob(data) {
    //     return ServiceBase.post(api.endPointUrl.default + 'company/shortlist', data);
    // }

    //get recruiters for a company
    // getrecruiterlistforcompany(companyName) {
    //     return ServiceBase.get(api.endPointUrl.default + 'recruiter/getrecruitersbycompanyname/' + companyName);
    // }
    //get recruiters basic details
    getrecruiterbasicdetails(emailId) {
        return ServiceBase.get(api.endPointUrl.default + 'recruiter/profile/' + emailId);
    }

    // // upload a logo for company
    // uploadlogofiletos3(data) {
    //     return ServiceBase.post(api.endPointUrl.default + 'company/savetos3/Logos', data);
    // }

    // // upload cover image for company
    // uploadlogofiletos3(formData) {
    //     return ServiceBase.post(api.endPointUrl.default + 'company/updatecoverphoto', formData);
    // }

    //get job applicant count for active jobs - returns based on role
    // getjobaplicantscount(emailId, companyName, isRecruiter) {
    //     if (isRecruiter) {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getapplicantscountforactivejobsbyrecruiter/' + emailId.replace(/['"]+/g, ''));
    //     }
    //     else {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getapplicantscountforactivejobsbycompany/' + companyName.replace(/['"]+/g, ''));
    //     }
    // }

    //get active jobs count- returns based on role
    // getactivejobscount(emailId, companyName, isRecruiter) {
    //     if (isRecruiter) {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getactivepostedjobscountbyrecruiter/' + emailId.replace(/['"]+/g, ''));
    //     }
    //     else {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getactivepostedjobscountbycompany/' + companyName.replace(/['"]+/g, ''));
    //     }
    // }

    //get in active jobs count- returns based on role
    // getinactivejobscount(emailId, companyName, isRecruiter) {
    //     if (isRecruiter) {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getinactivepostedjobscountbyrecruiter/' + emailId.replace(/['"]+/g, ''));
    //     }
    //     else {
    //         return ServiceBase.get(api.endPointUrl.default + 'recruiter/getinactivepostedjobscountbycompany/' + companyName.replace(/['"]+/g, ''));
    //     }
    // }

    // generatejobid(data) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/generatejobid', data);
    // }
    // uploadVideoJD(data, jobId) {
    //     return ServiceBase.post(api.endPointUrl.default + 'recruiter/uploadVideo/' + jobId, data);
    // }
    // getDraftJobs(companyName) {
    //     return ServiceBase.get(api.endPointUrl.default + 'recruiter/getdraftjobsbycompany/' + companyName);
    // }

    // getPendingJobs(companyName) {
    //     return ServiceBase.get(api.endPointUrl.default + 'recruiter/getjobspendingapprovalbycompany/' + companyName);
    // }
    //save video jd from file
    // saveVideoJDfromFile(data, jobId) {
    //     return ServiceBase.post(api.endPointUrl.default + "recruiter/saveVideo/VideoJDs/" + jobId, data);
    // }
    // //get recruiter details
    getrecruiterdetailsbyid(emailId) {
        return ServiceBase.get(api.endPointUrl.default + 'partner/getrecruiterprofile/' + emailId);
    }
    // get all recruiters in a commpany
    getrecruitersbycompany(companyName) {
        return ServiceBase.get(api.endPointUrl.default + 'recruiter/getrecruitersbycompanyname/' + companyName);
    }
    //add new recruiter
    createrecruiterdetails(updateData) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/registerrecruiter', updateData);
    }
    //update recruiter details
    updaterecruiterdetails(updateData, emailId) {
        return ServiceBase.put(api.endPointUrl.default + 'partner/updatebasicdetails/' + emailId.replace(/['"]+/g, ''), updateData);
    }
    //deactiavte new recruiter
    deactivaterecruiter(recruiterData) {
        return ServiceBase.put(api.endPointUrl.default + 'partner/deactivateRecruiter/' + recruiterData.emailId.replace(/['"]+/g, '') + '/' + recruiterData.name, {});
    }

    generateEvent(postData) {
        return ServiceBase.post(api.endPointUrl.default + 'events/generateeventid/', postData);
    }
    getEvents(companyName) {
        return ServiceBase.get(api.endPointUrl.default + 'events/geteventsbycompany/' + companyName);
    }
    inactiveEvents(eventId) {
        return ServiceBase.put(api.endPointUrl.default + 'events/inactive/', { eventId: eventId });
    }
    postEventDtls(eventData) {
        return ServiceBase.post(api.endPointUrl.default + 'events/posteventdetails/', eventData);
    }
    // Getting Profiles for invite based on Search
    getTraineeProfile(data) {
        return ServiceBase.post(api.endPointUrl.default + 'search/profilesearchregex', data);
    }
    // Get All Training REgistered Profiles
    getallRegisteredProfile(data) {
        return ServiceBase.post(api.endPointUrl.default + 'training/getallregisteredprofiles', data);
    }

    // Shortlist a Job
    shortlistJob(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/shortlistJob', data);
    }
    // get List of shortlisted jobs for Partner Recruiter
    getShortlistedJobs(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/getallshortlistedjobs', data);
    }
    getAllAssignedJobs(){
        return ServiceBase.get(api.endPointUrl.default + 'partner/getallassignedjobs');
    }
    // Add profiles For Job
    addJobCandidateProfileTo(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/addcandidateprofiles', data);
    }
    // edit profiles
    updateJobCandidateProfile(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/updatecandidateprofiles', data);
    }
    // get All candidates after add profile
    getAllJobCandidateProfiles(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/getallcandidateprofiles', data)
    }
    // Upload the Candidate Resume
    uploadResume(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/AddApplicant/resumeparser', data)
    }
    unlistJob(data) {
        return ServiceBase.put(api.endPointUrl.default + 'partner/unlistjob', data);
    }

    getNetProfileSubmissions(data) {
        return ServiceBase.get(api.endPointUrl.default + `partner/getnetProfiles?partnerCompanyName=${data.partnerCompanyName}&partnerEmail=${data.partnerEmail}`,)
    }

    postBankDetails(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/accountdetails', data)
    }
    getBankDetails(data) {
        return ServiceBase.get(api.endPointUrl.default + `partner/accountdetails?partnerEmail=${data.email}`)
    }

    getProfilesubmissioncreditsDetails(data) {
        return ServiceBase.get(api.endPointUrl.default + 'partner/Profilesubmissioncredits/' + data)
    }

    updateJobStatus(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/updateJobstatus', data)
    }

    validateTPOEmail(email) {
        return ServiceBase.get(api.endPointUrl.default + 'partner/validateTPOEmailId/' + email)
    }

    addTraineesToJobSeeker(token, data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/addTraineesToJobseeker/' + token, { data: data })
    }
    getProfileRankScore(data) {
        return ServiceBase.post(api.endPointUrl.default + 'recommendation/profilepercentilescore', data)
    }
    requestAdminToAddCompanyToGrantee(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/requestAdminToAddCompanyToGranteeList', data)
    }
    getJobCount(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/getJobcount', data)
    }
    getAssignedCompanies(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/getAssignedCompanies/', data)
    }
    jobAssigntoRecruiter(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/jobassigntorecruiter',data)
    }
    eventAssigntoRecruiter(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/eventassigntorecruiter',data)
    }
    getEventAndJobsApplicants(data){
        return ServiceBase.post(api.endPointUrl.default + 'partner/getEventAndJobsApplicants', data)
    }
    changePassword(data,isPartner) {
        if(isPartner === "true"){
        return ServiceBase.post(api.endPointUrl.default + 'partner/changePasswordPartner', data)
        }else{
            return ServiceBase.post(api.endPointUrl.default + 'partner/changePasswordPartnerRecruiter', data)
        }
    }
    sendMailNotificationToRecruiter(data) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/mailNotificationOfJobAssignToRecruiter', data)
    }
}