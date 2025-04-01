import { Section, Input, Tappable, Headline, Button } from '@telegram-apps/telegram-ui';
import { useEffect, useState, type FC } from 'react';
import axios from "axios";
import { Page } from '@/components/Page.tsx';
import { useDispatch, useSelector } from 'react-redux';

import LijeCard from '@/components/Templates/LijeCard';
import { SearchIcon } from '@100mslive/react-icons';
import { IoClose } from 'react-icons/io5';
import DoctorsList from '@/components/Templates/DoctorsList';
import { useSearchParams } from 'react-router-dom';

import { AppDispatch, RootState } from '@/redux/store';
import { fetchParent } from '@/redux/slices/itemSlice';

export const IndexPage: FC = () => {
  const [value, setValue] = useState('');
  const [getId, setGetId] = useState('');
  const [parentData,setParentData] = useState();
  const [searchParams] = useSearchParams();
   
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get("userId");
    // const dispatch = useDispatch()

    const dispatch = useDispatch<AppDispatch>();
    const  parents = useSelector((state: RootState) => state.parent);
    console.log(parents);
    const [newItem, setNewItem] = useState("");
  
  
    useEffect(() => {
        dispatch(fetchParent());
    }, [dispatch]); // Ensure dispatch is called only once on mount

    useEffect(()=>{
     
      if(userIdFromUrl != undefined && userIdFromUrl != null)
      {
        console.log(userIdFromUrl)
        console.log("userIdFromUrl")
        
        dispatch(fetchParent());
        console.log({parents, loading, error});

      
      
        setGetId(userIdFromUrl );
      }
      else{
        console.log(userIdFromUrl);
        if(userIdFromUrl  == null){
          dispatch(fetchParent());
        }
      }
     
    },[userIdFromUrl])


 
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
