import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/api/axios";



interface ChildState {
  data: Child | null;
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

const initialState: ChildState = {
  data: null,
  loading: false,
  error: null,
};

// Base API URL

// Async Thunks for API Calls
export const addChild = createAsyncThunk("children/addChildren", async (newParent: Omit<Parent, "id">) => {
  const response = await api.post<Parent>(`children/create`, newParent);
  return response.data;
});

export const fetchChildrenByParentId = createAsyncThunk("parent/fetchChildrenByParentId", async () => {
  try {
    const response = await api.get(
      "children/find-all?parentId=ce10dd72-07d0-48f0-a774-295f8e36fdc0"
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch parent");
  }
});

export const updateChild = createAsyncThunk("child/updateChild", async (updateChild: any) => {
  console.log(updateChild);
  const response = await api.patch<Parent>(`children/${updateChild.id}`, updateChild);
  return response.data;
});




// Redux Slice
const childrenSlice = createSlice({
  name: "childred",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChild.fulfilled, (state, action: PayloadAction<Parent>) => {
        state.loading = false;
        console.log("payload, acrion");
        console.log(action.payload);
        state.data = action.payload;
      })
      .addCase(addChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch parent";
      })
       .addCase(fetchChildrenByParentId.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchChildrenByParentId.fulfilled, (state, action: PayloadAction<Parent>) => {
              state.loading = false;
              console.log("payload, acrion");
              console.log(action.payload);
              state.data = action.payload;
            })
            .addCase(fetchChildrenByParentId.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message || "Failed to fetch parent";
            })

     
  },
});

export default childrenSlice.reducer;
