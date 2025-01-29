import React, { useEffect,useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import classes from './RecentTransaction.module.css';
import { Avatar, List } from 'antd';
import { Button } from 'antd';
import My_modal from '../../../My_modal';
import Update_expense from './Update_expense';
import { deleteExpense } from '../../../Slices/UserSlice';
import Loader from '../../../Loader';

export default function RecentTransactions(props) {
  const MonthlyTotalData = useSelector((state) => state.user.month_wise_totalExpense);
  const [modal, setModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dispatch = useDispatch();
  const [loadingItems, setLoadingItems] = useState({});

  const showModal = () => setModal(true);
  const handleCancel = () => setModal(false);
  useEffect(() => {
    console.log("MonthlyTotalData in recent transactions--------------->", MonthlyTotalData);
  }, [MonthlyTotalData]);

  if (!MonthlyTotalData.allExpenses ) {
    return <p>No recent transactions available</p>;
  }

  // Sort transactions by date (descending) and get the 5 most recent
  const recentTransactions = [...MonthlyTotalData.allExpenses]
    .sort((a, b) => new Date(b.name) - new Date(a.name))
    .slice(0, 5);

      const deleteitem = (itemId) => {
        setItemToDelete(itemId);
        setIsDeleteModalOpen(true);
      };
    
      const confirmDelete = async () => {
        if (!itemToDelete) return;
    
        setLoadingItems((prev) => ({ ...prev, [itemToDelete]: true }));
    
        try {
          await dispatch(deleteExpense(itemToDelete));
          console.log("Expense deleted:", itemToDelete);
        } catch (error) {
          console.error("Error while deleting the expense:", error);
        } finally {
          setLoadingItems((prev) => ({ ...prev, [itemToDelete]: false }));
          setItemToDelete(null);
          setIsDeleteModalOpen(false);
        }
      };
    
      const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      };
    

  return (
    <div className={classes.recentTransactions}>
        <p className={classes.title}>Recent Expenses</p>
      <ul className={classes.transactionsList}>
        {recentTransactions.map((transaction) => (
          <li key={transaction.id} className={classes.transactionItem}>
            <div className={classes.transactionAvatar}>
              <div className={classes.avatarIcon}>💸</div>
            </div>
            <div className={classes.transactionDetails}>
              <p className={classes.transactionName}>{transaction.description}</p>
              <p className={classes.transactionDate}>{transaction.name}</p>
            </div>
            <div className={classes.transactionAmount}>₹{transaction.expense}</div>
          </li>
        ))}
      </ul>
      <div className={classes.viewAll}>
        <a href="#" className={classes.viewAllLink} onClick={(e) => {
          e.preventDefault(); // Prevents the default navigation
          showModal(); // Opens the modal
        }}>
          View/Modify All Expenses
        </a>
      </div>

      <My_modal title={`Expenses (${props.year_month})`} isModalOpen={modal} handleCancel={handleCancel}>
        <div className={classes.expense_list_container}>
          {Object.keys(MonthlyTotalData).length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={MonthlyTotalData.allExpenses}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div className={classes.list_avatar}>
                        <h4>{new Date(item.name).toLocaleString("default", { month: "short" }).toUpperCase()}</h4>
                        <p>{new Date(item.name).getDate()}</p>
                      </div>
                    }
                    title={<h5>{item.description}</h5>}
                    description={<p>{item.expense}</p>}
                  />
                  <Update_expense itemId={item.id} />
                  {loadingItems[item.id] ? (
                    <Loader size={20} />
                  ) : (
                    <img
                      src="/Icons/delete.png"
                      onClick={() => deleteitem(item.id)}
                      alt="Delete"
                      style={{ height: "1.4rem", cursor: "pointer" }}
                    />
                  )}
                </List.Item>
              )}
            />
          ) : (
            <div className={classes.empty_list_handler}>No expenses to display</div>
          )}
        </div>
      </My_modal>

      {/* Delete Confirmation Modal */}
      <My_modal title="Delete Confirmation" isModalOpen={isDeleteModalOpen} handleCancel={cancelDelete}>
        <p>Are you sure you want to delete this expense?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button type="primary" danger onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </My_modal>
    </div>
  );
}
