import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface UiState {
  themeMode: ThemeMode;
}

const initialState: UiState = {
  themeMode: "system",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = uiSlice.actions;
export default uiSlice.reducer;
