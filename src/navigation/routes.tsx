import type { ComponentType, JSX } from 'react';
import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { BookDoctorsPage } from '@/pages/BookDoctorsPage.tsx';
import SigninPage from '@/pages/auth/SigninPage';
import SignUpPage from '@/pages/auth/SignUpPage';

import ProfileScreen from '@/pages/Profile';
import ProductList from '@/pages/ProductList';
import PaymentScreen from '@/components/Templates/PaymentScreen';
import PaymentSuccessScreen from '@/pages/PaymentSuccessScreen';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/book', Component: BookDoctorsPage, title: 'Booking Page' },
  { path: '/payment', Component: PaymentScreen, title: 'payment page' },
  { path: '/checkout', Component: PaymentSuccessScreen, title: 'payment page' },
  { path: '/signin', Component: SigninPage, title: 'SignIn' },
  { path: '/signup', Component: SignUpPage, title: 'SignUp' },
  { path: '/profile', Component: ProfileScreen, title: 'SignUp' },
  { path: '/ecommerce', Component: ProductList, title: 'SignUp' },
  

  
];
