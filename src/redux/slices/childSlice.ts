import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/api/axios";
import { Parent } from "@/types";
import { CreateChildDto } from "@/types/child";


interface ChildState {
  data: Child[]; // ⬅️ array instead of single
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
  data: [],
  loading: false,
  error: null,
};
// Base API URL

export const addChild = createAsyncThunk<Child, CreateChildDto>(
  "children/addChild",
  async (newChild, { rejectWithValue }) => {
    try {
      const response = await api.post<Child>("children/create", newChild);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to add child");
    }
  }
);
export const fetchChildrenByParentId = createAsyncThunk<Child[], string>(
  "parent/fetchChildrenByParentId",
  async (parentId, { rejectWithValue }) => {
    console.log(parentId);

    console.log("...............parnet");
    try {
      const response = await api.get(`children/find-all?parentId=${parentId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch children");
    }
  }
);


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
        // state.data = action.payload;
      })
      .addCase(addChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch parent";
      })
       .addCase(fetchChildrenByParentId.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchChildrenByParentId.fulfilled, (state, action: PayloadAction<any>) => {
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
