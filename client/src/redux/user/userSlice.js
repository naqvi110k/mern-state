import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
       signInStart:(state) =>{
        state.loading = true;
       },
       signInSuccess:(state,action) =>{
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
    },
    signInFailure:(state,action) =>{
        state.loading = false;
        state.error = action.payload;
    },
    updateUserStart : (state, action) =>{
        state.loading = true;
    },
    updateUserSuccess : (state, action) =>{

        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;

    },
    updateUserFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },
    deleteUserStart : (state) =>{
        state.loading = true;
    },
    deleteUserSuccess : (state) =>{
        state.currentUser = null;
        state.loading = false;
        state.error = null;
    },
    deleteUserFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    },
    signOutUserStart : (state) =>{
        state.loading = true;
    },
    signOutUserSuccess : (state) =>{
        state.currentUser = null;
        state.loading = false;
        state.error = null;
    },
    signOutUserFailure : (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    }
    
}
});

export const { signOutUserStart,signOutUserSuccess,signOutUserFailure,
    deleteUserFailure,deleteUserStart,deleteUserSuccess,signInStart, signInSuccess, signInFailure, updateUserFailure,updateUserSuccess,updateUserStart } = userSlice.actions;

export default userSlice.reducer;