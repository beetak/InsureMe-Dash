import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AuthApi from "../components/api/AuthApi"
import NgrokApi from "../components/api/NgrokApi"
import axiosInstance from "../components/api/AuthApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const loginUser = createAsyncThunk(
    'auth/loginUser', 
      async (initialData)=>{
        try{
            const response = await axiosInstance.post(`/auth/authenticate`, initialData)
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const loginInsurerUser = createAsyncThunk(
    'auth/loginInsurerUser', 
      async (initialData)=>{
        try{
            const response = await axiosInstance.post(`/insurer-users/login`, initialData)
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postAdmin = createAsyncThunk(
    'auth/postAdmin', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/auth/register`, initialData, {headers});
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postUserShop = createAsyncThunk(
    'auth/postUserShop', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/user-shop`, initialData, {headers});
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postUserTown = createAsyncThunk(
    'auth/postUserTown', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/user-town`, initialData, {headers});
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postUserRegion = createAsyncThunk(
    'auth/postUserRegion', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/user-region`, initialData, {headers});
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postInsurerAdmin = createAsyncThunk(
    'auth/postInsurerAdmin', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/insurer-users/signup`, initialData)
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const updateInsurerAdmin = createAsyncThunk(
    'auth/updateInsurerAdmin',
      async (initialData)=>{
        try{
            const response = await InsuranceApi.put(`/insurer-users/${initialData.id}`, initialData.data, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteInsurerAdmin = createAsyncThunk(
    'auth/deleteInsurerAdmin', 
    async (initialData)=>{
        try{
            const response = await InsuranceApi.delete(`/insurer-users/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postCustomer = createAsyncThunk(
    'auth/postCustomer', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/products`, initialData)
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postRole = createAsyncThunk(
    'auth/postRole', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/roles`, initialData)
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncAdmins = createAsyncThunk(
    'auth/fetchAsyncAdmins',
    async () => {
        try{
            const response = await AuthApi.get('/users', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchUserByShopId = createAsyncThunk(
    'auth/fetchUserByShopId',
    async (id) => {
        try{
            console.log(headers)
            const response = await AuthApi.get(`/user-shop/${id}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchUserById = createAsyncThunk(
    'auth/fetchUserById',
    async (id) => {
        try{
            console.log(headers)
            const response = await AuthApi.get(`/users/userId/${id}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchUserInformation = createAsyncThunk(
    'auth/fetchUserInformation',
    async (initialData) => {
        try{
            console.log(headers)
            const response = await AuthApi.get(`/users/${initialData.id}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncRoles = createAsyncThunk(
    'auth/fetchAsyncRoles',
    async () => {
        try{
            const response = await AuthApi.get('/roles')
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncInsurerAdmins = createAsyncThunk(
    'auth/fetchAsyncInsurerAdmins',
    async () => {
        try{
            const response = await AuthApi.get('/insurer-users')
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncCustomers = createAsyncThunk(
    'auth/fetchAsyncCustomers',
    async () => {
        try{
            const response = await AuthApi.get('/users')
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const findUserLike = createAsyncThunk(
    'auth/findUserLike',
    async (initialData) => {
        try{
            const response = await AuthApi.get(`/users/search?startingWord=${initialData.firstname}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const deleteUser = createAsyncThunk(
    'auth/deleteUser', 
    async (initialData)=>{
        try{
            const response = await AuthApi.delete(`/users/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        users: [],
        insurerUsers: [],
        roles: [],
        customers: [],
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
        clearUsers(state){
            console.log("Clearing")
            state.users = []
        }
    },
    extraReducers: builder => {
        builder
            .addCase(postAdmin.pending, (state, action) => {

            })
            .addCase(postAdmin.fulfilled, (state, action) => {

            })
            .addCase(postAdmin.rejected, (state, action) => {

            })
            .addCase(postInsurerAdmin.pending, (state, action) => {

            })
            .addCase(postInsurerAdmin.fulfilled, (state, action) => {

            })
            .addCase(postInsurerAdmin.rejected, (state, action) => {

            })
            .addCase(postCustomer.pending, (state, action) => {

            })
            .addCase(postCustomer.fulfilled, (state, action) => {

            })
            .addCase(postCustomer.rejected, (state, action) => {

            })
            .addCase(fetchAsyncAdmins.pending, (state, action) => {

            })
            .addCase(fetchAsyncAdmins.fulfilled, (state, action) => {
                state.users = action.payload.data
            })
            .addCase(fetchAsyncAdmins.rejected, (state, action) => {

            })
            .addCase(fetchUserByShopId.pending, (state, action) => {

            })
            .addCase(fetchUserByShopId.fulfilled, (state, action) => {
                state.users = action.payload.data
            })
            .addCase(fetchUserByShopId.rejected, (state, action) => {

            })
            .addCase(fetchAsyncRoles.pending, (state, action) => {

            })
            .addCase(fetchAsyncRoles.fulfilled, (state, action) => {
                state.roles = action.payload.data
            })
            .addCase(fetchAsyncRoles.rejected, (state, action) => {

            })
            .addCase(fetchAsyncCustomers.pending, (state, action) => {

            })
            .addCase(fetchAsyncCustomers.fulfilled, (state, action) => {
                state.customers = action.payload.data
            })
            .addCase(fetchAsyncCustomers.rejected, (state, action) => {

            })
            .addCase(fetchAsyncInsurerAdmins.pending, (state, action) => {

            })
            .addCase(fetchAsyncInsurerAdmins.fulfilled, (state, action) => {
                state.insurerUsers = action.payload.data
            })
            .addCase(fetchAsyncInsurerAdmins.rejected, (state, action) => {

            })
            .addCase(findUserLike.pending, (state, action) => {

            })
            .addCase(findUserLike.fulfilled, (state, action) => {
                state.users = action.payload.data
            })
            .addCase(findUserLike.rejected, (state, action) => {

            })
    }
})
export const authActions = authSlice.actions
export const getUsers = (state) =>  state.auth.users
export const getInsurerUsers = (state) =>  state.auth.insurerUsers
export const getCustomers = (state) => state.auth.customers
export const getRoles = (state) =>  state.auth.roles
export default authSlice