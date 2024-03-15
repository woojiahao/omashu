import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext"
import { useContext, useEffect } from "react";

/**
 * Represents a route that should auto-redirect to /login if the user is not logged in.
 */
export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading])

  if (!isLoading && !user) {
    navigate('/login');
  }

  return (
    <div>
      {children}
    </div>
  )
}