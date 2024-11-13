import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const My_modal = (props) => {
    console.log("My modal props-------->",props);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const showModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleOk = () => {
//     setIsModalOpen(false);
//   };
//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        {props.button_name}
      </Button>
      <AddButton 
                type="expense" 
                icon={<ShoppingCartIcon />} 
                label="Add Expense" 
              /> */}
      <Modal 
      title={props.title} 
      open={props.isModalOpen}  
      onCancel={props.handleCancel} 
      footer={null}>
         {props.children}
      </Modal>
    </>
  );
};
export default My_modal;