import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect,useState } from "react";
import {auth} from "../../../firebase";
import React from 'react'

const AuthDetails = () => {
    const[authUser,setAuthUser]=useState(null);
    useEffect(()=>{
        const listen = onAuthStateChanged(auth,(user)=>{
            if(user){
                setAuthUser(user)
            }else{
                setAuthUser(null);
            }
        })
        
    },[]);
    const userSignOut=()=>{
        signOut(auth).then(()=>{
           console.log('sign out successful.'); 
        }).catch(error=>console.log(error))
    }
  return (
    <div>{authUser?<><p>Singed In</p><button onClick={userSignOut}>Signout</button></>: <p>Signed Out</p>}</div>
  )
}

export default AuthDetails