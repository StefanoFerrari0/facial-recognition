import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employees";
import { AuthProvider } from "./contexts/authContext";
import AttendanceList from "./pages/AttendanceList";
import Attendance from "./pages/Attendance";
import PrivateRoute from "./components/PrivateRoute";
import AttendanceDetail from "./pages/AttendanceDetail";
import Container from "./components/Container";
import EmployeeForm from "./pages/EmployeeForm"
import PublicEmployeeForm from "./pages/PublicEmployeeForm"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/presentismo" element={<Attendance />} />
            <Route path="/login" element={<Login />} />
            <Route path="/crear-nuevo-empleado" element={<PublicEmployeeForm/>} />
            <Route
              path="/lista-presentismo"
              element={
                <PrivateRoute>
                  <AttendanceList />
                </PrivateRoute>
              }
            />
            <Route
              path="/ver-presentismo/:id"
              element={
                <PrivateRoute>
                  <AttendanceDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/empleados"
              element={
                <PrivateRoute>
                  <Employees />
                </PrivateRoute>
              }
            />
            <Route
              path="/crear-empleado"
              element={
                <PrivateRoute>
                  <EmployeeForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/editar-empleado/:id"
              element={
                <PrivateRoute>
                  <EmployeeForm isEdit />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;