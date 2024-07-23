import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../api/user";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import Alert from "../components/Alert";
import Webcam from "react-webcam";
import { dataURLToBlob } from "blob-util";

const PublicEmployeeForm = () => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dni: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setEmployee({ ...employee, image: imageSrc });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      const data = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        dni: employee.dni,
      };

      const blob = dataURLToBlob(employee.image);
      formData.append("image", blob, "capture.jpg");
      formData.append("data", JSON.stringify(data));
      console.log(formData)
      await UserService.createUserPublic(formData);
      navigate("/presentismo");
    } catch (err) {
      setError(err.response?.data?.message || `Error al crear empleado`);
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 mt-20" shadow={false}>
      {error && <Alert message={error} />}
      <Typography variant="h4" color="blue-gray">
        Crear empleado
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        ¡Por favor, rellene los datos del empleado!
      </Typography>

      <form
        className="mt-6 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-1 flex flex-col gap-6">
          <Input
            size="lg"
            color="teal"
            label="Nombre/s"
            value={employee.firstName}
            onChange={handleChange}
            placeholder="Ingresa nombre"
            name="firstName"
            required
          />

          <Input
            size="lg"
            color="teal"
            label="Apellido/s"
            value={employee.lastName}
            onChange={handleChange}
            placeholder="Ingresa apellido"
            name="lastName"
            required
          />

          <Input
            size="lg"
            type="email"
            color="teal"
            label="Email"
            value={employee.email}
            onChange={handleChange}
            placeholder="Ingresa email"
            name="email"
            required
          />

          <Input
            size="lg"
            color="teal"
            label="DNI"
            value={employee.dni}
            onChange={handleChange}
            placeholder="Ingresa DNI"
            name="dni"
            required
          />

          <div className="flex flex-col items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
            />
            <Button color="teal" onClick={handleCapture} className="mt-2">
              Capturar Imagen
            </Button>
            {capturedImage && (
              <img src={capturedImage} alt="Captured" className="mt-2" />
            )}
          </div>
        </div>

        <Button
          type="submit"
          color="teal"
          className="mt-6"
          loading={loading}
          fullWidth
        >
          Crear
        </Button>
      </form>
    </Card>
  );
};

export default PublicEmployeeForm;