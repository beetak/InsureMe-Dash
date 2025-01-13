import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import NgrokApi from "../components/api/NgrokApi"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postQuotation = createAsyncThunk(
    'sales/postQuotation', 
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

export const fetchAsyncQuotation = createAsyncThunk(
    'sales/fetchAsyncQuotation',
    async (initialData) => {
        console.log("resquest body for quote, ", initialData)
        const { zbcCategory, vehicleClass, zbcTerm, zinaraTerm, insuranceType, insuranceTerm } = initialData;
        try{
            const response = await InsuranceApi.get(`/vehicle-insurance/quotes?zbcCategory=${zbcCategory}&vehicleClass=${vehicleClass}&zbcTerm=${zbcTerm}&zinaraTerm=${zinaraTerm}&insuranceType=${insuranceType}&insuranceTerm=${insuranceTerm}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const salesSlice = createSlice({
    name: 'sales',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        // insurers: [],
        quotation: [],
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
        clearQuote(state, action){
            state.invoiceStatus = action.payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(postQuotation.pending, (state, action) => {

            })
            .addCase(postQuotation.fulfilled, (state, action) => {

            })
            .addCase(postQuotation.rejected, (state, action) => {

            })
            .addCase(fetchAsyncQuotation.pending, (state, action) => {

            })
            .addCase(fetchAsyncQuotation.fulfilled, (state, action) => {
                console.log("quote: ", action.payload.data)
                state.quotation = action.payload.data
            })
            .addCase(fetchAsyncQuotation.rejected, (state, action) => {

            });
    }
})
export const salesActions = salesSlice.actions
// export const getNavStatus = (state) =>  state.sales.status
// export const getDropdownStatus = (state) =>  state.sales.dropdownStatus
// export const getInvoiceStatus = (state) =>  state.sales.invoiceStatus
// export const getInsurers = (state) =>  state.sales.insurers
export const getQuotation = (state) =>  state.sales.quotation
export default salesSlice