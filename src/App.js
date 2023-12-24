// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/loginPage';
import HomePage from './components/homePage';
import ChatRoom from './components/chatRoom';
import CreateUser from './components/createUser';
import PrivateRoute from './userAuth/privateRoute'; // Update the path accordingly
import { MyStoreProvider } from './components/useContextFile';

const App = () => {
  return (
    <div className=''>
      <MyStoreProvider>
        <Router>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>}/>  
            <Route path='/chatroom/:userId/:name' element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
            <Route path='/signup' element={<CreateUser />} />
                
              
          </Routes>
        </Router>
      </MyStoreProvider>
    </div>
  );
};

export default App;
