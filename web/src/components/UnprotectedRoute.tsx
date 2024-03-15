import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext"
import { useContext, useEffect } from "react";

/**
 * Represents a route that should auto-redirect to / if the user is already logged in.
 */
export default function UnprotectedRoute({ children }: React.PropsWithChildren) {
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user, isLoading])

  if (!isLoading && user) {
    navigate('/');
  }

  return (
    <div>
      {children}
    </div>
  )
}