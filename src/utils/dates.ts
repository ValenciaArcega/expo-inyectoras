/**
 * Calculate the given date string and returns the remaining time from today
 * until a specific date. The result dynamically omits null values, only 
 * showing relevant units.
 * IN: 2025-01-31T20:21:49
 * OT: 2 días, 6 horas, 48 minutos, 50 segundos
 */
export function formatToCounterUntilDate(date: string): string {
	const parts: string[] = [];
	const today: Date = new Date();
	const targetDate: Date = new Date(date);
	const diffInMs = targetDate.getTime() - today.getTime();

	if (diffInMs <= 0) return "";

	const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);


	if (days > 0)
		parts.push(`${days} día${days !== 1 ? 's' : ''}`);
	if (hours > 0)
		parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`);
	if (minutes > 0 || (days === 0 && hours === 0 && minutes > 0 && seconds > 0))
		parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
	if (seconds > 0 || (days === 0 && hours === 0 && minutes === 0))
		parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);

	return parts.length > 0
		? `${parts.join(', ')}`
		: "";
}
/**
 * Formats a given date string to a day-month-year format in Spanish.
 * This function takes an input date in ISO 8601 format and returns it as a string
 * formatted as "day shortMonth year", where the short month is the abbreviated
 * month name in Spanish.
 * IN: 2024-01-27T20:21:49
 * OT: 27 ene 2024
 */

export function formatToDDMonthYYYY(date: string) {
	return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
/**
 * Formats a given date string to a more readable format in Spanish, including 
 * the day of the week, day, month, year, and time in 12-hour format with am/pm.
 * IN: 2024-01-27T20:21:49
 * OT: Sábado 27 de enero de 2024 08:21pm
 */
export function formatToDayDDMonthYYYYHour(date: string) {
	const initDate = new Date(date);
	const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
	const weekDay = days[initDate.getDay()];
	const day = initDate.getDate();
	const month = months[initDate.getMonth()];
	const year = initDate.getFullYear();
	let hours: string | number = initDate.getHours();
	const minutes = initDate.getMinutes().toString().padStart(2, '0');
	const ampm = hours >= 12 ? 'pm' : 'am';

	hours = hours % 12;
	hours = hours ? hours : 12;
	hours = hours.toString().padStart(2, '0');

	return `${weekDay} ${day} de ${month} de ${year} ${hours}:${minutes}${ampm}`;
}
/**
 * Formats a given date string to a more readable format in Spanish, including 
 * the day of the week, day, month, year.
 * IN: 2024-01-27T20:21:49
 * OT: Sábado 27 de enero de 2024
 */
export function formatToDayDDMonthYYYY(date: string) {
	const fecha = new Date(date);

	const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

	const diaSemana = diasSemana[fecha.getDay()];
	const dia = fecha.getDate();
	const mes = meses[fecha.getMonth()];
	const año = fecha.getFullYear();

	return `${diaSemana} ${dia} de ${mes} de ${año}`;
}
/**
 * Formats a given Date object to a string representing the time in 12-hour format (AM/PM) in Spanish.
 * The function converts the input `Date` object to a string showing the hours and minutes, using
 * the 12-hour clock and including AM/PM notation in the Spanish locale.
 * IN: 2024-01-27T20:21:49
 * OT: 8:21 p.m.
 */
export const formatToHour = function (date: Date) {
	return date.toLocaleTimeString('es-MX', { hour: 'numeric', minute: 'numeric', hour12: true });
};

/**
 * Returns the full name of the day of the week for a given date in Spanish.
 * IN: 2024-01-27T20:21:49
 * OT: sábado
 */
export const formatToDay = function (date: Date) {
	return new Intl.DateTimeFormat("es-MX", { weekday: "long" }).format(date);
};
/**
 * Returns the month number and the current year.
 * IN: 2024-01-27T20:21:49
 * OT: 01/2024
 */
export function formatToMMYYYY(dateString: string): string {
	const date = new Date(dateString);
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const year = date.getUTCFullYear().toString();

	return `${month}/${year}`;
}
/**
 * Calculates the number of full years that have passed since a given date.
 * This function takes a date string, creates a `Date` object, and calculates 
 * the difference in full years between the given date and the current date. 
 * If the current date is before the birthday in the current year, it subtracts 
 * one year from the result.
 * IN: 2024-01-27T20:21:49
 * OT: 24
 */
export function getUserAge(date: string): string {
	const initDate = new Date(date);
	const today = new Date();
	let years = today.getUTCFullYear() - initDate.getUTCFullYear();

	if (today.getUTCMonth() < initDate.getUTCMonth()
		|| (today.getUTCMonth() === initDate.getUTCMonth()
			&& today.getUTCDate() < initDate.getUTCDate())
	) years--;

	return years.toString();
}
