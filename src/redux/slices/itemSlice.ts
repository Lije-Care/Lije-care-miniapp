import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from '@/api/axios';
import { ParentInfo } from "@/types";

interface Parent {
  id: number;
  name: string;
  children: Child[];
}

interface ParentState {
  parent: Parent | null;
  loading: boolean;
  error: string | null;
}

export type Child = {
  id: string;
  parent_id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  weight: number;
  height: number;
  muac: number | null;
  dietary_restrictions: string | null;
  allergies: string | null;
  medications: string | null;
  createdAt: string;
  updatedAt: string;
};

const initialState: ParentState = {
  parent: null,
  loading: false,
  error: null,
};

// Base API URL

// Async Thunks for API Calls
export const fetchParent = createAsyncThunk("parent/fetchParent", async () => {
  try {
    const response = await api.get(
      "users/find-one/dc8e1deb-a6bc-41a2-8518-e3e85b83b38d");
    

    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch parent");
  }
});



export const addParent = createAsyncThunk("parent/addParent", async (newParent: Omit<Parent, "id">) => {
  const response = await api.post<Parent>('', newParent);
  return response.data;
});



export const updateParent = createAsyncThunk("parent/updateParent", async (updatedParent: ParentInfo) => {
  const response = await api.patch<Parent>(`users/update/dc8e1deb-a6bc-41a2-8518-e3e85b83b38d`, updatedParent);
  return response.data;
});




export const deleteParent = createAsyncThunk("parent/deleteParent", async (id: number) => {
  await axios.delete(`/${id}`);
  return id;
});

// Redux Slice
const parentSlice = createSlice({
  name: "parent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParent.fulfilled, (state, action: PayloadAction<Parent>) => {
        state.loading = false;
        console.log("payload, acrion");
        console.log(action.payload);
        state.parent = action.payload;
      })
      .addCase(fetchParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch parent";
      })

     
      .addCase(addParent.fulfilled, (state, action: PayloadAction<Parent>) => {
        state.parent = action.payload;
      })
      .addCase(updateParent.fulfilled, (state, action: PayloadAction<Parent>) => {
        if (state.parent && state.parent.id === action.payload.id) {
          state.parent = action.payload;
        }
      })
      .addCase(deleteParent.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.parent && state.parent.id === action.payload) {
          state.parent = null;
        }
      });
  },
});

export default parentSlice.reducer;
