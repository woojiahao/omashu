import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterError } from "../api/auth/auth.api";
import Layout from "../components/Layout";
import UnprotectedRoute from "../components/UnprotectedRoute";
import { UserContext } from "../contexts/userContext";
import { navigateWithToast } from '../utilities/navigate';

export default function Register() {
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<RegisterError | null>(null);

  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  async function loginUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorCode(null);
    setErrorMessage(null);

    const target = e.target as typeof e.target & {
      email: { value: string },
      password: { value: string },
      username: { value: string },
    };

    const {
      email: { value: email },
      password: { value: password },
      username: { value: username }
    } = target;

    const status = await register(email, username, password);
    if (!status) {
      navigateWithToast(navigate, '/login', 'Account created successfully! Verify your account before logging in. Check your email for further instructions.', 'notification');
    } else {
      const [errorCode, errorMessage] = status;
      setErrorCode(errorCode);
      setErrorMessage(errorMessage);
    }
  }

  return (
    <UnprotectedRoute>
      <Layout>
        <div className="w-[50%] mx-auto bg-white rounded-lg shadow-md p-16 pt-4">
          <h1 className="uppercase text-center mt-8 mb-8">Omashu</h1>
          {/* TODO: Style this better */}
          {errorCode && errorCode === 500 && <p className="text-red-600 font-bold">Something went wrong on our end. Please try again.</p>}
          <h2 className="text-center mb-4">Register</h2>
          <form action="post" className="mb-4" onSubmit={loginUser}>
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="font-bold">Email</label>
              <input type="email" name="email" id="email" required className="full-width-input" />
              {errorCode && errorCode === 409 && errorMessage === 'User with email already exists' && <p className="text-red-600">{errorMessage}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="password" className="font-bold">Password</label>
              <input type="password" name="password" id="password" required className="full-width-input" />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="username" className="font-bold">Username</label>
              <input type="username" name="username" id="username" required className="full-width-input" />
              {errorCode && errorCode === 409 && errorMessage === 'User with username already exists' && <p className="text-red-600">{errorMessage}</p>}
            </div>

            <button type="submit" className="full-width-button bg-green-200 hover:bg-green-600 hover:text-white">
              Register
            </button>
          </form>

          <p>Already have an account? <button className="link-button" onClick={() => navigate('/login')}>Login here!</button></p>
        </div>
      </Layout>
    </UnprotectedRoute>
  )
}