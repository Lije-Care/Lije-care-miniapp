// components/RequireChildren.tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Navigate } from 'react-router-dom';

const RequireChildren = ({ children }: { children: JSX.Element }) => {
  const childrenList = useSelector((state: RootState) => state.children);
    console.log("Children List:", childrenList);
  const hasAtLeastOneChild = childrenList && childrenList?.data.length > 0;
    console.log(childrenList)
    console.log(childrenList?.data)
    
  if (!hasAtLeastOneChild) {
    return <Navigate to="/add-child" replace />;
  }
  console.log("Children exist, rendering children");
  return children;
};

export default RequireChildren;
