import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance.js";

const extractError = (error) => {
  error.response?.data?.message || error.message || "Something went wrong";
};

export const registerCompany = createAsyncThunk(
  "company/registerCompany",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/company/register", formData)
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ companyId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/company/${companyId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/company/${companyId}`);
      return companyId;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchMyCompany = createAsyncThunk(
  "company/fetchMyCompany",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/company/employer/my-company");
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchCompanyById = createAsyncThunk(
  "company/fetchCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/company/${companyId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchAllCompanies = createAsyncThunk(
  "company/fetchAllCompanies",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/company", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchEmployerDashboard = createAsyncThunk(
  "company/fetchEmployerDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/company/employer/dashboard");
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

const initialState = {
  myCompany: null,
  currentCompany: null,
  companies: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  dashboard: null,
  status: "idle",
  error: null,
  hasCompany: false,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCompany.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myCompany = action.payload;
        state.hasCompany = true;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        state.myCompany = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteCompany.fulfilled, (state) => {
        state.myCompany = null;
        state.hasCompany = false;
      })

      .addCase(fetchMyCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myCompany = action.payload;
        state.hasCompany = true;
      })
      .addCase(fetchMyCompany.rejected, (state, action) => {
        state.status = "failed";
        state.hasCompany = false;
        state.error = action.payload;
      })

      .addCase(fetchCompanyById.pending, (state) => {
        state.status = "loading";
        state.currentCompany = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAllCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload.companies;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchEmployerDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployerDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboard = action.payload;
      })
      .addCase(fetchEmployerDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {clearCompanyError} = companySlice.actions
export default companySlice.reducer