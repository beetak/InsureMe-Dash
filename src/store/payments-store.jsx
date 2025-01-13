import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import PaymentsApi from "../components/api/PaymentsApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postVehicleInfo = createAsyncThunk(
    'vehicleInfo/postVehicleInfo', 
      async (initialData)=>{
        try{
            const response = await PaymentsApi.post(`/vehicle_info`, initialData, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchVehicleInfo = createAsyncThunk(
    'vehicleInfo/fetchVehicleInfo', 
      async ({registrationNumber})=>{
        try{
            const response = await PaymentsApi.get(`/vehicle_info/registration/${registrationNumber}`,  {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchTransaction = createAsyncThunk(
    'vehicleInfo/fetchTransaction', 
      async ({referenceId})=>{
        try{
            const response = await PaymentsApi.get(`/payments/ref/${referenceId}`,  {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchSalesByDate = createAsyncThunk(
    'vehicleInfo/fetchSalesByDate', 
      async ({transactionDate})=>{
        try{
            const response = await PaymentsApi.get(`/payments/daily/Transactions/${transactionDate}`,  {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchSalesByDateRange = createAsyncThunk(
    'vehicleInfo/fetchSalesByDateRange', 
      async ({startDate, endDate})=>{
        try{
            const response = await PaymentsApi.get(`/payments/all-payments/currency-total/start-date/end-date?startDate=${startDate}&endDate=${endDate}`,  {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postPayment = createAsyncThunk(
    'vehicleInfo/postPayment', 
      async (initialData)=>{
        try{
            const response = await PaymentsApi.post(`/payments`, initialData, {headers})
            return {success: true, data: response}
        }
        catch(error){
            return {success: false}
        }
    }
)

const vehicleInfoSlice = createSlice({
    name: 'vehicleInfo',
    initialState: {
        vehicleInformation: [],
        paymentDetails: []
    },
    reducers: {
        clearVehicleInfo(state, action){
            state.vehicleInformation = []
        },
    },
    extraReducers: builder => {
        builder
            .addCase(postVehicleInfo.pending, (state, action) => {

            })
            .addCase(postVehicleInfo.fulfilled, (state, action) => {

            })
            .addCase(postVehicleInfo.rejected, (state, action) => {

            })
            .addCase(postPayment.pending, (state, action) => {

            })
            .addCase(postPayment.fulfilled, (state, action) => {
                state.paymentDetails = action.payload.data
            })
            .addCase(postPayment.rejected, (state, action) => {

            })
            .addCase(fetchTransaction.pending, (state, action) => {

            })
            .addCase(fetchTransaction.fulfilled, (state, action) => {
                state.paymentDetails = action.payload.data
            })
            .addCase(fetchTransaction.rejected, (state, action) => {

            })
            .addCase(fetchVehicleInfo.pending, (state, action) => {

            })
            .addCase(fetchVehicleInfo.fulfilled, (state, action) => {                
                // console.log("vehic ", action.payload.data)
                state.vehicleInformation = action.payload.data
            })
            .addCase(fetchVehicleInfo.rejected, (state, action) => {

            })
    }
})
export const vehicleInfoActions = vehicleInfoSlice.actions
export const getVehicleInformation = (state) =>  state.vehicleInfo.vehicleInformation
export const getPaymentDetails = (state) =>  state.vehicleInfo.paymentDetails
export default vehicleInfoSlice