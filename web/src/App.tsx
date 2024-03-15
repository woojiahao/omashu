import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <ProtectedRoute>
      <div>Hi</div>
    </ProtectedRoute>
  )
}
