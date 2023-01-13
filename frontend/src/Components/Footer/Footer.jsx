import React from "react";
import './Footer.css'
import {
Box,
Container,
Row,
Column,
FooterLink,
Heading,
} from "./FooterStyled";

export default function footer() {
return (
	<Box className="containerFooter">
	<Container>
		<Row>
		<Column>
			<Heading>Chi siamo?</Heading>
			<FooterLink href="#">Chi siamo</FooterLink>
		</Column>
		<Column>
			<Heading>Servizi</Heading>
			<FooterLink href="#">Servizi</FooterLink>
		</Column>
		<Column>
			<Heading>Contatti</Heading>
			<FooterLink href="#">Contattaci</FooterLink>
		</Column>
		<Column>
			<Heading>Social Media</Heading>
			<div className="social">
				<FooterLink href="#">
				<i className="facebook">
				<img src={require("../../Images/facebook-logo.png")}   height={30} width={30} />
				</i>
				</FooterLink>
				<FooterLink href="#">
				<i className="fab fa-instagram">
				<img src={require("../../Images/instagram-social.png")}  height={32} width={32} />
				</i>
				</FooterLink>
			</div>
		</Column>
		</Row>
	</Container>
	</Box>
 );
};
