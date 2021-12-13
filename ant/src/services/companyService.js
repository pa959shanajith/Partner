import ServiceBase from './serviceBase'
import api from 'constants/pageRoutes';

export default class companyService {
    getAllCompanies(category) {
        return ServiceBase.get(api.endPointUrl.default + 'company/getcompanies/'+ category);
    }

    addQuires(data)
    {
    return ServiceBase.post(api.endPointUrl.default + 'company/addQuire', data);
}

getQuires(id)
{
    return ServiceBase.get(api.endPointUrl.default + 'company/getQuires/' + id);

}

}