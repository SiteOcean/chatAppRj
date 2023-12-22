// HomePage.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { current_path } from '../services/serviceConfigs';
import { FaBars } from "react-icons/fa";
import Sidenav from './sidenav';
const apiUrl = process.env.REACT_APP_NODE_URL;
const socket = io(apiUrl, {
  transports: ['websocket'],
  withCredentials: true, // Include credentials (cookies) in the request
});



const HomePage = () => {
  const [userdata, setUserdata] = useState(null);
  const navigate = useNavigate();
  const [loginuser, setLoginUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [sidebar, setSidebar] = useState(false)
  const userdatafetch = async () => {
    try {
     
      // const response = await axios.get(`${apiUrl}/api/usersdata`);
      const response = await axios.get(`${current_path}/api/usersdata`);
      setUserdata(response.data.users);
    } catch (error) {
      console.error('Failed to fetch user data:', error.message);
    }
  };

  const navigateToAboutPage = (userId, name) => {
    // Mark messages as read when navigating to a new chat
    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [userId]: 0, // Mark all messages as read for the selected user
    }));

    socket.emit('set-active-user', userId);
    navigate(`/particularChat/${userId}/${name}`);
  };

  useEffect(() => {
    userdatafetch();

    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
    setLoginUser(retrievedData);

    // Listen for private messages and update unread message count
    socket.on('private-message', (data) => {
      if (data.to === retrievedData.userId) {
        // Increment unread message count for the recipient
        setUnreadMessages((prevUnreadMessages) => ({
          ...prevUnreadMessages,
          [data.from]: (prevUnreadMessages[data.from] || 0) + 1,
        }));
      }
    });

    return () => {
      // Clean up event listener when component unmounts
      socket.off('private-message');
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
      <div  className="w-full capitalize">
       
        <div className='flex items-center gap-5 pl-5 bg-[#fc24c6] p-3'>
          <button onBlur={sidebarHandle} onClick={()=>setSidebar(true)}>
            <FaBars className='text-[25px] font-bold  text-[#ffffff]  text-center'/>
          </button>
        <h2 className={` duration-500 font-bold text-2xl  text-white ${sidebar ? "ml-[40%] sm:ml-[20%]" : ""}`}>{loginuser.username} Chat App</h2>
        </div>
       
          <Sidenav sidebar={sidebar} sidebarHandle={sidebarHandle} loginuser={loginuser} />
      
        
        <div className='p-3'>
          {userdata &&
            userdata.map((val) => {
              if (loginuser.userId === val._id) return null;
              return (
                <div
                  key={val._id}
                  className="cursor-pointer border hover:bg-slate-100 duration-300 w-[80%] sm:w-[30%] border-gray-200 opacity-65 p-[5px] mb-2 rounded-md flex items-center gap-x-3"
                  onClick={() => navigateToAboutPage(val._id, val.username)}
                >
                  <span className='w-12 h-12 bg-gray-300 rounded-full'></span>
                  <span className="mr-2 text-gray-900 font-semibold">{val.username}</span>
                  {unreadMessages[val._id] > 0 && (
                    <span className="text-red-500">{`(${unreadMessages[val._id]})`}</span>
                  )}
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
