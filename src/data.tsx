import { type RouteObject } from 'react-router-dom';
import MainPage from "./features/main/MainPage";

const newsList = [
  '#Road',
  '#Kafe',
  '#Event',
  '#Weather',
  '#Rent',
   '#Road',
  '#Kafe',
  '#Event',
  '#Weather',
  '#Rent'
];

export const routesConfig: RouteObject[] = [
  {
    path: "/index",
    element: <MainPage />,
  },
];

export const navList:string[] = []