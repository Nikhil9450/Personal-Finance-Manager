import React, { useEffect, useState ,useRef} from 'react';
import { useSelector } from 'react-redux';
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import classes from './daily_expenses_chart.module.css';
import moment from 'moment';
import My_modal from '../../My_modal';
import Update_expense from '../Dashboard/Components/Update_expense';
import { Avatar, List } from 'antd';
import { Button } from 'antd';
import Loader from '../../Loader';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useDispatch } from 'react-redux';
import {data_tobe_render,deleteExpense } from '../../Slices/UserSlice';
import Swal from 'sweetalert2';
// import { BarChart } from '@mui/x-charts/BarChart';
import BarChart from './BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import AddExpenses from '../Dashboard/Components/AddExpenses';
import AreaChart from './AreaChart';
// import CategorizeExpenses from '../Dashboard/Components/CategorizeExpenses';


const Daily_expenses_chart = (props) => {
  const Expense_data = useSelector((state) => state.user.expenses);
  const Monthly_total_data = useSelector((state) => state.user.month_wise_totalExpense);
  const Chart_data = useSelector((state) => state.user.chart_data_expense);
  const Total_spent_amt = useSelector((state) => state.user.total_spent_data);
  const [modal, setModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dispatch = useDispatch();
  const [loadingItems, setLoadingItems] = useState({});

  const showModal = () => setModal(true);
  const handleCancel = () => setModal(false);

  useEffect(() => {
    const currentMonth = (!props.date) ? moment().format('YYYY-MM') : props.date;
    dispatch(data_tobe_render(currentMonth));
  }, [props.date]);

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
    <>
      <AddExpenses />
      {Chart_data.length > 0 ? (
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>

            {/* <p style={{ color: "#127afb", cursor: "pointer", fontSize: "12px" }} onClick={showModal}>
              View expenses
            </p> */}
            <p className={classes.current_spend}>
                Current spend <span>₹ {Total_spent_amt}</span> 
            </p>
            <p>
              Saving Goal - {}
            </p>
          </div>
          <div className={classes.chart_container}>
            <AreaChart Chart_data={Chart_data} />
          </div>
        </div>
      ) : (
        <div className={classes.empty_graph_handler}>No expenses to display</div>
      )}
      <My_modal title={`Expenses (${props.year_month})`} isModalOpen={modal} handleCancel={handleCancel}>
        <div className={classes.expense_list_container}>
          {Object.keys(Monthly_total_data).length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={Monthly_total_data.allExpenses}
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
    </>
  );
};

export default Daily_expenses_chart;

