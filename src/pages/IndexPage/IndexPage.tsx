import { Section, Input, Tappable, Headline, Button, Spinner } from '@telegram-apps/telegram-ui';
import { useEffect, useState, type FC } from 'react';
import { Page } from '@/components/Page.tsx';
import { useDispatch, useSelector } from 'react-redux';

import LijeCard from '@/components/Templates/LijeCard';
import { SearchIcon } from '@100mslive/react-icons';
import { IoClose } from 'react-icons/io5';
import DoctorsList from '@/components/Templates/DoctorsList';

import { AppDispatch, RootState } from '@/redux/store';
import { fetchParent } from '@/redux/slices/itemSlice';
import { useNavigate } from 'react-router-dom';
import ArticleSliderWidget from '../knowledgebase/ArticleSliderWidget';
import { fetchArticles } from '@/redux/slices/articlesSlice';

export const IndexPage: FC = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get("userId");
    // const dispatch = useDispatch()

    const dispatch = useDispatch<AppDispatch>();
    const { articles, loading } = useSelector((state: RootState) => state.articles);
  
    useEffect(() => {
        dispatch(fetchParent());
        dispatch(fetchArticles({ page: 1, limit: 6 }));
        console.log(articles);
    }, [dispatch]); // Ensure dispatch is called only once on mount

    useEffect(()=>{
     
      if(userIdFromUrl != undefined && userIdFromUrl != null)
      {
      dispatch(fetchParent()); 
      // setGetId(userIdFromUrl );
      }
      else{
        console.log(userIdFromUrl);
        if(userIdFromUrl  == null){
          dispatch(fetchParent());
        }
      }
     
    },[userIdFromUrl])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="l" />
      </div>
    );
  }
 
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
  <Button onClick={()=> navigate('/article')}>Articles</Button>
  </div>
  <ArticleSliderWidget articles={articles}/>
   <DoctorsList/>
        </Section>
       
      </Section>
     
    </Page>
  );
};
