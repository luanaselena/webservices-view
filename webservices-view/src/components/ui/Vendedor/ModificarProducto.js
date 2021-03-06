import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "react-bootstrap/Alert";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const theme = createTheme();

export default function ModificarProducto() {
	let history = useHistory();

	let usuarioSesion = localStorage.getItem("usuario");
	//Si el usuario no esta logueado no puede entrar a la pagina
	if (usuarioSesion === "" || usuarioSesion === null) {
		history.push("/signin");
	}

	//Transformo el texto en JSON
	usuarioSesion = JSON.parse(usuarioSesion);

	//Parametro que llega desde la url
	const idProducto = useParams().id;

	//States
	const [id, setid] = useState();
	const [nombre, setnombre] = useState("");
	const [descripcion, setdescripcion] = useState("");
	const [imagen, setimagen] = useState("");
	const [categoria, setcategoria] = useState("");
	const [nuevacategoria, setnuevacategoria] = useState("");
	const [precio, setprecio] = useState("");
	const [stockactual, setstockactual] = useState();
	const [stockinicial, setstockinicial] = useState();
	const [formadepago, setformadepago] = useState("");
	const [listacategorias, setlistacategorias] = useState([]);
	const [showalert, setshowalert] = useState(false);

	const fetchApi = async (idProducto) => {
		const resultProducto = await axios.get(
			`http://localhost:8084/productos/ProductoId=${idProducto}`
		);
		console.log(resultProducto.data);

		setid(resultProducto.data.id);
		setnombre(resultProducto.data.nombre);
		setdescripcion(resultProducto.data.descripcion);
		setimagen(resultProducto.data.imagen);
		setcategoria(resultProducto.data.categoria.nombre);
		setprecio(resultProducto.data.precio);
		setstockactual(resultProducto.data.stockActual);
		setstockinicial(resultProducto.data.stockInicial);

		if (resultProducto.data.credito && resultProducto.data.debito) {
			setformadepago("Credito y Debito");
		} else if (resultProducto.data.credito) {
			setformadepago("Credito");
		} else {
			setformadepago("Debito");
		}

		const result = await axios.get(
			`http://localhost:8084/productos/categorias`
		);
		setlistacategorias(result.data);
	};

	useEffect(() => {
		fetchApi(idProducto);
	}, [idProducto]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (
			nombre.trim() === "" ||
			descripcion.trim() === "" ||
			imagen === "" ||
			precio === "" ||
			stockactual === "" ||
			formadepago === "" ||
			categoria.trim() === "" ||
			(categoria.trim() === "nuevacategoria" && nuevacategoria.trim() === "")
		) {
			setshowalert(true);
			return;
		}

		const data = {
			id,
			nombre,
			descripcion,
			imagen,
			precio,
			stockInicial: stockactual,
			stockActual: stockactual,
			activo: true,
			categoria: categoria === "nuevacategoria" ? {nombre: nuevacategoria} : {nombre: categoria},
			vendedor: {id: usuarioSesion.id},
			debito: formadepago === "Debito" || formadepago === "Credito y Debito" ? true : false,
			credito: formadepago === "Credito" || formadepago === "Credito y Debito" ? true : false
		}

		//Envio la info a la api
		const result = await axios.post(
			"http://localhost:8084/productos/updateProducto",
			data
		);
		console.log(result.data);

		//Ir a MisDatos
		history.push("/publicaciones");

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
						Producto {id}
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
									disabled={stockinicial !== stockactual ? true : false}
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
									disabled={stockinicial !== stockactual ? true : false}
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
									disabled={stockinicial !== stockactual ? true : false}
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
										disabled={stockinicial !== stockactual ? true : false}
									>
										<MenuItem value="nuevacategoria">Nueva categoria</MenuItem>
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
									disabled={stockinicial !== stockactual ? true : false}
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<TextField
									required
									fullWidth
									id="stock"
									name="stock"
									label="Stock"
									value={stockactual}
									onChange={(e) => setstockactual(e.target.value)}
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
										MODIFICAR PRODUCTO
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
