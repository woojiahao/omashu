import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../components/Layout";
import UnprotectedRoute from "../components/UnprotectedRoute";
import { UserContext } from "../contexts/userContext";

export default function Login() {
  const [error, setError] = useState<number | null>(null);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  async function loginUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const target = e.target as typeof e.target & {
      email: { value: string },
      password: { value: string },
    };

    const status = await login(target.email.value, target.password.value);
    if (status !== 204) {
      setError(status);
    } else {
      navigate('/')
    }
  }

  return (
    <UnprotectedRoute>
      <Layout hasToast>
        <div className="w-[50%] mx-auto bg-white rounded-lg shadow-md p-16 pt-4">
          <h1 className="uppercase text-center mt-8 mb-8">Omashu</h1>
          {/* TODO: Style this better */}
          {error && error === 500 && <p className="text-red-600 font-bold">Something went wrong on our end. Please try again.</p>}
          <h2 className="text-center mb-4">Login</h2>
          <button type="button" className="full-width-button bg-red-400 text-white hover:bg-red-600">Login with Google</button>
          <hr className="my-4" />
          <form action="post" className="mb-4" onSubmit={loginUser}>
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="font-bold">Email</label>
              <input type="email" name="email" id="email" className="full-width-input" />
              {error && error === 404 && <p className="text-red-600">We could not find an account with this email</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-bold">Password</label>
              <input type="password" name="password" id="password" className="full-width-input" />
              {error && error === 401 && <p className="text-red-600">The password does not seem quite right</p>}
            </div>

            <button type="submit" className="full-width-button bg-green-200 hover:bg-green-600 hover:text-white">
              Login
            </button>
          </form>

          <p>Don't have an account? <button className="link-button" onClick={() => navigate('/register')}>Create one!</button></p>
        </div>
      </Layout>
    </UnprotectedRoute >
  )
}