// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  email: string | null;
  token: string | null;
  role: number | null;
  entityType: string | null;
  isApproved: boolean | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  role: null,
  token: null,
  entityType: null,
  isApproved: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        role: number;
        token: string;
        entityType: string;
        isApproved?: boolean;
      }>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.entityType = action.payload.entityType;
      state.isApproved = action.payload.isApproved || false;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.role = null;
      state.token = null;
      state.entityType = null;
      state.isApproved = null;
    },
    updateApprovalStatus: (state, action: PayloadAction<boolean>) => {
      state.isApproved = action.payload;
    },
  },
});

export const { setUser, clearUser, updateApprovalStatus } = userSlice.actions;
export default userSlice.reducer;