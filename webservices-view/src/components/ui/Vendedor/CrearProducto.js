import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const theme = createTheme();

export default function CrearProducto() {
	let history = useHistory();

	let usuarioSesion = localStorage.getItem("usuario");
	//Si el usuario no esta logueado no puede entrar a la pagina
	if (usuarioSesion === "" || usuarioSesion === null) {
		history.push("/signin");
	}

	//Transformo el texto en JSON
	usuarioSesion = JSON.parse(usuarioSesion);

	//States
	const [nombre, setnombre] = useState("");
	const [descripcion, setdescripcion] = useState("");
	const [imagen, setimagen] = useState("");
	const [categoria, setcategoria] = useState("");
	const [nuevacategoria, setnuevacategoria] = useState("");
	const [precio, setprecio] = useState("");
	const [stock, setstock] = useState();
	const [formadepago, setformadepago] = useState("");
	const [listacategorias, setlistacategorias] = useState([]);
	const [showalert, setshowalert] = useState(false);

  const fetchApi = async () => {
		const result = await axios.get(`http://localhost:8084/productos/categorias`);
		console.log(result.data);

    setlistacategorias(result.data);
	};

	useEffect(() => {
		fetchApi();
	}, []);


	const handleSubmit = async (event) => {
		event.preventDefault();

		if (
			nombre.trim() === "" ||
			descripcion.trim() === "" ||
			imagen.trim() === "" ||
			precio.trim() === "" ||
			stock.trim() === "" ||
			formadepago === "" ||
			categoria.trim() === "" ||
			(categoria.trim() === "nuevacategoria" && nuevacategoria.trim() === "")
		) {
			setshowalert(true);
			return;
		}

		const data = {
			nombre,
			descripcion,
			imagen,
			precio,
			stockInicial: stock,
			stockActual: stock,
			activo: true,
			nombreCategoria: categoria === "nuevacategoria" ? nuevacategoria : categoria,
			idVendedor: usuarioSesion.id,
			debito: formadepago === "Debito" || formadepago === "Credito y Debito" ? true : false,
			credito: formadepago === "Credito" || formadepago === "Credito y Debito" ? true : false
		}

		console.log(data);

		//Envio la info a la api
		const result = await axios.post(
			"http://localhost:8084/productos/addProducto",
			data
		);

		if(result.data !== "OK"){
			console.log(result.data);
			setshowalert(true);
			return;
		} else {
			//Ir a Publicaciones
			history.push("/publicaciones");
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="sm">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 5,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography component="h1" variant="h5">
						Nuevo producto
					</Typography>

					{showalert ? (
						<Alert
							variant="danger"
							onClose={() => setshowalert(false)}
							dismissible
							style={{ width: "100%" }}
						>
							ERROR: Complete todos los campos requeridos
						</Alert>
					) : null}

					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="nombre"
									label="Nombre"
									name="nombre"
									value={nombre}
									onChange={(e) => setnombre(e.target.value)}
									type="text"
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									multiline
									rows={5}
									id="descripcion"
									label="Descripcion"
									name="descripcion"
									value={descripcion}
									onChange={(e) => setdescripcion(e.target.value)}
									type="text"
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="imagen"
									label="Imagen"
									name="imagen"
									value={imagen}
									onChange={(e) => setimagen(e.target.value)}
									type="text"
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-helper-label">
										Categoria existente
									</InputLabel>
									<Select
										labelId="demo-simple-select-helper-label"
										id="demo-simple-select-helper"
										value={categoria}
										label="Categoria existente"
										onChange={(e) => setcategoria(e.target.value)}
									>
										<MenuItem value="nuevacategoria">
											Nueva categoria
										</MenuItem>
										{listacategorias.map((c) => (
											<MenuItem value={c.nombre}>{c.nombre}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									disabled={categoria === "nuevacategoria" ? false : true}
									id="nuevacategoria"
									label="Nueva Categoria"
									name="nuevacategoria"
									value={nuevacategoria}
									onChange={(e) => setnuevacategoria(e.target.value)}
									type="text"
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<TextField
									required
									fullWidth
									id="precio"
									label="Precio"
									name="precio"
									value={precio}
									onChange={(e) => setprecio(e.target.value)}
									type="number"
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<TextField
									required
									fullWidth
									id="stock"
									name="stock"
									label="Stock"
									value={stock}
									onChange={(e) => setstock(e.target.value)}
									type="number"
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-helper-label">
										Forma de pago
									</InputLabel>
									<Select
										labelId="demo-simple-select-helper-label"
										id="demo-simple-select-helper"
										value={formadepago}
										label="Forma de pago"
										onChange={(e) => setformadepago(e.target.value)}
									>
										<MenuItem value="">
											<em>None</em>
										</MenuItem>
										{["Credito", "Debito", "Credito y Debito"].map((m) => (
											<MenuItem value={m}>{m}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={12}>
								<div className="d-grid gap-2">
									<Button variant="outline-primary" size="lg" type="submit">
										CREAR PRODUCTO
									</Button>
								</div>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
