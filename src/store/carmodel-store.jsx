import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import CarApi from "../components/api/CarApi"

const token = localStorage.getItem('authToken')

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}
// {
//     "api_token": "77410bc5-bc9c-464c-8b88-da5d25c03474",
//     "api_secret": "f9691402cd8abd80de17badeeffef23c"
//   }

export const carApiLogin = createAsyncThunk(
    'carmodel/carApiLogin',
    async (initialData)=>{
        try{
            const response = await CarApi.post(`/auth/login`, initialData, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

export const fetchAsyncCarModels = createAsyncThunk(
    'carmodel/fetchAsyncCarModel',
    async () => {
        try{
            const response = await CarApi.post(`/makes?sort=name`, {headers})
            return {success: true, data: response.data}
        }
        catch(error){
            return {success: false}
        }
    }
)

const carmodelSlice = createSlice({
    name: 'carmodel',
    initialState: {
        status: 'home',
        carModels: []
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(carApiLogin.pending, (state, action) => {

            })
            .addCase(carApiLogin.fulfilled, (state, action) => {

            })
            .addCase(carApiLogin.rejected, (state, action) => {

            })
            .addCase(fetchAsyncCarModels.pending, (state, action) => {

            })
            .addCase(fetchAsyncCarModels.fulfilled, (state, action) => {
                state.carModels = action.payload.data
            })
            .addCase(fetchAsyncCarModels.rejected, (state, action) => {

            })
    }
})
export const carmodelActions = carmodelSlice.actions
export const getCarModels = (state) =>  state.carmodel.carModels
export default carmodelSlice