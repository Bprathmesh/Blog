import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const PrivateRoute = ({ children }) => {
  const { userInfo, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;