import { configureStore } from "@reduxjs/toolkit";
import navSlice from "./nav-store";
import categorySlice from "./category-store";
import addonSlice from "./addon-store";
import authSlice from "./user-store";
import productSlice from "./product-store";
import entitySlice from "./entity-store";
import insurerSlice from "./insurer-store";
import policySlice from "./policy-store";
import vehicleSlice from "./vehicle-store";
import carmodelSlice from "./carmodel-store";
import vehicleInfoSlice from "./payments-store";
import salesSlice from "./sales-store";
import travelSlice from "./travel-store";

const store = configureStore({
    reducer: {
        nav: navSlice.reducer,
        category: categorySlice.reducer,
        addon: addonSlice.reducer,
        auth: authSlice.reducer,
        product: productSlice.reducer,
        entity: entitySlice.reducer,
        insurer: insurerSlice.reducer,
        policy: policySlice.reducer,
        vehicle: vehicleSlice.reducer,
        travel: travelSlice.reducer,
        carmodel: carmodelSlice.reducer,
        vehicleInfo: vehicleInfoSlice.reducer,
        sales: salesSlice.reducer
    }
})

export default store