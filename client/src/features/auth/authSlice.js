import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstace from "../../utils/axiosInstance.js";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance.js";

const extractError = (error) => {
  error.response?.data?.message || error.message || "Something went wrong";
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (FormData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/users/regitser", formData);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstace.post("/users/verify-otp", {
        email,
        otp,
      });
      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstace.post("/users/login", {
        email,
        password,
      });
      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/users/logout");
      localStorage.removeItem("accessToken");
      return true;
    } catch (error) {
      localStorage.removeItem("accessToken");
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/users/profile");
      return data.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData, {rejectWithValue}) => {
        try {
            const { data } = await axiosInstance.patch("/users/profile", formData);
            return data.data
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
)

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async(payload, {rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.patch("/users/change-password", payload)
            return data.data;
        } catch (error) {
            return rejectWithValue(extractError(error))
        }
    }
)

const initialState = {
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
    registeredEmail: null
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null
        },
        setCredentialFromStorage: (state) => {
            const token = localStorage.getItem("accessToken")
            state.isAuthenticated = Boolean(token)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.status = "loading"
            state.error = null
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.status = "succeeded"
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(verifyOtp.pending, (state) => {
            state.status = "loading"
            state.error = null
        })
        .addCase(verifyOtp.fulfilled, (state, action) =>  {
            state.status = "succeeded"
            state.user = action.payload.user
            state.isAuthenticated = true
        })
        .addCase(verifyOtp.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(loginUser.pending, (state) => {
            state.status = "loading"
            state.error = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.user = action.payload.user
            state.isAuthenticated = true
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })

        .addCase(fetchProfile.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchProfile.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.user = action.payload
            state.isAuthenticated = true
        })
        .addCase(fetchProfile.rejected, (state) => {
            state.status = "failed"
            state.isAuthenticated = false
        })

        .addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload
        })

        .addCase(changePassword.pending, (state) => {
            state.error = null
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.error = action.payload
        })
    }
})

export const {clearAuthError, setCredentialFromStorage} = authSlice.actions
export default authSlice.reducer