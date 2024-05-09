import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  avatar: string | null;
  createId: number;
  createdAt: number;
  creator: string;
  deletedAt: number | null;
  email: string | null;
  gender: string | null;
  id: number;
  lastLoginAt: number | null;
  lastLoginIp: string | null;
  loginName: string;
  nickname: string | null;
  password: string;
  phoneNumber: string | null;
  realname: string | null;
  remark: string | null;
  updateId: number;
  updatedAt: number;
  updater: string;
  userType: number;
}

interface InitialState {
  user: User | null;
}

const initialState: InitialState = {
  user: null
};

export const initialStateSlice = createSlice({
  name: "initialState",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { setUser } = initialStateSlice.actions;

export default initialStateSlice.reducer;
