import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = `${process.env.ENV}`;
export const SERVER_PORT = process.env.SERVER_PORT !== undefined ? `${process.env.SERVER_PORT}` : 4900;