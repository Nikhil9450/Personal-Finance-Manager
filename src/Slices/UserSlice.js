import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDoc,doc } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (uid, thunkAPI) => {
      try {
        console.log('Fetching user profile for UID:', uid); // Log the UID
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          console.log('User data found:', userDoc.data());
          return userDoc.data(); // Return user profile data
        } else {
          console.log('User not found in Firestore');
          return thunkAPI.rejectWithValue('User not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null, // User profile data
    status: 'idle', // idle | loading | succeeded | failed
    error: null, // Error message
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = userSlice.actions;

export default userSlice.reducer;
