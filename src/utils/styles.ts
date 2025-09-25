
import { StyleSheet } from "react-native";
/**
 * @description
 * Usar `StyleSheet.create()` en lugar de estilos en línea es recomendable por las siguientes razones:
 * @equality
 * `{}` es diferente de `{}` en React, ya que cada vez que se crea un nuevo objeto en línea, su referencia es distinta, lo que puede causar renderizados innecesarios. Usar `StyleSheet.create` evita este problema al mantener referencias constantes.
*
 * @performance
 * `StyleSheet.create` optimiza los estilos, asegurando que solo se procesen una vez, a diferencia de los estilos en línea que se recrean en cada renderizado, impactando negativamente el rendimiento.
 *
 * @scalability
 * Centraliza y reutiliza los estilos, facilitando la gestión y mantenimiento del código en aplicaciones grandes.
 *
 */
export const gs = StyleSheet.create({
	scroll: {
		overflow: "visible",
		minHeight: "100%",
		flexGrow: 1,
	},
	overlay: {
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		backgroundColor: 'rgba(0,0,0,0.6)',
		alignItems: "center",
		justifyContent: "center",
		zIndex: 999999,
	},
});
