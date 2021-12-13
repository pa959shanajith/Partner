import ServiceBase from './serviceBase'
import api from 'constants/pageRoutes';

export default class Jobseeker {
    Bearer = "Bearer ";
    // Getting Jobseeker Profile
    jobseekerProfile(data) {
        var email = data.emailId;
        return ServiceBase.get(api.endPointUrl.default + 'jobseekers/profile/' + email.replace(/['"]+/g, ''));
    }
    // getting job conunt ex:SavedJobs,AppliedJobs
    getCount(data) {
        return ServiceBase.get(api.endPointUrl.default + 'jobseekers/getsavedandappliedjobscount');
    }
    // Job Search After Jobseeker Login
    search(data) {
      return ServiceBase.post(api.endPointUrl.default + 'search/jobsearch', data);
    }
    
  // Locations List
  locations() {
    return ServiceBase.get(api.endPointUrl.default + 'autocomplete/locations');
  }
  
  //get Company Based On Company Name
  getCompany(data) {
    return ServiceBase.get(api.endPointUrl.default + 'company/getcompanybyname/' + data);
  }
  checkVideoContent(data) {
    return ServiceBase.post(api.endPointUrl.default + 'jobseekers/getcontentmoderationstatus', data);
  }
  // save Job
  saveJob(data) {
    return ServiceBase.put(api.endPointUrl.default + 'jobseekers/savejob', data);
  }
  uploadresume(data) {
    return ServiceBase.post(api.endPointUrl.default + 'jobseekers/resumeparserprelogin', data)
  }
  campaignRegister(data) {
    return ServiceBase.post(api.endPointUrl.default + 'jobseekers/campaignregister', data);
  }
}