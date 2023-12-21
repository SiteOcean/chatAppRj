import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/loginPage';
import HomePage from './components/homePage';
import ParticularChat from './components/particularChat';
import CreateUser from './components/createUser'
import Main from './test/main';
import ChatRoom from './test/listviewcomp';
import './App.css'
import { MyStoreProvider } from './components/useContextFile';
const App = () => {


  return (
    <div className=''>
      <MyStoreProvider>
      {/* <Main/> */}
     <BrowserRouter>
     
     <Routes>
      <Route path='/' element={<LoginPage/>}></Route>
      <Route path='/home' element={<HomePage/>}></Route>
      <Route path='/particularChat/:userId/:name' element={<ParticularChat/>}></Route>
      <Route path='/signup' element={<CreateUser/>}></Route>
       {/* <Route path="/" element={<Main/>} />
        <Route path="/chat/:userId/:name" element={<ChatRoom/>} /> */}
     </Routes>
     </BrowserRouter>
     </MyStoreProvider>
    </div>
  );

};

export default App;
