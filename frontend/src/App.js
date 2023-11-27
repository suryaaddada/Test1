
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Register } from './Components/Register';
import { Login } from './Components/Login';
import { AdminBar } from './Components/AdminBar';
import { GetUser } from './Components/GetUser';
import { ViewBookDetails } from './Components/ViewBookDetails';
import { AddBook } from './Components/AddBook';
import { ViewBook } from './Components/ViewBook';
import { Error } from './Components/Error';
import { ChangePassword } from './Components/ChangePassword';
import { ProtectedRoute } from './ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
       
        <Route path="/" element={<Register />} />

        
        {/* <Route path="login" element={  <Login /> }>

       
            <Route path="admin" element={  <AdminBar />}>
                
                  <Route path="getUser" element={<GetUser />} />
                  <Route path="viewBook" element={<ViewBookDetails />} />
                  <Route path="addbook" element={<AddBook />} />
                  <Route path="editbook" element={<ViewBook />} />
                  <Route path="changePass" element={<ChangePassword />} />
                
              
            </Route>
        </Route> */}

          <Route path="login" element={ <ProtectedRoute> <Login />   </ProtectedRoute>}>

                
              {/* <Route path="admin" element={ <ProtectedRoute> <AdminBar />  </ProtectedRoute>}> */}
              <Route path="admin" element={<AdminBar/>}>
                   
                    <Route path="getUser" element={<GetUser />} />
                    <Route path="viewBook" element={<ViewBookDetails />} />
                    <Route path="addbook" element={<AddBook />} />
                    <Route path="editbook" element={<ViewBook />} />
                    <Route path="changePass" element={<ChangePassword />} />
              </Route>
         
          </Route>

       
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
