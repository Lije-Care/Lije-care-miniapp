import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter, } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import BottomNav from './Templates/BottomNav';
import ConsultationTab from '@/pages/ConsultationBookingPage';
import MealPlanPage from '@/pages/meal/MealPlanPage';
import MealComponent from '@/pages/meal/MealPlan';
import DoctorsConsultationPage from '@/pages/DoctorsConsultationPage';

import MealPlanSummary from '@/pages/meal/MealPlanSummary';
import EditMealPlan from '@/pages/meal/EditMealPLan';
import VideoCall from '@/pages/Consultation/VideoCall';


const Layout = ({ children }: {children: any}) => (
  <div>
    {/* <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
       
        background: "var(--tg-theme-bg-color, white)",
        textAlign: "left",
        lineHeight: "50px",
        fontWeight: "bold",
      }}
    >
    
      
    </header> */}
    <div style={{ marginTop: "0px", paddingBottom: "60px" }}>{children}</div>
    <BottomNav />
  </div>
);


export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  
  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <Layout>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/"/>}/>
         
          <Route path="/meal" element={<MealComponent />} />
          <Route path="/mealplansummary" element={<MealPlanSummary />} />
          <Route path="/meal-plans/edit/:id" element={<EditMealPlan />} />
          <Route path="/chat" element={<ConsultationTab />} />
          <Route path="/video-call" element={<VideoCall />} />
          
          </Routes>
        </Layout>
      </HashRouter>
    </AppRoot>
  );
}
