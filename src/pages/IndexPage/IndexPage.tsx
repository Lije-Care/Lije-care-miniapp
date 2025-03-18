import { Section, Input, Tappable, Headline, Button } from '@telegram-apps/telegram-ui';
import { useState, type FC } from 'react';

import { Page } from '@/components/Page.tsx';

import BottomNav from '@/components/Templates/BottomNav';
import LijeCard from '@/components/Templates/LijeCard';
import { SearchIcon } from '@100mslive/react-icons';
import { IoClose } from 'react-icons/io5';
import DoctorsList from '@/components/Templates/DoctorsList';

export const IndexPage: FC = () => {
  const [value, setValue] = useState('');
  return (
    <Page back={false}>
      <Section  style={{ overflow: 'scroll'}}>
        <Section
       
          
           > 
            <Input 
             before={ <SearchIcon />}
             placeholder="Search a Doctor"
             value={value} 
             onChange={e => setValue(e.target.value)} 
             after={<Tappable Component="div" style={{
             display: 'flex'
      }} onClick={() => setValue('')}>
              <IoClose />
            </Tappable >} />
          <LijeCard/>
         
        </Section>
        <Section >
        <Headline
        style={{padding: '10px',}}
    weight="2"
  >
    Categories
  </Headline>
<div style={{display: 'flex', flexDirection: 'row', gap : 10,  margin: '10px'}}>

  <Button>Meal PLan </Button>

  <Button>Baby Growth</Button>
  <Button>Doctors</Button>
  </div>

<DoctorsList/>
        </Section>
       
      </Section>
      {/* <BottomNav/> */}
    </Page>
  );
};
