import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken');

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postVehicleInsurance = createAsyncThunk(
    'vehicle/postVehicleInsurance', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/vehicle-insurance`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const updateVehicleInsurance = createAsyncThunk(
    'vehicle/updateVehicleInsurance',
      async (initialData)=>{
        try{
            console.log("data ", initialData.data)
            const response = await InsuranceApi.put(`/vehicle-insurance/${initialData.id}`, initialData.data)
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteVehicleInsurance = createAsyncThunk(
    'vehicle/deleteVehicleInsurance', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.delete(`/vehicle-insurance/${initialData.insuranceId}`)
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncVehicleInsuranace = createAsyncThunk(
    'vehicle/fetchAsyncVehicleInsuranace',
    async () => {
        try{
            const response = await InsuranceApi.get('/vehicle-insurance', {headers})
            return { success: true, data: response.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncVehicleClasses = createAsyncThunk(
    'vehicle/fetchAsyncVehicleClasses',
    async () => {
        try{
            const response = await InsuranceApi.get('/vehicle-class', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncVehicleInsuranceByInsurer = createAsyncThunk(
    'vehicle/fetchAsyncVehicleInsuranceByInsurer',
    async (initialData) => {
        try{
            const response = await InsuranceApi.get(`/vehicle-insurance/${initialData.insurerId}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        vehicleInsurance: [],
        vehicleClasses: []
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
            .addCase(postVehicleInsurance.pending, (state, action) => {

            })
            .addCase(postVehicleInsurance.fulfilled, (state, action) => {

            })
            .addCase(postVehicleInsurance.rejected, (state, action) => {

            })
            .addCase(deleteVehicleInsurance.pending, (state, action) => {

            })
            .addCase(deleteVehicleInsurance.fulfilled, (state, action) => {

            })
            .addCase(deleteVehicleInsurance.rejected, (state, action) => {
            })
            .addCase(fetchAsyncVehicleInsuranace.pending, (state, action) => {
                console.log("fetch pending ", action.payload.data)
            })
            .addCase(fetchAsyncVehicleInsuranace.fulfilled, (state, action) => {
                console.log("fetch successful ", action.payload.data)
                state.vehicleInsurance = action.payload.data
            })
            .addCase(fetchAsyncVehicleInsuranace.rejected, (state, action) => {
                console.log("fetch failed ", action.payload.data)
            })
            .addCase(fetchAsyncVehicleClasses.pending, (state, action) => {

            })
            .addCase(fetchAsyncVehicleClasses.fulfilled, (state, action) => {
                state.vehicleClasses = action.payload.data
            })
            .addCase(fetchAsyncVehicleClasses.rejected, (state, action) => {

            })
            .addCase(fetchAsyncVehicleInsuranceByInsurer.pending, (state, action) => {

            })
            .addCase(fetchAsyncVehicleInsuranceByInsurer.fulfilled, (state, action) => {
                state.vehicleInsurance = action.payload.data
            })
            .addCase(fetchAsyncVehicleInsuranceByInsurer.rejected, (state, action) => {

            })
            .addCase(updateVehicleInsurance.pending, (state, action) => {

            })
            .addCase(updateVehicleInsurance.fulfilled, (state, action) => {
                console.log("updated data ", action.payload.data)
                const updatedVehicle = action.payload.data;
                const updatedVehicleInsurances = state.vehicleInsurance.map((insurance) => {
                    if (insurance.insuranceId === updatedVehicle.insuranceId) {
                        return updatedVehicle; // Update the specific row with the updated insurance
                    }
                    return insurance;
                });
                state.vehicleInsurance = updatedVehicleInsurances;
                console.log("updated insurance ", updateVehicleInsurance)
            })
            .addCase(updateVehicleInsurance.rejected, (state, action) => {
                
            });
    }
})
export const vehicleActions = vehicleSlice.actions
export const getNavStatus = (state) =>  state.vehicle.status
export const getDropdownStatus = (state) =>  state.vehicle.dropdownStatus
export const getInvoiceStatus = (state) =>  state.vehicle.invoiceStatus
export const getVehicleInsurance = (state) =>  state.vehicle.vehicleInsurance
export const getVehicleClasses = (state) =>  state.vehicle.vehicleClasses
export default vehicleSlice