import {
  Section,
  Avatar,
  Headline,
  Caption,
  Title,
  Button,
  Spinner,
  Subheadline,
} from '@telegram-apps/telegram-ui';
import { useEffect, useState, type FC } from 'react';
import { Page } from '@/components/Page.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DoctorsList from '@/components/Templates/DoctorsList';
import ArticleSliderWidget from '../knowledgebase/ArticleSliderWidget';
import { fetchArticles } from '@/redux/slices/articlesSlice';
import { AppDispatch, RootState } from '@/redux/store';
import parentAvatar from "@/assets/avatar.png";
import { FaUser } from 'react-icons/fa';

export const IndexPage: FC = () => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading } = useSelector((state: RootState) => state.articles);

  useEffect(() => {
    dispatch(fetchArticles({ page: 1, limit: 6 }));
  }, [dispatch]);

  const parentState = useSelector((state: RootState) => state.parent);
  const parent = {
    name: parentState.parent?.name,
    avatar: {parentAvatar},
  };

  const child = {
    name: 'Baby Sara',
    avatar: 'https://i.pravatar.cc/150?img=5',
    assessment: {
      weight: '6.5 kg',
      height: '65 cm',
      
      mood: 'Happy',
      health: 'Excellent',
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <Page back={true}>
      <Section style={{ overflow: 'auto', paddingBottom: 30 }}>
        {/* 👤 Parent & Child Profile Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #eee',
          }}
        >
          <div onClick={()=> navigate('/profile') } style={{ display: 'flex', alignItems: 'center', gap: 12 ,  border: 'solid', borderRadius: '10px', padding: '5px'}}>
            <FaUser className="text-6xl" />
            <div>
              <Title level="3">{parent.name}</Title>
              <Caption>Parent</Caption>
            </div>
          </div>

          <div onClick={()=> navigate('/children') } style={{ display: 'flex', alignItems: 'center', gap: 12 , border: 'solid', borderRadius: '10px', padding: '5px' }}>
            <Avatar src={child.avatar} size={48} />
            <div>
              <Title level="3">{child.name}</Title>
              <Caption>Child</Caption>
            </div>
          </div>
        </div>

        {/* 📊 Child Assessment */}
        <div
          style={{
          
            margin: '16px',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.05)',
            
          }}
        >
          <Headline weight="2" style={{ marginBottom: 12 }}>
            Health Assessment
          </Headline>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
            }}
          >
            {Object.entries(child.assessment).map(([label, value]) => (
              <div
                key={label}
                style={{
                 border: '',
                  
                  padding: '1px',
                  boxShadow: '0 1px 31px rgba(0,0,0,0.04)',
                  textAlign: 'center',
                }}
              >
                <Subheadline  style={{ marginBottom: 4 }}>
                  {value}
                </Subheadline>
                <Caption style={{ color: '#888' }}>{label.toUpperCase()}</Caption>
              </div>
            ))}
          </div>

          <div className="mt-4" style={{ marginTop: 16 }}>
            <Button size="s" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        {/* 🧠 Categories & Widgets */}
        <Section>
          <Headline weight="2" style={{ padding: '10px' }}>
            Categories
          </Headline>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '10px' }}>
            <Button size="m">Meal Plan</Button>
            <Button size="m">Baby Growth</Button>
            <Button size="m" onClick={() => navigate('/article')}>
              Articles
            </Button>
          </div>

          <ArticleSliderWidget articles={articles} />
          <DoctorsList />
        </Section>
      </Section>
    </Page>
  );
};
