import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postAddOn = createAsyncThunk(
    'addon/postAddOn', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/add_ons`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncCategory = createAsyncThunk(
    'addon/fetchAsyncCategory',
    async () => {
        try{
            const response = await InsuranceApi.get('/add_ons', {headers})
            return { success: true, data: response.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const addonSlice = createSlice({
    name: 'addon',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        addons: []
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
            .addCase(postAddOn.pending, (state, action) => {

            })
            .addCase(postAddOn.fulfilled, (state, action) => {

            })
            .addCase(postAddOn.rejected, (state, action) => {

            })
            .addCase(fetchAsyncCategory.pending, (state, action) => {

            })
            .addCase(fetchAsyncCategory.fulfilled, (state, action) => {
                state.addons = action.payload
            })
            .addCase(fetchAsyncCategory.rejected, (state, action) => {

            });
    }
})
export const addonActions = addonSlice.actions
export const getNavStatus = (state) =>  state.addon.status
export const getDropdownStatus = (state) =>  state.addon.dropdownStatus
export const getInvoiceStatus = (state) =>  state.addon.invoiceStatus
export const getCategories = (state) =>  state.addon.addons
export default addonSlice