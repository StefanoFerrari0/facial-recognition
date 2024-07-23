import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../api/user";
import { AuthContext } from "../../contexts/authContext";
import {
  Navbar as NavbarMaterial,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../Logo"

const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await userService.logout();
      if (response.status === 200) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      const errorResponse = error.response.data;
      console.log(errorResponse);
    }
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  function NavList() {
    const listItemClassName =
      "flex text-slate items-center gap-2 py-2 pr-4 cursor-pointer capitalize transition-colors duration-300 hover:text-slate focus:text-slate hover:bg-teal-500 focus:bg-teal-500";
    return (
      <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
        <Typography as="a" href="/" className="font-medium">
          <ListItem className={listItemClassName}>Home</ListItem>
        </Typography>
        <Typography
          as="a"
          href="/presentismo"
          className="font-medium text-slate hover:text-teal-500"
        >
          <ListItem className={listItemClassName}>Presentismo</ListItem>
        </Typography>
        {user ? (
          <>
            <Typography
              as="a"
              href="/empleados"
              className="font-medium text-slate hover:text-teal-500"
            >
              <ListItem className={listItemClassName}>Empleados</ListItem>
            </Typography>
            <Typography
              as="a"
              href="/lista-presentismo"
              className="font-medium text-slate hover:text-teal-500"
            >
              <ListItem className={listItemClassName}>
                Lista de presentismo
              </ListItem>
            </Typography>
          </>
        ) : (
          <>
           <Typography
              as="a"
              href="/crear-nuevo-empleado"
              className="font-medium text-slate hover:text-teal-500"
            >
              <ListItem className={listItemClassName}>
                Utiliza tu cara
              </ListItem>
            </Typography>
          </>
        )}
      </List>
    );
  }

  return (
    <NavbarMaterial
      className="mx-auto px-4 py-2 bg-midnight/90 border border-0"
      fullWidth
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
          <Logo/>
          </Link>
          <Typography
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2 text-slate"
          >
            CheckFace
          </Typography>
        </div>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden gap-2 lg:flex">
          {isAuthenticated ? (
            <Button
              variant="gradient"
              size="sm"
              color="red"
              onClick={handleLogout}
            >
              <span>Cerrar sesión</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="gradient" color="green" size="sm">
                <span>Iniciar sesión</span>
              </Button>
            </Link>
          )}
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          {isAuthenticated ? (
            <Button
              fullWidth
              variant="gradient"
              color="red"
              size="sm"
              onClick={handleLogout}
            >
              <span>Cerrar sesión</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button fullWidth variant="gradient" color="green" size="sm">
                <span>Iniciar sesión</span>
              </Button>
            </Link>
          )}
        </div>
      </Collapse>
    </NavbarMaterial>
  );
};

export default Navbar;