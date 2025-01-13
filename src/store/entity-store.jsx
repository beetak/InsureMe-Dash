import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AuthApi from "../components/api/AuthApi"
import NgrokApi from "../components/api/NgrokApi"

const token = localStorage.getItem('authToken')

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const postTown = createAsyncThunk(
    'entity/postTown', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/town`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postShop = createAsyncThunk(
    'entity/postShop', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/shop`, initialData, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postRegion = createAsyncThunk(
    'entity/postRegion', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/region`, initialData, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const postRole = createAsyncThunk(
    'entity/postRole', 
      async (initialData)=>{
        try{
            const response = await AuthApi.post(`/roles`, initialData, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const updateShop = createAsyncThunk(
    'entity/updateShop',
      async (initialData)=>{
        try{
            const response = await AuthApi.put(`/shop`, initialData, {headers})
            return {success: true, data: response}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const updateTown = createAsyncThunk(
    'entity/updateTown',
    async (initialData)=>{
        try{
            const response = await AuthApi.put(`/town?id=${initialData.id}&name=${initialData.name}&active=${initialData.active}`, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const updateRegion = createAsyncThunk(
    'entity/updateRegion',
    async (initialData)=>{
        try{
            const response = await AuthApi.put(`/region?id=${initialData.id}&name=${initialData.name}&active=${initialData.active}`, {headers})
            return {success: true, data: response.data.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteShop = createAsyncThunk(
    'entity/deleteShop', 
    async (initialData)=>{
        try{
            const response = await AuthApi.delete(`/shop/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteTown = createAsyncThunk(
    'entity/deleteTown', 
    async (initialData)=>{
        try{
            const response = await AuthApi.delete(`/town/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const deleteRegion = createAsyncThunk(
    'entity/deleteRegion', 
    async (initialData)=>{
        try{
            const response = await AuthApi.delete(`/region/${initialData.id}`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncRegions = createAsyncThunk(
    'entity/fetchAsyncRegions',
    async () => {
        try{
            const response = await AuthApi.get('/region', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncTowns = createAsyncThunk(
    'entity/fetchAsyncTowns',
    async () => {
        try{
            const response = await AuthApi.get('/town', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchTownsByRegionId = createAsyncThunk(
    'entity/fetchTownsByRegionId',
    async (id) => {
        try{
            const response = await AuthApi.get(`/town/region/${id}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncShops = createAsyncThunk(
    'entity/fetchAsyncShops',
    async () => {
        try{
            const response = await AuthApi.get('/shop', {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchShopsByTownId = createAsyncThunk(
    'entity/fetchShopsByTownId',
    async (id) => {
        try{
            const response = await AuthApi.get(`/shop/town/${id}`, {headers})
            return { success: true, data: response.data.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

export const fetchAsyncRoles = createAsyncThunk(
    'entity/fetchAsyncRoles',
    async () => {
        try{
            const response = await AuthApi.get('/roles')
            return { success: true, data: response.data }
        }
        catch(error){
            return { success: false }
        }
    }
)

const entitySlice = createSlice({
    name: 'entity',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        roles: [],
        towns: [],
        shops: [],
        regions: [],
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
            .addCase(postTown.pending, (state, action) => {

            })
            .addCase(postTown.fulfilled, (state, action) => {

            })
            .addCase(postTown.rejected, (state, action) => {

            })
            .addCase(postShop.pending, (state, action) => {

            })
            .addCase(postShop.fulfilled, (state, action) => {

            })
            .addCase(postShop.rejected, (state, action) => {

            })
            .addCase(postRegion.pending, (state, action) => {

            })
            .addCase(postRegion.fulfilled, (state, action) => {

            })
            .addCase(postRegion.rejected, (state, action) => {

            })
            .addCase(postRole.pending, (state, action) => {

            })
            .addCase(postRole.fulfilled, (state, action) => {

            })
            .addCase(postRole.rejected, (state, action) => {

            })
            .addCase(updateRegion.pending, (state, action) => {

            })
            .addCase(updateRegion.fulfilled, (state, action) => {
                const updatedRegion = action.payload.data;
                const updatedRegions = state.regions.map((region) => {
                    if (region.id === updatedRegion.id) {
                        return updatedRegion; // Update the specific row with the updated region
                    }
                    return region;
                });
                state.regions = updatedRegions;
            })
            .addCase(updateRegion.rejected, (state, action) => {

            })
            .addCase(updateTown.pending, (state, action) => {

            })
            .addCase(updateTown.fulfilled, (state, action) => {
                const updatedTown = action.payload.data;
                const updatedTowns = state.towns.map((town) => {
                    if (town.id === updatedTown.id) {
                        return updatedTown; // Update the specific row with the updated town
                    }
                    return town;
                });
                state.towns = updatedTowns;
            })
            .addCase(updateTown.rejected, (state, action) => {

            })
            .addCase(updateShop.pending, (state, action) => {

            })
            .addCase(updateShop.fulfilled, (state, action) => {
                const updatedShop = action.payload.data;
                const updatedShops = state.shops.map((shop) => {
                    if (shop.id === updatedShop.id) {
                        return updatedShop; // Update the specific row with the updated shop
                    }
                    return shop;
                });
                state.shops = updatedShops;
            })
            .addCase(updateShop.rejected, (state, action) => {

            })
            .addCase(fetchAsyncRegions.pending, (state, action) => {

            })
            .addCase(fetchAsyncRegions.fulfilled, (state, action) => {
                state.regions = action.payload.data
            })
            .addCase(fetchAsyncRegions.rejected, (state, action) => {

            })
            .addCase(fetchAsyncRoles.pending, (state, action) => {

            })
            .addCase(fetchAsyncRoles.fulfilled, (state, action) => {
                state.roles = action.payload.data
            })
            .addCase(fetchAsyncRoles.rejected, (state, action) => {

            })
            .addCase(fetchAsyncShops.pending, (state, action) => {

            })
            .addCase(fetchAsyncShops.fulfilled, (state, action) => {
                state.shops = action.payload.data
            })
            .addCase(fetchAsyncShops.rejected, (state, action) => {

            })
            .addCase(fetchAsyncTowns.pending, (state, action) => {

            })
            .addCase(fetchAsyncTowns.fulfilled, (state, action) => {
                state.towns = action.payload.data
            })
            .addCase(fetchAsyncTowns.rejected, (state, action) => {

            })
            .addCase(fetchTownsByRegionId.pending, (state, action) => {

            })
            .addCase(fetchTownsByRegionId.fulfilled, (state, action) => {
                state.towns = action.payload.data
            })
            .addCase(fetchTownsByRegionId.rejected, (state, action) => {

            })
            .addCase(fetchShopsByTownId.pending, (state, action) => {

            })
            .addCase(fetchShopsByTownId.fulfilled, (state, action) => {
                state.shops = action.payload.data
            })
            .addCase(fetchShopsByTownId.rejected, (state, action) => {

            })
    }
})
export const entityActions = entitySlice.actions
export const getRegions = (state) =>  state.entity.regions
export const getTowns = (state) => state.entity.towns
export const getShops = (state) => state.entity.shops
export const getRoles = (state) =>  state.entity.roles
export default entitySlice