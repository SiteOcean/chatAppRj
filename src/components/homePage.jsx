// HomePage.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { current_path } from '../services/serviceConfigs';
import { FaBars } from "react-icons/fa";
import Sidenav from './sidenav';
import { GetStoreContext } from './useContextFile';
const apiUrl = process.env.REACT_APP_NODE_URL;
const socket = io(current_path, {
  transports: ['websocket'],
  withCredentials: true, // Include credentials (cookies) in the request
});



const HomePage = () => {
  const [userdata, setUserdata] = useState(null);
  const navigate = useNavigate();
  const [loginuser, setLoginUser] = useState(null);
  const [selecetedUser, setselecetedUser] = useState({});
  const [sidebar, setSidebar] = useState(false)
  const {oppositeUserOnline, setOnlineUsers} = GetStoreContext()

  const userdatafetch = async (_id) => {
    try {
      const response = await axios.get(`${current_path}/api/usersdata?loginUserId=${_id}`);
      // console.log(response.data);
      setUserdata(response.data.users);
      // Handle the response and update your state as needed
    } catch (error) {
      console.error('Failed to fetch user data:', error.message);
    }
  };
  
  const makeChatsAssReaded = async (selectedUserId) => {
    try {
      await axios.get(`${current_path}/api/makeChatAsRead/${loginuser.userId}/${selectedUserId}`);
    } catch (error) {
      console.error('Failed to mark messages as read:', error.message);
    }
  };
   
  const navigateToChatRoom = (selectedUserId, name) => {
    
    makeChatsAssReaded(selectedUserId)
    
    navigate(`/chatroom/${selectedUserId}/${name}`);
  };

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
    setLoginUser(retrievedData);
    userdatafetch(retrievedData.userId);
  
    const handleOnlineUser = (data) => {
      setOnlineUsers(data);
    };


    const handlePrivateMessage = (data) => {
     
    
      setUserdata((prevUserdata) => {
        // If userdata is initially null, set it to an empty array
        const currentData = prevUserdata || [];
    
        return currentData.map((v) => {
          if (v._id === data.from) {
            return { ...v, unreadMessageCount: (v.unreadMessageCount || 0) + 1 };
          } else {
            return v;
          }
        });
      });
     
    };
    
  
    // Set the active user and listen for connected users
    socket.emit('set-active-user', retrievedData.userId);
    socket.on('connected-users', handleOnlineUser);
    socket.on('private-message', handlePrivateMessage);
    // Cleanup event listeners and disconnect socket when component unmounts
    return () => {
      socket.off('private-message');
      socket.off('connected-users', handleOnlineUser);
     
    };
  }, [navigate, setLoginUser]);
  

  const sidebarHandle=()=>{

    setTimeout(() => {
      setSidebar(false)
    }, 20);
    
  }
  return (
    <>
      {loginuser && (
        <div className="w-full capitalize">
          <div className='flex items-center gap-5 pl-5 bg-[#fc24c6] p-3'>
            <button onBlur={sidebarHandle} onClick={() => setSidebar(true)}>
              <FaBars className='text-[25px] font-bold  text-[#ffffff]  text-center'/>
            </button>
            <h2 className={` duration-500 font-bold text-2xl  text-white ${sidebar ? "ml-[40%] sm:ml-[20%]" : ""}`}>{loginuser.username} Chat App</h2>
          </div>

          <Sidenav sidebar={sidebar} sidebarHandle={sidebarHandle} loginuser={loginuser} />

          <div className='p-3'>
            {userdata && userdata.map((val) => {
              const isOnline = oppositeUserOnline.includes(val._id);

              return (
                <div
                  key={val._id}
                  className="cursor-pointer border hover:bg-slate-100 duration-300 w-[80%] sm:w-[30%] border-gray-200 opacity-65 p-[5px] mb-2 rounded-md flex items-center gap-x-3 relative"
                  onClick={() => navigateToChatRoom(val._id, val.username)}
                >
                  <span className={`w-12 h-12 bg-gray-300 rounded-full text-[10px] flex justify-center items-center ${isOnline ? "text-[green]" : "text-[gray]"}`}>{isOnline ? "online" : "offline"}</span>
                  <span className="mr-2 text-gray-900 font-semibold">{val.username}
                    {val.unreadMessageCount > 0 ? (
                      <span className='absolute -top-1 -right-1 bg-yellow-300 rounded-full p-1 w-5 h-5 
                        text-[10px] font-bold flex items-center justify-center'>{val.unreadMessageCount}
                      </span>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

};

export default HomePage;
