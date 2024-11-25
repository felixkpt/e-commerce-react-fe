// client/src/store/shop/category-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { app } from "@/utilities/helpers";

const initialState = {
  isLoading: false,
  categoryList: [],
};

export const fetchAllCategories = createAsyncThunk(
  "/categories/fetchAllCategories",
  async () => {
    const response = await axios.get(
      app.urls.api + `/api/shop/categories/get`
    );

    return response.data;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.isLoading = false;
        state.categoryList = [];
      });
  },
});

export default categorySlice.reducer;
