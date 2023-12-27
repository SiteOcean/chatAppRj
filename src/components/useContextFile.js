import {  createContext, useContext, useState } from "react";

const MyContextStore = createContext()

export const MyStoreProvider=({children})=>{
    const [messages, setMessages] = useState([]);
    const [oppositeUserOnline, setOppositeUserOnline] = useState([]);

    const pushMessage=(data)=>{
        setMessages((prevMessages) => [...prevMessages, data]);
    }

    const setFullMessages=(data)=>{
        setMessages(data)
    }

    const setChatAsRead = (_id) => {

        setMessages((prevMessages) =>
          prevMessages.map((val) => {
            if (val._id === _id) {
                console.log(val._id," === ",_id)
              return { ...val, read: true }; // Update read to true
            } else {
              return val;
            }
          })
        );
      };

      const markAllMessagesAsRead = () => {
      
        
      };
      

      
      const setOnlineUsers=(data)=>{
        setOppositeUserOnline(data);
      }
    


    return (
        <MyContextStore.Provider value={{messages, pushMessage, setFullMessages, setChatAsRead,
          oppositeUserOnline, setOnlineUsers, markAllMessagesAsRead}}>
                {children}
        </MyContextStore.Provider>
    )
} 

export const GetStoreContext=()=>{
    return useContext(MyContextStore)
}