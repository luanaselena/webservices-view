import React, { useEffect, useState } from "react";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import CardCarrito from "./CardCarrito";
import { useHistory } from "react-router";

const Carrito = () => {
	const history = useHistory();

	const usuarioSesion = localStorage.getItem("usuario");
	//Si el usuario no esta logueado no puede entrar a la pagina
	if (usuarioSesion === "" || usuarioSesion === null) {
		history.push("/signin");
	}

	const [total, settotal] = useState(0);

	var listacarrito = localStorage.getItem("carrito");
	listacarrito = JSON.parse(listacarrito);

	//Obtener los ids de los vendedores
	let listavendedores = [];
	if (listacarrito !== null) {
		listacarrito.forEach((prd) => {
			listavendedores.push(prd.vendedor.id);
		});
	}

	//Elimino duplicados
	listavendedores = listavendedores.filter((item, index) => {
		return listavendedores.indexOf(item) === index;
	});

	const actualizarTotal = () => {
		let price = 0;
		//Cambio el precio total
		var cartlist = localStorage.getItem("carrito");
		cartlist = JSON.parse(cartlist);

		if (cartlist !== null) {
			if (cartlist.length !== 0) {
				cartlist.forEach((prod) => {
					price += prod.precio * prod.cantidad;
				});
			}
		}
		console.log(price);
		settotal(price);
	};

	useEffect(() => {
		actualizarTotal();
	}, [listacarrito]);

	const handleNext = () => {
		if (listacarrito !== null && listacarrito.length !== 0) {
			//Creo la orden y completo el total
			var ordenls = localStorage.getItem("orden");

			const productos = listacarrito.filter(
				(prod) => prod.vendedor.id === listavendedores[0]
			);
			let totalorden = 0;
			productos.forEach((prod) => {
				totalorden = totalorden + prod.precio * prod.cantidad;
			});

			const orden = {
				usuario: null,
				total: totalorden,
				domicilio: null,
				mediopago: null,
				idvendedor: listavendedores[0],
				productos: productos,
			};

			localStorage.setItem("orden", JSON.stringify(orden));

			history.push("/orden");
		}
	};

	return (
		<div style={{ backgroundColor: "#F5F5F5" }}>
			<Container maxWidth="md">
				<Typography variant="h3" align="center" gutterBottom className="pt-3">
					CARRITO
				</Typography>
				<Container maxWidth={"md"} style={{ backgroundColor: "white" }}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="stretch"
					>
						<div className="pt-3">
							{listavendedores.length === 0 ? (
								<Typography variant="h6" align="center" gutterBottom>
									No hay productos en el carrito
								</Typography>
							) : (
								listavendedores.map((vend) => (
									<>
										<Typography variant="h6" align="center" gutterBottom className="mt-3">
											Vendedor {vend}
										</Typography>

										{listacarrito.map((prod) =>
											prod.vendedor.id === vend ? (
												<CardCarrito
													key={prod.id}
													id={prod.id}
													nombre={prod.nombre}
													precio={prod.precio}
													imagen={prod.imagen}
													cantidad={prod.cantidad}
												/>
											) : null
										)}
									</>
								))
							)}
						</div>
					</Grid>
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="flex-end"
						className="pt-5 pb-3"
					>
						<Grid
							container
							direction="row"
							justify="flex-end"
							alignItems="center"
						>
							<Typography variant="h5" gutterBottom>
								Total
							</Typography>
							<div className="pr-5"></div>
							<Typography variant="h5" gutterBottom>
								$ {total.toFixed(2)}
							</Typography>
						</Grid>

						<Button
							variant="contained"
							style={{
								backgroundColor: "#007A9A",
								color: "white",
								marginTop: "20px",
							}}
							size="large"
							onClick={(e) => handleNext()}
						>
							<Typography variant="button" display="block">
								Continuar
							</Typography>
						</Button>
					</Grid>
				</Container>
			</Container>
		</div>
	);
};

export default Carrito;
