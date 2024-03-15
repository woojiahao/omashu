import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext"
import { useContext, useEffect, useState } from "react";
import Layout from "./Layout";
import { resendVerification } from "../api/auth/auth.api";

/**
 * Represents a route that should auto-redirect to /login if the user is not logged in.
 */
export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { user, isLoading } = useContext(UserContext);
  const [hasResent, setHasResent] = useState<boolean | null>(null);
  const navigate = useNavigate();

  async function resendVerificationLocal() {
    await resendVerification()
    setHasResent(true);
  }

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && user && !user.is_verified) {
      // TODO: Figure out how to render this page inside effect
      console.error('Not verified!');
    }
  }, [user, isLoading])

  if (!isLoading && !user) {
    navigate('/login');
  } else if (!isLoading && user && !user.is_verified) {
    return (
      <Layout>
        <div className="bg-white p-8 text-center flex flex-col gap-y-4 w-[50%] mx-auto">
          <h2>Stop! Your account has not been verified yet!</h2>
          <div>
            <p>To continue with Omashu, please verify your account.</p>
            <p>More information should be available in your email.</p>
            <p>(Check your junk folder as well!)</p>
          </div>
          {hasResent ? <p>Resent! Check your inbox for the verification email!</p> : <button type="button" onClick={resendVerificationLocal} className="full-width-button bg-green-200 hover:bg-green-600 hover:text-white">Resend Verification Email</button>}
        </div>
      </Layout>
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}