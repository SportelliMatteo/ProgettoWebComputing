import React from "react";
import {Link } from 'react-router-dom';
import './Footer.css'
import {
Box,
Container,
Row,
Column,
FooterLink,
Heading,
Contattaci,
} from "./FooterStyled";

export default function footer() {

	function openEmail(){
		window.open('mailto:restbookwebsite@gmail.com?subject=Richiesta assistenza')
	}

return (
	<Box className="containerFooter">
	<Container>
		<Row>
		<Column>
			<Heading>Ristoranti</Heading>
			<FooterLink href="/">Ristoranti</FooterLink>
		</Column>
		<Column>
			<Heading>Contatti</Heading>
			<Contattaci><p onClick={openEmail}>  Contattaci</p> </Contattaci>
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
