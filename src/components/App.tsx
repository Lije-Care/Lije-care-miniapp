import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter, } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import BottomNav from './Templates/BottomNav';
import ChatComponent from '@/pages/Chat/ChatComponent';
import MealPlanPage from '@/pages/MealPlanPage';
import MealComponent from '@/pages/meal/MealPlan';
import DoctorsConsultationPage from '@/pages/DoctorsConsultationPage';
import ConsultationTab from '@/pages/ConsultationBookingPage';


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
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/history" element={<History />} /> */}
          <Route path="/meal" element={<MealComponent />} />

          <Route path="/chat" element={<ConsultationTab />} />
          {/* <Route path="/profile" elemetnt={<Profile />} /> */}
          </Routes>
        </Layout>
      </HashRouter>
    </AppRoot>
  );
}
