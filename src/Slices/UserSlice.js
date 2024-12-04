import { createSlice } from '@reduxjs/toolkit';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null, // User profile data
    expenses: [], // User expenses data
    status: 'idle', // idle | loading | succeeded | failed
    error: null, // Error message
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.expenses = [];
    },
  },
});

// Thunk to listen for user profile changes
export const listenToUserProfile = (uid) => (dispatch) => {
  try {
    dispatch(userSlice.actions.setStatus('loading'));

    const userDocRef = doc(db, 'users', uid);
    onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        dispatch(userSlice.actions.setProfile(docSnap.data()));
        dispatch(userSlice.actions.setStatus('succeeded'));
      } else {
        console.error('User profile not found');
        dispatch(userSlice.actions.setError('User profile not found'));
        dispatch(userSlice.actions.setStatus('failed'));
      }
    });
  } catch (error) {
    console.error('Error listening to user profile:', error.message);
    dispatch(userSlice.actions.setError(error.message));
    dispatch(userSlice.actions.setStatus('failed'));
  }
};

// Thunk to listen for user expenses list changes
// Thunk to listen for user expenses list changes
export const listenToUserExpenses = (uid) => (dispatch) => {
  try {
    dispatch(userSlice.actions.setStatus('loading'));

    const userExpenseListRef = collection(db, 'users', uid, 'items');
    onSnapshot(userExpenseListRef, (snapshot) => {
      if (!snapshot.empty) {
        const expenses = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString(), // Convert to serializable format
          };
        });
        dispatch(userSlice.actions.setExpenses(expenses));
        dispatch(userSlice.actions.setStatus('succeeded'));
      } else {
        console.error('No expenses found');
        dispatch(userSlice.actions.setError('No expenses found'));
        dispatch(userSlice.actions.setStatus('failed'));
      }
    });
  } catch (error) {
    console.error('Error listening to expenses:', error.message);
    dispatch(userSlice.actions.setError(error.message));
    dispatch(userSlice.actions.setStatus('failed'));
  }
};


// Export actions
export const { clearProfile } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
