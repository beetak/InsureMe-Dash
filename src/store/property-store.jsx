import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken');

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postPropertyPolicy = createAsyncThunk(
    'product/postTravelPolicy', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/property-insurance`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postInsurance = createAsyncThunk(
    'product/postInsurance', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/products`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteInsurance = createAsyncThunk(
    'product/deleteInsurance', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.delete(`/products/${initialData.productId}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncProduct = createAsyncThunk(
    'product/fetchAsyncProduct',
    async () => {
        try{
            const response = await InsuranceApi.get('/products', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncProductByInsurer = createAsyncThunk(
    'product/fetchAsyncProductByInsurer',
    async (initialData) => {
        try{
            const response = await InsuranceApi.get(`/products/by-insurer/${initialData.insurerId}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        products: []
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
            .addCase(deleteInsurance.pending, (state, action) => {

            })
            .addCase(deleteInsurance.fulfilled, (state, action) => {

            })
            .addCase(deleteInsurance.rejected, (state, action) => {

            })
            .addCase(fetchAsyncProduct.pending, (state, action) => {

            })
            .addCase(fetchAsyncProduct.fulfilled, (state, action) => {
                state.products = action.payload.data
            })
            .addCase(fetchAsyncProduct.rejected, (state, action) => {

            })
            .addCase(fetchAsyncProductByInsurer.pending, (state, action) => {

            })
            .addCase(fetchAsyncProductByInsurer.fulfilled, (state, action) => {
                state.products = action.payload.data
            })
            .addCase(fetchAsyncProductByInsurer.rejected, (state, action) => {

            });
    }
})
export const productActions = productSlice.actions
export const getNavStatus = (state) =>  state.product.status
export const getDropdownStatus = (state) =>  state.product.dropdownStatus
export const getInvoiceStatus = (state) =>  state.product.invoiceStatus
export const getProducts = (state) =>  state.product.products
export default productSlice