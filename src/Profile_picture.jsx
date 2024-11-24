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


const Profile_picture = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
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
  
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload profile picture.");
    } finally {
      setLoading(false);
      setModal(false);
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
  const handleCancel = () => setModal(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  useEffect(() => {
    console.log("Updated profile from Redux:", profile);
  }, [profile]);

  return (
    <>
      <div className="profile-picture-container">
      <Button type="primary" onClick={showModal}>
        <Avatar
          size={50}
          src={profile?.photoURL || 'fallback-image-url.png'} // Fallback in case photoURL is missing
          icon={<UserOutlined />}
        />
      </Button>
      </div>

      <Dialog open={modal} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <div className="upload-file-container">
            {/* Show profile picture preview if available */}
            {currentUser?.photoURL ? (
              <div className="profile-preview-container">
          {profile?.photoURL ? (
                    <Image
                      src={profile.photoURL}
                      alt="Profile"
                      width={200}
                      height={200}
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    <UserOutlined style={{ fontSize: '100px' }} />
                  )}
                <div className="action-buttons">
                  {/* <button type="button" onClick={}>
                    <EditIcon style={{ color: 'blue', height: '1.5rem', width: '1.5rem' }} />
                  </button> */}
                  <label className="profile-btn">
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <EditIcon style={{ color: 'blue', height: '1.5rem', width: '1.5rem' }} />
                </label>
                  <button type="button" onClick={handleDelete}>
                    <DeleteIcon style={{ color: 'red', height: '1.5rem', width: '1.5rem' }} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <label className="profile-btn">
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <AddPhotoAlternateIcon style={{ color: 'white', height: '3rem', width: '3rem' }} />
                </label>
                <p>Click to upload a profile picture</p>
              </div>
            )}
          </div>
          {loading && <CircularProgress />}
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile_picture;
