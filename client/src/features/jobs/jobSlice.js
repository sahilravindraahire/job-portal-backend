import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance.js";

const extractError = (error) => {
  error.response?.data?.message || error.message || "Something went wrong";
};

export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAllJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/jobs", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/jobs/${jobId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchMyPostedJobs = createAsyncThunk(
  "jobs/fetchMyPostedJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/jobs/employer/my-jobs", {
        params,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

// export const fetchMyPostedJobs = createAsyncThunk(
//   "jobs/fetchMyPostedJobs",
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get("/jobs/employer/my-jobs", {
//         params,
//       });
//       return data.data;
//     } catch (error) {
//       return rejectWithValue(extractError(error));
//     }
//   },
// );

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobPayload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/jobs", jobPayload);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/jobs/${jobId}`, updates);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

const initialState = {
  jobs: [],
  myJobs: [],
  currentJob: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  filters: {
    keyword: "",
    location: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    experienceLevel: "",
  },
  status: "idle",
  error: null,
};

const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = {...state.filters, ...action.payload}
        },
        resetFilters: (state) => {
            state.filters = initialState.filters
        },
        clearCurrentJob: (state) => {
            state.currentJob = null
        },
        clearJobsError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllJobs.pending, (state) => {
            state.status = "loading"
            state.error = null
        })
        .addCase(fetchAllJobs.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.jobs = action.payload.jobs
            state.pagination = action.payload.pagination
        })
        .addCase(fetchAllJobs.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(fetchJobById.pending, (state) => {
            state.status = "loading"
            state.currentJob = null
        })
        .addCase(fetchJobById.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.currentJob = action.payload
        })
        .addCase(fetchJobById.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(fetchMyPostedJobs.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchMyPostedJobs.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.myJobs = action.payload.jobs
            state.pagination = action.payload.pagination
        })
        .addCase(fetchMyPostedJobs.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(createJob.fulfilled, (state, action) => {
            state.myJobs.unshift(action.payload)
        })
        .addCase(createJob.rejected, (state, action) => {
            state.error = action.payload
        })

        .addCase(updateJob.fulfilled, (state, action) => {
            state.myJobs = state.myJobs.map((job) => job._id === action.payload._id ? action.payload : job)
            if(state.currentJob?._id === action.payload._id){
                state.currentJob = {...state.currentJob, ...action.payload}
            }
        })
        .addCase(updateJob.rejected, (state, action) => {
            state.error = action.payload
        })

        .addCase(deleteJob.fulfilled, (state, action) => {
            state.myJobs = state.myJobs.filter((job) => job._id !== action.payload)
        })
        .addCase(deleteJob.rejected, (state, action) => {
            state.error = action.payload
        })
    }
})

export const {setFilters, resetFilters, clearCurrentJob, clearJobsError} = jobSlice.actions
export default jobSlice.reducer