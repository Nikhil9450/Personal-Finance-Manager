import { createSlice } from '@reduxjs/toolkit';
import { doc, collection, onSnapshot, getDoc, updateDoc ,deleteDoc,addDoc,setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid:null,
    profile: null, // User profile data
    expenses: [], // User expenses data
    creation_status: 'idle', // idle | loading | success | failed
    deletion_status: 'idle', // idle | loading | success | failed
    updation_status: 'idle', // idle | loading | success | failed
    status: 'idle', // idle | loading | success | failed
    error: null, // Error message
    loader:false,
    month_wise_totalExpense:{},
    chart_data_expense:[],
    total_spent_data:null,
  },
  reducers: {
    setUid: (state, action) => {
      state.uid = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setCreationStatus: (state, action) => {
      state.creation_status = action.payload;
    },
    setDeletionStatus: (state, action) => {
      state.deletion_status = action.payload;
    },
    setUpdationStatus: (state, action) => {
      state.updation_status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.expenses = [];
    },
    setLoader:(state,action)=>{
      state.loader=action.payload
    },
    setMonthWiseTotalExpense:(state,action)=>{
      state.month_wise_totalExpense=action.payload
    },
    setChartData:(state,action)=>{
      state.chart_data_expense=action.payload
    },
    setTotalSpentAmt:(state,action)=>{
      state.total_spent_data=action.payload
    }
  },
});

// Thunk to listen for user profile changes
export const data_tobe_render = (dateString) => (dispatch, getState) => {
  console.log("datestring from slice",dateString);
  
  // dispatch(userSlice.actions.setLoader(true));
  const currentExpenses = getState().user.expenses; // Access current expenses from state

  // Group expenses by year and month
  const expensesByYear = currentExpenses.reduce((acc, expense) => {
    const [year, month, day] = expense.expenditure_date.split("-");
    const date = `${year}-${month}-${day}`;

    // Initialize year and month in accumulator
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = { accumulated: {}, allExpenses: [] };

    // Add expense to the month's list of all expenses
    acc[year][month].allExpenses.push({
      name: date,
      description: expense.description,
      expense: Number(expense.price),
      id: expense.id,
      category:expense.category,
    });

    // Accumulate expenses for the specific date
    if (!acc[year][month].accumulated[date]) acc[year][month].accumulated[date] = 0;
    acc[year][month].accumulated[date] += Number(expense.price);

    return acc;
  }, {});

  // Extract year and month from the dateString
  const [year, month] = dateString.split("-");

  // Check if data exists for the given year and month
  if (expensesByYear[year] && expensesByYear[year][month]) {
    const monthlyData = expensesByYear[year][month];

    // Dispatch month-wise total expense
    dispatch(userSlice.actions.setMonthWiseTotalExpense(monthlyData));

    // Transform accumulated data for chart representation
    const transformedAccumulated = Object.entries(monthlyData.accumulated)
      .map(([date, expense]) => ({
        name: date.split("-")[2], // Extract day
        expense,
      }))
      .sort((a, b) => Number(a.name) - Number(b.name)); // Sort by day

    // Dispatch chart data
    dispatch(userSlice.actions.setChartData(transformedAccumulated));

    // Calculate and dispatch total spent amount
    const totalSum = transformedAccumulated.reduce(
      (sum, item) => sum + Number(item.expense),
      0
    );
    dispatch(userSlice.actions.setTotalSpentAmt(totalSum));
    // dispatch(userSlice.actions.setLoader(false));
  } else {
    dispatch(userSlice.actions.setChartData({}));
    dispatch(userSlice.actions.setTotalSpentAmt(""));
    dispatch(userSlice.actions.setStatus("failed"));
    dispatch(userSlice.actions.setMonthWiseTotalExpense({}));
    // dispatch(userSlice.actions.setLoader(false));

    console.log(`No data found for year: ${year}, month: ${month}`);
  }
};


export const listenToUserProfile = (uid) => (dispatch) => {
  console.log("this is user id--------->",uid)
  dispatch(userSlice.actions.setUid(uid));
  dispatch(userSlice.actions.setLoader(true));

  try {
    // dispatch(userSlice.actions.setStatus('loading'));
    const userDocRef = doc(db, 'users', uid);
    onSnapshot(userDocRef, (docSnap) => {
      console.log("onSnapshot of listen to user profile is triggered")
      if (docSnap.exists()) {
        dispatch(userSlice.actions.setProfile(docSnap.data()));
        // dispatch(userSlice.actions.setStatus('success'));
      } else {
        console.error('User profile not found');
        dispatch(userSlice.actions.setError('User profile not found'));
        // dispatch(userSlice.actions.setStatus('failed'));
      }
      dispatch(userSlice.actions.setLoader(false));

    });
  } catch (error) {
    console.error('Error listening to user profile:', error.message);
    dispatch(userSlice.actions.setError(error.message));
    dispatch(userSlice.actions.setLoader(false));
    // dispatch(userSlice.actions.setStatus('failed'));
  }
};

// Thunk to listen for user expenses list changes
export const listenToUserExpenses = (uid) => (dispatch) => {
  try {
    // dispatch(userSlice.actions.setStatus('loading'));

    const userExpenseListRef = collection(db, 'users', uid, 'items');
    onSnapshot(userExpenseListRef, (snapshot) => {
      console.log("onSnapshot of listenToUserExpenses is triggered")
      if (!snapshot.empty) {
        const expenses = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt), // Convert to serializable format
          };
        });
        dispatch(userSlice.actions.setExpenses(expenses));
        
        // dispatch(userSlice.actions.setStatus('success'));
      } else {
        console.error('No expenses found');
        dispatch(userSlice.actions.setError('No expenses found'));
        // dispatch(userSlice.actions.setStatus('failed'));
      }
    });
  } catch (error) {
    console.error('Error listening to expenses:', error.message);
    dispatch(userSlice.actions.setError(error.message));
    // dispatch(userSlice.actions.setStatus('failed'));
  }
};
 
export const updateUserExpenses = (itemid, updatedData) => async (dispatch, getState) => {
  const uid = getState().user.uid;

  dispatch(userSlice.actions.setLoader(true));
  dispatch(userSlice.actions.setStatus("loading"));

  try {
    // Reference the Firestore document
    const itemDoc = doc(db, "users", uid, "items", itemid);

    // Update the Firestore document
    await updateDoc(itemDoc, updatedData);

    console.log("Item updated successfully");

    // No need to manually update Redux state here
    dispatch(userSlice.actions.setStatus("success"));
  } catch (error) {
    console.error("Error updating item:", error);
    dispatch(userSlice.actions.setError(error.message || "An unexpected error occurred"));
    dispatch(userSlice.actions.setStatus("failed"));
  } finally {
    dispatch(userSlice.actions.setLoader(false));
  }
};


export const deleteExpense = (itemid) => async (dispatch, getState) => {
  console.log("delete executed from slice");
  const uid = getState().user.uid;
  dispatch(userSlice.actions.setStatus("loading"));
  try {
    const itemDoc = doc(db, "users", uid, "items", itemid);
    await deleteDoc(itemDoc);
    console.log("Item deleted successfully");

    // No need to manually update Redux state here, as onSnapshot will handle it
    dispatch(userSlice.actions.setStatus("success"));
  } catch (error) {
    console.error("Error deleting item:", error);
    dispatch(userSlice.actions.setError(error.message));
    dispatch(userSlice.actions.setStatus("failed"));
  } finally {
    dispatch(userSlice.actions.setLoader(false));
  }
};

export const createExpenses = (item) => async (dispatch, getState) => {
  console.log("Inside createExpenses with item:", item);
  dispatch(userSlice.actions.setLoader(true));
  dispatch(userSlice.actions.setCreationStatus("loading"));

  const uid = getState().user.uid;
  try {
    const itemsCollection = collection(db, "users", uid, "items");
    const docRef = await addDoc(itemsCollection, item);
    console.log("Item successfully added to Firestore:", docRef);

    // No need to manually update Redux state here
    dispatch(userSlice.actions.setCreationStatus("success"));
  } catch (error) {
    console.error("Error in createExpenses:", error);
    dispatch(userSlice.actions.setCreationStatus("failed"));
    dispatch(userSlice.actions.setError(error.message));
  } finally {
    dispatch(userSlice.actions.setLoader(false));
    dispatch(userSlice.actions.setCreationStatus("idle"));
    console.log("Exiting createExpenses");
  }
};


export const { clearProfile } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
