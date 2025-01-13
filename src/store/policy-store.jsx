import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postPolicy = createAsyncThunk(
    'policy/postPolicy', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/policy-types`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const updatePolicy = createAsyncThunk(
    'policy/updatePolicy',
      async (initialData)=>{
        try{
            const response = await InsuranceApi.put(`/policy-types/${initialData.id}`, initialData.data, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deletePolicy = createAsyncThunk(
    'product/deletePolicy', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.delete(`/policy-types/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncPolicy = createAsyncThunk(
    'policy/fetchAsyncPolicy',
    async () => {
        try{
            const response = await InsuranceApi.get('/policy-types', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncPolicyByCategory = createAsyncThunk(
    'policy/fetchAsyncPolicyByCategory',
    async (initialData) => {
        try{
            const response = await InsuranceApi.get(`/policy-types/category/${initialData.id}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const policySlice = createSlice({
    name: 'policy',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        policies: []
    },
    reducers: {
        toggleNav(state, action){
            state.status = action.payload
        },
        toggleDropdown(state, action){
            console.log("action",action.payload.state)
            state.dropdownStatus = action.payload.state
        },
        toggleInvoice(state, action){
            state.invoiceStatus = action.payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(postPolicy.pending, (state, action) => {

            })
            .addCase(postPolicy.fulfilled, (state, action) => {

            })
            .addCase(postPolicy.rejected, (state, action) => {

            })
            .addCase(updatePolicy.pending, (state, action) => {

            })
            .addCase(updatePolicy.fulfilled, (state, action) => {
                const updatedPolicy = action.payload.data;
                const updatedPolicies = state.policies.map((policy) => {
                  if (policy.policyTypeId === updatedPolicy.policyTypeId) {
                    return updatedPolicy; 
                  }
                  return policy;
                });
                state.policies = updatedPolicies;
            })
            .addCase(updatePolicy.rejected, (state, action) => {
                
            })
            .addCase(fetchAsyncPolicy.pending, (state, action) => {

            })
            .addCase(fetchAsyncPolicy.fulfilled, (state, action) => {
                state.policies = action.payload.data
            })
            .addCase(fetchAsyncPolicy.rejected, (state, action) => {

            });
    }
})
export const policyActions = policySlice.actions
export const getNavStatus = (state) =>  state.policy.status
export const getDropdownStatus = (state) =>  state.policy.dropdownStatus
export const getInvoiceStatus = (state) =>  state.policy.invoiceStatus
export const getPolicies = (state) =>  state.policy.policies
export default policySlice