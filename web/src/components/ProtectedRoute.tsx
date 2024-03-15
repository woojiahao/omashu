import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext"
import { useEffect } from "react";

/**
 * Represents a route that should auto-redirect to /login if the user is not logged in.
 */
export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { user, isLoading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading])

  if (!isLoading && !user) {
    navigate('/login');
  }

  return (
    <div>
      {children}
    </div>
  )
}