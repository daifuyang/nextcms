import React from "react";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Breadcrumb {
  title: string | JSX.Element;
}

interface Routes {
  path: string;
  icon: string;
  name: string;
  children?: Routes[];
}

export interface InitialState {
  initialState: {
    breadcrumb?: Breadcrumb[];
    routes?: Routes[];
  };
}

const initialState: InitialState = {
  initialState: {
    breadcrumb: [],
    routes: [
      {
        path: "/admin",
        icon: "",
        name: "概况"
      },
      {
        path: "/admin/article",
        icon: "",
        name: "文章",
        children: [
          {
            path: "/admin/article/list",
            icon: "",
            name: "文章管理"
          },
          {
            path: "/admin/article/category",
            icon: "",
            name: "文章分类"
          }
        ]
      },
      {
        path: "/admin/resource",
        icon: "",
        name: "资源管理",
        children: [
          {
            path: "/admin/resource/list",
            icon: "",
            name: "素材中心"
          }
        ]
      }
    ]
  }
};

export const InitialStateSlice = createSlice({
  name: " InitialState",
  initialState,
  reducers: {
    setInitialState: (state, action: PayloadAction<any>) => {
      const initialState = { ...(action.payload || {}) };
      state.initialState = { ...state.initialState, ...initialState };
    }
  }
});

export const { setInitialState } = InitialStateSlice.actions;

export default InitialStateSlice.reducer;
