import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../../utils/types';

const initialState: FilterState = {
  category: 'all',
  priceRange: [0, 1500],
  metalType: 'all',
  polishType: 'all',
  sortBy: 'latest',
  page: 1,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) { state.category = action.payload; state.page = 1; },
    setPriceRange(state, action: PayloadAction<[number, number]>) { state.priceRange = action.payload; state.page = 1; },
    setMetalType(state, action: PayloadAction<string>) { state.metalType = action.payload; state.page = 1; },
    setPolishType(state, action: PayloadAction<string>) { state.polishType = action.payload; state.page = 1; },
    setSortBy(state, action: PayloadAction<string>) { state.sortBy = action.payload; state.page = 1; },
    setPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetFilters() { return { ...initialState }; },
  },
});

export const { setCategory, setPriceRange, setMetalType, setPolishType, setSortBy, setPage, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
