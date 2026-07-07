import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice.js"
import jobsReducer from "../features/jobs/jobSlice.js"
import applicationsReducer from "../features/applications/applicationsSlice.js"
import companyReducer from "../features/company/companySlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        job: jobsReducer,
        applications: applicationsReducer,
        company: companyReducer
    },
})

export default store
