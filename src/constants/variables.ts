import { API_URL_DEBUG, API_URL_PROD } from '@env';

export const IS_PRODUCTION = true;

export const API_URL = IS_PRODUCTION
	? API_URL_PROD
	: API_URL_DEBUG;
