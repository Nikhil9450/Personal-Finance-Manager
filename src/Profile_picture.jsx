import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import { Button } from '@mui/material';
import Person2Icon from '@mui/icons-material/Person2';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Profile_picture.css'
import My_modal from './My_modal';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

const Profile_picture = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [modal,setModal]=useState(false)
    const [error,setError]=useState(false);
    const [loader,setLoader]=useState(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Allow only the last uploaded file in the list
    setFileList(newFileList.slice(-1));
  };

  const uploadButton = (
    <div className="custom-upload-btn">
      <div style={{ marginTop: 1}}><Person2Icon style={{height: '2rem', width: '2rem',color:'grey'  }} /></div>
    </div>
  

  );
  const showModal = () => {
    console.log("opening modal");
    setModal(true);
  };

  const handleCancel = () => {
    console.log("closing modal");
    setModal(false);
  };  
  return (
    <>  
        <div className="">
            <button className='upload_btn' style={{display:'flex',flexDirection:'column',justifyContent:'center', alignItems:'center',background:'none'}} type="button"  onClick={showModal}><Person2Icon style={{color:'grey' ,height:'1.5rem',width:'1.8rem'}}/></button>
            {/* <div className='modify_btn_cont'>
                <button type='button' ><EditIcon style={{color:'red',height:'1rem' , width:'1rem'}}/></button>
                <button type='button' ><DeleteIcon style={{color:'green' ,height:'1rem',width:'1rem'}}/></button>
            </div> */}
        </div>
        <My_modal title="Upload profile picture" button_name="Add Salary" isModalOpen={modal} handleCancel={handleCancel}>
        <div className='upload_file_cont'>
            <label className="profile_btn">
                <input type="file" style={{ display: 'none' }} />
                <AddPhotoAlternateIcon  style={{color:'white' ,height:'3rem',width:'3rem'}}/>
            </label>
        </div>
        </My_modal>
    </>
  );
};
export default Profile_picture;