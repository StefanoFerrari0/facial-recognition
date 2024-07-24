import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { Roles } from "../data/constants";
import {
  CameraIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import Card from "../components/Card";
import { Typography } from "@material-tailwind/react";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const admitedRoles = [Roles.SUPERVISOR, Roles.MANAGER, Roles.HR];

  const goToPresentismo = () => {
    navigate("/presentismo");
  };

  const goToUsuarios = () => {
    navigate("/empleados");
  };

  const goToCrearEmpleado = () => {
    navigate("/crear-nuevo-empleado");
  };

  const goToListaPresentismo = () => {
    navigate("/lista-presentismo");
  };

  return (
    <>
      <Typography variant="h1" className="mt-10 text-teal-500">Home</Typography>
      <div className="flex flex-col items-center align-center gap-5">
        <Card
          title="Presentismo"
          description="Pone el presente laboral utilizando reconocimiento facial con nuestra IA."
          icon={CameraIcon}
          onClick={goToPresentismo}
        />
        {admitedRoles.includes(user?.role) ? (
          <>
            <Card
              title="Empleados"
              description="Gestión y administración de cuentas de empleados."
              icon={UserIcon}
              onClick={goToUsuarios}
            />
            <Card
              title="Lista de presentismo"
              description="Ver registros de asistencias e inasistencias."
              icon={ClipboardDocumentCheckIcon}
              onClick={goToListaPresentismo}
            />
          </>
        ) : (
          <>
            <Card
              title="Utiliza tu cara"
              description="¿Queres probar el reconocimiento facial? Rellená un formulario con tus datos y una foto tuya!"
              icon={UserIcon}
              onClick={goToCrearEmpleado}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Home;