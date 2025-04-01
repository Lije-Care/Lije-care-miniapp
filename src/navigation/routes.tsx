import type { ComponentType, JSX } from 'react';
import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { BookDoctorsPage } from '@/pages/BookDoctorsPage.tsx';
import SigninPage from '@/pages/auth/SigninPage';
import SignUpPage from '@/pages/auth/SignUpPage';

import ProfileScreen from '@/pages/Profile';
import ProductList from '@/pages/ProductList';
import PaymentScreen from '@/components/Templates/PaymentScreen';
import PaymentSuccessScreen from '@/pages/PaymentSuccessScreen';
import DoctorsConsultationPage from '@/pages/DoctorsConsultationPage';
import MealPlanPage from '@/pages/MealPlanPage';
import ConsultationBookingPage from '@/pages/ConsultationBookingPage';
import ChildProfilePage from '@/pages/ChildProfilePage';
import ChildrenListPage from '@/pages/ChildrenListPage';

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
  { path: '/profile', Component: ProfileScreen, title: 'Profile' },
  { path: '/ecommerce', Component: ProductList, title: 'Products' },
  { path: '/consultation', Component: DoctorsConsultationPage, title: 'Doctor Consultation' },
  { path: '/consultation/:doctorId', Component: ConsultationBookingPage, title: 'Book Consultation' },
  { path: '/meal-plans', Component: MealPlanPage, title: 'Meal Plans' },
  { path: '/children', Component: ChildrenListPage, title: 'My Children' },
  { path: '/child/:childId', Component: ChildProfilePage, title: 'Child Profile' },
];
