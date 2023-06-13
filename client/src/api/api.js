import {commonrequest} from "./ApiCall"
import {BASE_URL} from "./helper"

export const registerFunc = async(data,header)=>{
    return await commonrequest("POST",`${BASE_URL}/api/user/register`,data,header);
};

export const loginFunc = async(data,header)=>{
    return await commonrequest("POST",`${BASE_URL}/api/user/login`,data,header);
};

