// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const ProtectedRoute = ({ component: Component, allowedRoles, role, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       allowedRoles.includes(role) ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to="/*" />
        
//       )
//     }
//   />
// );

// export default ProtectedRoute;



import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

const RoleBased = ({ component: Component, allowedRoles, role, ...rest }) => {
  const navigate = useNavigate();

  return (
    <Route
      {...rest}
      element={
        allowedRoles.includes(role) ? (
          <Component />
        ) : (
          
          navigate('/*')
        )
      }
    />
  );
};

export default RoleBased;
