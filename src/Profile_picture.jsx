import React, { useState,useEffect } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { auth, storage } from './firebase'; // Ensure you import Firebase config
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from '@mui/material';
import { Image } from 'antd';
import './Profile_picture.css';
import { useSelector,useDispatch } from 'react-redux';
import Loader from './Loader';
import { fetchUserProfile } from './Slices/UserSlice';
import { doc, updateDoc } from "firebase/firestore";
import { db } from './firebase'; 
import My_modal from './My_modal';
import Swal from 'sweetalert2'

const Profile_picture = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const { profile, status, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;

  const handleUpload = async (file) => {
    try {
      setLoading(true);
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
  
      // Update Firebase Authentication profile
      await updateProfile(currentUser, { photoURL: downloadURL });
  
      // Update Firestore profile document
      const userDocRef = doc(db, "users", currentUser.uid); // Adjust the path if needed
      await updateDoc(userDocRef, { photoURL: downloadURL });
  
      // Dispatch Redux action to update state
      dispatch(fetchUserProfile(currentUser.uid));
      setModal(false);

      Swal.fire({
        // title: 'Success',
        text: 'Profile picture updated successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
        didOpen: () => {
          const popup = Swal.getPopup();
          if (popup) {
            popup.style.setProperty("border-radius", "2rem", "important");
          }
        },
      })
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        // title: 'Error!',
        text: 'Failed to upload profile picture.',
        icon: 'error',
        confirmButtonText: 'Ok',
        didOpen: () => {
          const popup = Swal.getPopup();
          if (popup) {
            popup.style.setProperty("border-radius", "2rem", "important");
          }
        },
      })
    } finally {
      setLoading(false);
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
  
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await deleteObject(storageRef); // Delete from Firebase Storage
  
      // Set Firebase Authentication photoURL to null
      await updateProfile(currentUser, { photoURL: null });
  
      // Update Firestore document photoURL to null
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { photoURL: null });
  
      // Force refresh of the current user object
      await auth.currentUser.reload();
  
      // Dispatch Redux action to update state
      dispatch(fetchUserProfile(currentUser.uid));
  
      alert("Profile picture deleted successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Failed to delete profile picture.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const showModal = () => setModal(true);
  const handleCancel = () =>{ 
    setFilePreview(null); // Clear the file preview
    setFile(null);
    setModal(false);
  }


  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result); // Set the file preview URL
      };
      reader.readAsDataURL(uploadedFile); // Read the file as a data URL
      setFile(uploadedFile); // Optionally store the file if needed for upload
    }
  };
  

  useEffect(() => {
    console.log("Updated profile from Redux:", profile);
  }, [profile]);

  return (
    <>
      <div className="profile-picture-container">
      {/* <Button type="primary" onClick={showModal}> */}
        <Avatar
          size={50}
          src={profile?.photoURL || 'fallback-image-url.png'} // Fallback in case photoURL is missing
          icon={<UserOutlined />}
          onClick={showModal}
          style={{cursor:'pointer'}}
        />
      {/* </Button> */}
      </div>

      <My_modal isModalOpen={modal} handleCancel={handleCancel}>
        <div className='outermost-container'>
          <div className="outer-container">
              <div className="image-container">
                {profile?.photoURL ? (
                  <img src={filePreview || profile.photoURL} alt="Profile" />
                ) : (
                  <UserOutlined style={{ fontSize: '100px' }} />
                )}
                <label className="edit-button">
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept='.jpg,.jpeg, .png'
                  />
                  {loading ? <Loader size={20} /> : <EditIcon style={{ color: 'white', height: '1rem', width: '1rem' }} />}
                </label>
                {profile ? (
                    <div className='nameContainer'>
                      <p className='name'>{profile.name.toUpperCase()}</p>
                      <p className='email'>{profile.email}</p>
                    </div>
                  ) : (
                    <div className='nameContainer'>
                      <Loader size={15} />
                    </div>
                  )}
              </div>

          </div>
          {file ?<button
                  className='profile_upload_btn'
                  onClick={() => handleUpload(file)}
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >{loading?<Loader size={15}/>:'Save'} </button>
                :''}
          {/* </DialogContent> */}
          {/* <DialogActions>
            <Button onClick={handleCancel} color="primary" disabled={loading}>
              Cancel
            </Button>
            {file && !loading && (
              <Button
                onClick={() => handleUpload(file)}
                color="primary"
                variant="contained"
                disabled={loading}
              >
                Upload
              </Button>
            )}
          </DialogActions> */}
        </div>
      </My_modal>
    </>
  );
};

export default Profile_picture;
