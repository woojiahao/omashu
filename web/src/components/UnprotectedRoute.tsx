import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext"
import { useEffect } from "react";

/**
 * Represents a route that should auto-redirect to / if the user is already logged in.
 */
export default function UnprotectedRoute({ children }: React.PropsWithChildren) {
  const { user, isLoading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [isLoading])

  if (!isLoading && user) {
    navigate('/');
  }

  return (
    <div>
      {children}
    </div>
  )
}