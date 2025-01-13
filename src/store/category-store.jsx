import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import InsuranceApi from "../components/api/InsuranceApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postCategory = createAsyncThunk(
    'category/postCategory', 
      async (initialData)=>{
        try{
            const response = await InsuranceApi.post(`/categories`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
      async (initialData)=>{
        try{
            const response = await InsuranceApi.put(`/categories/${initialData.id}`, initialData.data, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.delete(`/categories/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncCategory = createAsyncThunk(
    'category/fetchAsyncCategory',
    async () => {
        try{
            const response = await InsuranceApi.get('/categories', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchActiveCategories = createAsyncThunk(
    'category/fetchActiveCategories',
    async (status) => {
        try{
            const response = await InsuranceApi.get(`/categories/status/${status}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        categories: []
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
            .addCase(postCategory.pending, (state, action) => {

            })
            .addCase(postCategory.fulfilled, (state, action) => {

            })
            .addCase(postCategory.rejected, (state, action) => {

            })
            .addCase(updateCategory.pending, (state, action) => {

            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const updatedCategory = action.payload.data;
                const updatedCategories = state.categories.map((category) => {
                    if (category.categoryId === updatedCategory.categoryId) {
                        return updatedCategory; // Update the specific row with the updated category
                    }
                    return category;
                });
                state.categories = updatedCategories;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                
            })
            .addCase(fetchAsyncCategory.pending, (state, action) => {

            })
            .addCase(fetchAsyncCategory.fulfilled, (state, action) => {
                state.categories = action.payload.data
            })
            .addCase(fetchAsyncCategory.rejected, (state, action) => {

            })
            .addCase(fetchActiveCategories.pending, (state, action) => {

            })
            .addCase(fetchActiveCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data
            })
            .addCase(fetchActiveCategories.rejected, (state, action) => {

            });
    }
})
export const categoryActions = categorySlice.actions
export const getNavStatus = (state) =>  state.category.status
export const getDropdownStatus = (state) =>  state.category.dropdownStatus
export const getInvoiceStatus = (state) =>  state.category.invoiceStatus
export const getCategories = (state) =>  state.category.categories
export default categorySlice