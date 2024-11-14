import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const My_modal = (props) => {
  
  return (
    <>
          <style>
              {`
                .custom-modal .ant-modal-content {
                  border-radius: 30px !important;
                  overflow: hidden !important;
                  {/* padding:2rem !important */}
                }
              `}
      </style>
      <Modal 
      title={props.title} 
      open={props.isModalOpen}  
      onCancel={props.handleCancel} 
      footer={null} 
      className="custom-modal"
      >
         {props.children}
      </Modal>
    </>
  );
};
export default My_modal;