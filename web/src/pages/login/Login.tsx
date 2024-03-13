import Layout from "../../components/Layout";
import { useUserContext } from "../../contexts/userContext";
import { useEffect } from 'react';

export default function Login() {
  const { user, login } = useUserContext();

  async function loginUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string },
      password: { value: string },
    };

    // TODO: Add status to this
    await login(target.email.value, target.password.value);
  }

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Layout>
      <div className="w-[50%] mx-auto bg-white rounded-lg shadow-md p-16 pt-4">
        <h1 className="uppercase text-center mt-8 mb-8">Omashu</h1>
        <h2 className="text-center mb-4">Login</h2>
        <button type="button" className="full-width-button bg-red-400 text-white hover:bg-red-600">Login with Google</button>
        <hr className="my-4" />
        <form action="post" className="mb-4" onSubmit={loginUser}>
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="font-bold">Email</label>
            <input type="email" name="email" id="email" className="full-width-input" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-bold">Password</label>
            <input type="password" name="password" id="password" className="full-width-input" />
          </div>

          <button type="submit" className="full-width-button bg-green-200 hover:bg-green-600 hover:text-white">
            Login
          </button>
        </form>

        <p>Don't have an account? <button className="link-button">Create one!</button></p>
      </div>
    </Layout>
  )
}