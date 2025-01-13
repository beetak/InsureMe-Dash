import { createSlice } from "@reduxjs/toolkit"

const navSlice = createSlice({
    name: 'nav',
    initialState: {
        status: 'home',
        dropdownStatus: false,
        invoiceStatus: false,
        quoteStatus: false,
        loadingState: false,
        failedLoading:  false,
        successLoading: false,
        userRole: ''
    },
    reducers: {
        toggleLoading(state, action){
            state.loadingState = action.payload
        },
        toggleFailed(state, action){
            state.failedLoading = action.payload
        },
        toggleSuccess(state, action){
            state.successLoading = action.payload
        },
        toggleNav(state, action){
            state.status = action.payload
        },
        toggleDropdown(state, action){
            state.dropdownStatus = action.payload.state
        },
        toggleInvoice(state, action){
            state.invoiceStatus = action.payload
        },
        toggleQuote(state, action){
            state.quoteStatus = action.payload
        },
        setUserRole(state, action){
            state.userRole = action.payload
        },
    }
})
export const navActions = navSlice.actions
export const getNavStatus = (state) =>  state.nav.status
export const getDropdownStatus = (state) =>  state.nav.dropdownStatus
export const getInvoiceStatus = (state) =>  state.nav.invoiceStatus
export const getQuoteStatus = (state) =>  state.nav.quoteStatus
export const getLoadingStatus = (state) =>  state.nav.loadingState
export const getFailedStatus = (state) =>  state.nav.failedLoading
export const getSuccessStatus = (state) =>  state.nav.successLoading
export const getGetUserRole = (state) =>  state.nav.userRole
export default navSlice