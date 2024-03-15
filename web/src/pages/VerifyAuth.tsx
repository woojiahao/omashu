import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verify } from "../api/auth/auth.api";
import { navigateWithToast } from "../utilities/navigate";

export default function VerifyAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = searchParams.get('token');

      if (token) {
        // Perform verification
        const result = await verify(token);
        if (!result) {
          navigateWithToast(navigate, '/login', 'Verified your account. You can login now!', 'success');
        } else {
          navigateWithToast(navigate, '/login', `Failed to verify your account because: ${result}`, 'error');
        }
      } else {
        navigateWithToast(navigate, '/login', 'Invalid auth', 'error');
      }
    })();
  }, [])

  return (
    <div>Verifying your token...</div>
  )
}