import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/api/axios';

// Types
export interface User {
  id: string;
  telegram_username: string | null;
  firstName: string;
  lastName: string;
  gender: string | null;
  avatarUrl: string | null;
  address: string | null;
  city: string | null;
  phone: string;
  password: string;
  role: 'NUTRITIONIST' | 'PEDIATRICIAN' | 'CULINARIAN';
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Specialist {
  id: string;
  userId: string;
  rating: number;
  bio: string;
  experience: number;
  certifications: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface SpecialistPagination {
  total: number;
  skip: number;
  limit: number;
  page: number;
  totalPages: number;
}

interface SpecialistState {
  specialists: Specialist[];
  loading: boolean;
  error: string | null;
  pagination: SpecialistPagination | null;
}

const initialState: SpecialistState = {
  specialists: [],
  loading: false,
  error: null,
  pagination: null,
};

// 🔁 Async Thunk to fetch specialists
export const fetchSpecialists = createAsyncThunk<
  { data: Specialist[]; pagination: SpecialistPagination },
  { page?: number; limit?: number },
  { rejectValue: string }
>('specialists/fetchAll', async ({ page = 1, limit = 10 }, thunkAPI) => {
  try {
    const response = await api.get(`/specialists/find-all?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch specialists');
  }
});

// Slice
const specialistSlice = createSlice({
  name: 'specialists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialists.fulfilled, (state, action: PayloadAction<{ data: Specialist[]; pagination: SpecialistPagination }>) => {
        state.loading = false;
        state.specialists = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSpecialists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default specialistSlice.reducer;
