import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import NgrokApi from "../components/api/NgrokApi"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postInsurer = createAsyncThunk(
    'insurer/postInsurer', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/insurers`, initialData, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncInsurer = createAsyncThunk(
    'insurer/fetchAsyncInsurer',
    async () => {
        try{
            const response = await InsuranceApi.get('/insurers', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const updateInsurer = createAsyncThunk(
    'insurer/updateInsurer',
      async (initialData)=>{
        try{
            const response = await InsuranceApi.put(`/insurers/${initialData.id}`, initialData.data, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteInsurer = createAsyncThunk(
    'insurer/deleteInsurer', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.delete(`/insurers/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

const insurerSlice = createSlice({
    name: 'insurer',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        insurers: []
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
            .addCase(postInsurer.pending, (state, action) => {

            })
            .addCase(postInsurer.fulfilled, (state, action) => {

            })
            .addCase(postInsurer.rejected, (state, action) => {

            })
            .addCase(updateInsurer.pending, (state, action) => {

            })
            .addCase(updateInsurer.fulfilled, (state, action) => {
                const updatedInsurer = action.payload.data;
                const updatedInsurers = state.insurers.map((insurer) => {
                    if (insurer.insurerId === updatedInsurer.insurerId) {
                        return updatedInsurer; // Update the specific row with the updated insurer
                    }
                    return insurer;
                });
                state.insurers = updatedInsurers;
            })
            .addCase(updateInsurer.rejected, (state, action) => {
                
            })
            .addCase(fetchAsyncInsurer.pending, (state, action) => {

            })
            .addCase(fetchAsyncInsurer.fulfilled, (state, action) => {
                state.insurers = action.payload.data
            })
            .addCase(fetchAsyncInsurer.rejected, (state, action) => {

            });
    }
})
export const insurerActions = insurerSlice.actions
export const getNavStatus = (state) =>  state.insurer.status
export const getDropdownStatus = (state) =>  state.insurer.dropdownStatus
export const getInvoiceStatus = (state) =>  state.insurer.invoiceStatus
export const getInsurers = (state) =>  state.insurer.insurers
export default insurerSlice