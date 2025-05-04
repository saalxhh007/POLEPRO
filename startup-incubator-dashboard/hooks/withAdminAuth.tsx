import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";

const withAdminAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const state = useSelector((state: RootState) => state.auth);
    const isAuthenticated = state.isAuthenticated;
    const role = state.role;
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated || role !== 'admin') {
        router.push('/unauthorized');
      }
    }, [isAuthenticated, role, router]);

    if (!isAuthenticated || role !== 'admin') {
      return null; // Prevent rendering if not authorized
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
