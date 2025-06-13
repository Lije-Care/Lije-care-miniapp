import type { ComponentType, JSX } from 'react';
import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { BookDoctorsPage } from '@/pages/BookDoctorsPage.tsx';
import SigninPage from '@/pages/auth/SigninPage';
import SignUpPage from '@/pages/auth/SignUpPage';

import ProfileScreen from '@/pages/Profile';
import ProductList from '@/pages/ecommerce/products/ProductList';
import PaymentScreen from '@/components/Templates/PaymentScreen';
import PaymentSuccessScreen from '@/pages/PaymentSuccessScreen';
import DoctorsConsultationPage from '@/pages/DoctorsConsultationPage';
import MealPlanPage from '@/pages/meal/MealPlanPage';
import ConsultationBookingPage from '@/pages/ConsultationBookingPage';
import ChildProfilePage from '@/pages/ChildProfilePage';
import ChildrenListPage from '@/pages/ChildrenListPage';
import UserOnboardingForm from '@/components/UserOnboardingForm';

interface Route {
   path: string;
    Component: ComponentType;
    protected?: boolean; // <-- new field
    title?: string;
    icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage, protected: true  },
  { path: '/onboarding', Component: UserOnboardingForm, protected: false },
  { path: '/book', Component: BookDoctorsPage, title: 'Booking Page', protected: true },
  { path: '/payment', Component: PaymentScreen, title: 'payment page', protected: true },
  { path: '/checkout', Component: PaymentSuccessScreen, title: 'payment page', protected: true },
  { path: '/signin', Component: SigninPage, title: 'SignIn' },
  { path: '/signup', Component: SignUpPage, title: 'SignUp' },
  { path: '/profile', Component: ProfileScreen, title: 'Profile', protected: true },
  { path: '/ecommerce', Component: ProductList, title: 'Products', protected: true },
  { path: '/consultation', Component: DoctorsConsultationPage, title: 'Doctor Consultation', protected: true },
  { path: '/consultation/:doctorId', Component: ConsultationBookingPage, title: 'Book Consultation', protected: true },
  { path: '/meal-plans', Component: MealPlanPage, title: 'Meal Plans', protected: true },
  { path: '/children', Component: ChildrenListPage, title: 'My Children', protected: true },
  { path: '/child/:childId', Component: ChildProfilePage, title: 'Child Profile', protected: true },
];
