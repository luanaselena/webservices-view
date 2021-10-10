import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import SignUp from "./components/ui/auth/SignUp";
import SignIn from "./components/ui/auth/SignIn";
import Navegacion from "./components/ui/Navegacion";
import StickyFooter from "./components/ui/StickyFooter";
import DatosUsuario from "./components/ui/DatosUsuario";
import NuevaTarjeta from "./components/ui/NuevaTarjeta";
import NuevoDomicilio from './components/ui/NuevoDomicilio';
import Catalogo from "./components/ui/Catalogo/Catalogo";
import Producto from "./components/ui/Catalogo/Producto";
import Carrito from "./components/ui/Carrito/Carrito";

function App() {
  return (
    <Router>
      <div>
        <Navegacion />

        <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/misdatos">
            <DatosUsuario />
          </Route>
          <Route path="/nuevodomicilio">
            <NuevoDomicilio />
          </Route>
          <Route path="/nuevatarjeta">
            <NuevaTarjeta />
          </Route>
          <Route path="/catalogo">
            <Catalogo />
          </Route>
          <Route path="/producto/:id">
            <Producto />
          </Route>
          <Route path="/carrito">
            <Carrito />
          </Route>
          <Route path="/">
          </Route>
        </Switch>

      </div>
    </Router>
  );
}

export default App;
