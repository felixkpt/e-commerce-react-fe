import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/feature/getFeatureImages",
  async () => {
    const response = await axios.get(`${API_URL}/api/common/feature/get`);
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/feature/addFeatureImage",
  async (image) => {
    const response = await axios.post(`${API_URL}/api/common/feature/add`, { image });
    return response.data;
  }
);

export const removeFeatureImage = createAsyncThunk(
  "/feature/removeFeatureImage",
  async (id) => {
    const response = await axios.delete(`${API_URL}/api/common/feature/remove/${id}`);
    return { id, success: response.data.success };
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.featureImageList.push(action.payload.data);
      })
      .addCase(removeFeatureImage.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.featureImageList = state.featureImageList.filter(
            (image) => image._id !== action.payload.id
          );
        }
      });
  },
});

export default commonSlice.reducer;
