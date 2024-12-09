import { createSlice } from '@reduxjs/toolkit';
import { doc, collection, onSnapshot, getDoc, updateDoc  } from 'firebase/firestore';
import { db } from '../firebase';
import { act } from 'react';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null, // User profile data
    expenses: [], // User expenses data
    status: 'idle', // idle | loading | succeeded | failed
    error: null, // Error message
    loader:false,
    month_wise_totalExpense:null,
    chart_data_expense:null,
    total_spent_data:null,
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

// export const data_tobe_render =(dateString)=>(getState)=>{
//   const currentExpenses = getState().user.expenses; // Access current expenses from the state

//   const expensesByYear = currentExpenses.reduce((acc, expense) => {
//     const [year, month, day] = expense.expenditure_date.split("-");
//     const date = `${year}-${month}-${day}`;
//     if (!acc[year]) acc[year] = {};
//     if (!acc[year][month]) acc[year][month] = { accumulated: {}, allExpenses: [] };

//     acc[year][month].allExpenses.push({
//       name: date,
//       description: expense.description,
//       expense: Number(expense.price),
//       id: expense.id,
//     });

//     if (!acc[year][month].accumulated[date]) acc[year][month].accumulated[date] = 0;
//     acc[year][month].accumulated[date] += Number(expense.price);
//     return acc;
//   }, {});
//   console.log("datestring--------->",dateString,dateString.split("-"));
//   const [year, month] = dateString.split("-");

//   if (expensesByYear[year] && expensesByYear[year][month]) {
//     setMonthWiseTotalExpense( expensesByYear[year][month]);
//     console.log("total expenses--------->",expensesByYear[year][month]);

//     console.log("inside inner if")

//     const transformedAccumulated = Object.entries(expensesByYear[year][month].accumulated)
//     .map(([date, expense]) => ({
//       name: date.split("-")[2], // Extract the day
//       expense,
//     }))
//     .sort((a, b) => Number(a.name) - Number(b.name)); 
    
//     setChartData(transformedAccumulated);
//     const totalSum = transformedAccumulated.reduce((sum, item) => sum + Number(item.expense), 0);
//     console.log("total sum--------->",totalSum);
//     setTotalSpentAmt(totalSum);
//   }
// }

// Thunk to listen for user profile changes
export const data_tobe_render = (dateString) => (dispatch, getState) => {
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
  } else {
    console.log(`No data found for year: ${year}, month: ${month}`);
  }
};


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
 
export const updateUserExpenses = (uid, itemid, updatedData) => async (dispatch, getState) => {
  dispatch(userSlice.actions.setLoader(true));
  try {
    // Reference the Firestore document
    const itemDoc = doc(db, "users", uid, "items", itemid);
    
    // Update the Firestore document
    await updateDoc(itemDoc, updatedData);
    console.log("Item updated successfully");

    // Update the state
    const currentExpenses = getState().user.expenses; // Access current expenses from the state
    const updatedExpenses = currentExpenses.map((expense) =>
      expense.id === itemid ? { ...expense, ...updatedData } : expense
    );

    // Dispatch updated expenses to the store
    dispatch(userSlice.actions.setExpenses(updatedExpenses));
  } catch (error) {
    console.error("Error updating item:", error);
    dispatch(userSlice.actions.setError(error.message));
  } finally {
    dispatch(userSlice.actions.setLoader(false));
  }
};


export const deleteExpense=(uid,itemid)=>async(dispatch,getState)=>{
  try{
    const itemDoc = doc(db, "users", uid, "items", itemid);
    await deleteDoc(itemDoc);
    console.log("Item deleted successfully");
    const currentExpenses = getState().user.expenses;
    const updatedExpenses = currentExpenses.filter((expense) => expense.id !== itemid); // Remove deleted expense
    dispatch(userSlice.actions.setExpenses(updatedExpenses));

  }catch(error){
    console.error("Error updating item:", error);
    dispatch(userSlice.actions.setError(error.message));
  }finally{
    dispatch(userSlice.actions.setLoader(false));
  }
}

export const createExpenses = (uid, item) => async (dispatch, getState) => {
  dispatch(userSlice.actions.setLoader(true)); // Start loader
  try {
    // Add the new item to the Firestore collection
    const itemsCollection = collection(db, "users", uid, "items");
    const docRef = await addDoc(itemsCollection, item);

    console.log("Item added to Firestore.");

    // Update Redux state with the new item
    const currentExpenses = getState().user.expenses; // Get current state expenses
    const newItem = { id: docRef.id, ...item }; // Merge Firestore-generated ID with item
    const updatedExpenses = [...currentExpenses, newItem]; // Add new item to the state
    dispatch(userSlice.actions.setExpenses(updatedExpenses)); // Update state
  } catch (error) {
    console.error("Error adding item:", error);
    dispatch(userSlice.actions.setError(error.message)); // Handle error
  } finally {
    dispatch(userSlice.actions.setLoader(false)); // Stop loader
  }
};

// Export actions
export const { clearProfile } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
