import {  createContext, useContext, useState } from "react";

const MyContextStore = createContext()

export const MyStoreProvider=({children})=>{
    const [messages, setMessages] = useState([]);

    const pushMessage=(data)=>{
        setMessages((prevMessages) => [...prevMessages, data]);
    }

    const setFullMessages=(data)=>{
        setMessages(data)
    }

    


    return (
        <MyContextStore.Provider value={{messages, pushMessage, setFullMessages}}>
                {children}
        </MyContextStore.Provider>
    )
} 

export const GetStoreContext=()=>{
    return useContext(MyContextStore)
}