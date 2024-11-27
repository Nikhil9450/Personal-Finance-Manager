import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Thunk to fetch user profile
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

// Thunk to fetch user expenses list
export const fetch_expenses_list = createAsyncThunk(
  'user/fetch_expenses_list',
  async (uid, thunkAPI) => {
    try {
      console.log('Fetching expenses for UID:', uid);
      const userExpenseListRef = collection(db, 'users', uid, 'items');
      const expenseSnapshot = await getDocs(userExpenseListRef);

      if (!expenseSnapshot.empty) {
        // Map over the documents and retrieve their data
        const expenseList = expenseSnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID if needed
          ...doc.data(),
        }));
        console.log('User expenses found:', expenseList);
        return expenseList; // Return the list of expenses
      } else {
        console.log('No expenses found for user');
        return thunkAPI.rejectWithValue('No expenses found');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null, // User profile data
    expenses: [], // User expenses data
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
      // Fetch user profile cases
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
      })
      // Fetch expenses list cases
      .addCase(fetch_expenses_list.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetch_expenses_list.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetch_expenses_list.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearProfile } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
