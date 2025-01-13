import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken');

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postTravelPolicy = createAsyncThunk(
    'travel/postTravelPolicy', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/travel-insurer`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postTravellerInfo = createAsyncThunk(
    'travel/postTravellerInfo', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/travelers`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postTravelInfo = createAsyncThunk(
    'travel/postTravelInfo', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/travel-customers`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteTravelInsurance = createAsyncThunk(
    'travel/deleteTravelInsurance', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.delete(`/travels/${initialData.travelId}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncTravelInsurance = createAsyncThunk(
    'travel/fetchAsyncTravelInsurance',
    async () => {
        try{
            const response = await InsuranceApi.get('/travel-insurer', {headers})
            return { success: true, data: response.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncProductByInsurer = createAsyncThunk(
    'travel/fetchAsyncProductByInsurer',
    async (initialData) => {
        try{
            const response = await InsuranceApi.get(`/travels/by-insurer/${initialData.insurerId}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const travelSlice = createSlice({
    name: 'travel',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        travelInsurance: [],
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
            .addCase(postTravelPolicy.pending, (state, action) => {

            })
            .addCase(postTravelPolicy.fulfilled, (state, action) => {

            })
            .addCase(postTravelPolicy.rejected, (state, action) => {

            })
            .addCase(deleteTravelInsurance.pending, (state, action) => {

            })
            .addCase(deleteTravelInsurance.fulfilled, (state, action) => {

            })
            .addCase(deleteTravelInsurance.rejected, (state, action) => {

            })
            .addCase(fetchAsyncTravelInsurance.pending, (state, action) => {

            })
            .addCase(fetchAsyncTravelInsurance.fulfilled, (state, action) => {
                state.travelInsurance = action.payload.data
            })
            .addCase(fetchAsyncTravelInsurance.rejected, (state, action) => {

            })
            .addCase(fetchAsyncProductByInsurer.pending, (state, action) => {

            })
            .addCase(fetchAsyncProductByInsurer.fulfilled, (state, action) => {
                state.travelInsurance = action.payload.data
            })
            .addCase(fetchAsyncProductByInsurer.rejected, (state, action) => {

            });
    }
})
export const travelActions = travelSlice.actions
export const getNavStatus = (state) =>  state.travel.status
export const getDropdownStatus = (state) =>  state.travel.dropdownStatus
export const getInvoiceStatus = (state) =>  state.travel.invoiceStatus
export const getTravelInsurance = (state) =>  state.travel.travelInsurance
export default travelSlice