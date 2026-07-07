import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance.js";

const extractError = (error) => {
  error.response?.data?.message || error.message || "Something went wrong";
};

export const applyForJob = createAsyncThunk(
  "applications/applyForJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/applications/${jobId}/apply`);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const withdrawApplication = createAsyncThunk(
  "applications/withdrawApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/applications/${applicationId}/withdraw`);
      return applicationId;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchMyApplication = createAsyncThunk(
  "applications/fetchMyApplications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/applications/my-applications",
        {
          params,
        },
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchJobApplicants = createAsyncThunk(
  "applications/fetchJobApplicants",
  async ({ jobId, params = {} }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/applications/job/${jobId}/applicants`,
        { params },
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/applications/${applicationId}/status`,
        { status },
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchJobApplicationStats = createAsyncThunk(
  "applications/fetchJobApplicationStats",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/applications/job/${jobId}/stats`,
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

const initialState = {
  myApplications: [],
  jobApplicants: [],
  stats: { pending: 0, accepted: 0, rejected: 0, total: 0 },
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  status: "idle",
  error: null,
  successMessage: null,
};

const applicationSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        clearApplicationsError: (state) => {
            state.error = null
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(applyForJob.pending, (state) => {
            state.status = "loading"
            state.error = null
        })
        .addCase(applyForJob.fulfilled, (state) => {
            state.status = "succeeded"
            state.successMessage = "Application submitted successfully"
        })
        .addCase(applyForJob.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(withdrawApplication.fulfilled, (state, action) => {
            state.myApplications = state.myApplications.filter((app) => app._id !== action.payload)
        })
        .addCase(withdrawApplication.rejected, (state, action) => {
            state.error = action.payload
        })

        .addCase(fetchMyApplication.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchMyApplication.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.myApplications = action.payload.applications
            state.pagination = action.payload.pagination
        })
        .addCase(fetchMyApplication.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(fetchJobApplicants.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchJobApplicants.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.jobApplicants = action.payload.applications
            state.pagination = action.payload.pagination
        })
        .addCase(fetchJobApplicants.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(updateApplicationStatus.fulfilled, (state, action) => {
            state.jobApplicants = state.jobApplicants.map((app) => app._id === action.payload._id ? action.payload : app)
        })
        .addCase(updateApplicationStatus.rejected, (state, action) => {
            state.error = action.payload
        })

        .addCase(fetchJobApplicationStats.fulfilled, (state, action) => {
            state.stats = action.payload
        })
    }
})

export const {clearApplicationsError, clearSuccessMessage} = applicationSlice.actions
export default applicationSlice.reducer