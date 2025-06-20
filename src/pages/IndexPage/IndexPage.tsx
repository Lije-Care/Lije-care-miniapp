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
import parentAvatar from '@/assets/avatar.png';
import { FaUser } from 'react-icons/fa';
import GrowthTrackerHome from '../Profile/GrowthTrackerHome';

export const IndexPage: FC = () => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { articles, loading } = useSelector((state: RootState) => state.articles);
  const { data: children } = useSelector((state: RootState) => state.children);
  const parentState = useSelector((state: RootState) => state.parent);
  const parent = {
    name: parentState.parent?.firstName ?? 'Unknown',
    avatar: parentAvatar,
  };
  const favoriteChildId = localStorage.getItem("favorite_child_id");
  const child = children?.find((c) => c.id === favoriteChildId) ?? children?.[0];


  useEffect(() => {
    dispatch(fetchArticles({ page: 1, limit: 6 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <Page back={true}>
      <Section className="overflow-y-auto pb-8">
        {/* 👨‍👩‍👧 Profile Cards */}
        <div className="flex gap-4 px-4 py-3 justify-between">
          {/* Parent Card */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 border rounded-xl px-3 py-2 shadow-sm cursor-pointer"
          >
            <FaUser size={36} />
            <div>
              <Title level="3">{parent.name}</Title>
              <Caption>Parent</Caption>
            </div>
          </div>

          {/* Child Card */}
          <div
            onClick={() => navigate('/children')}
            className="flex items-center gap-3 border rounded-xl px-3 py-2 shadow-sm cursor-pointer"
          >
            {child ? (
              <>
                <Avatar src={child.avatar} size={48} />
                <div>
                  <Title level="3">{child.name}</Title>
                  <Caption>Child</Caption>
                </div>
              </>
            ) : (
              <div>
                <Title level="4">No child</Title>
                <Caption>Add a profile</Caption>
              </div>
            )}
          </div>
        </div>

        {/* 📊 Assessment Summary */}
        {child?.assessment && (
          <div className="mx-4 my-4 p-4 rounded-xl shadow-md border">
            <Headline weight="2" className="mb-2">Health Assessment</Headline>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(child.assessment).map(([label, value]) => (
                <div
                  key={label}
                  className="text-center p-2 border rounded-lg shadow-sm"
                >
                  <Subheadline>{value}</Subheadline>
                  <Caption className="text-gray-500">{label.toUpperCase()}</Caption>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button size="s" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
          </div>
        )}
        <div style={{margin: 'auto'}}> 
          Anthropometric
        </div>
        {/* 📈 Growth Tracker & 🧠 Articles */}
        <Section className="mt-4 ">
          <GrowthTrackerHome childProfile={child} />

          {/* 📰 Articles Carousel */}
          <div className="mt-4">
            <ArticleSliderWidget articles={articles} />
          </div>

          {/* 🧑‍⚕️ Doctors */}
          <div className="mt-4">
            <DoctorsList />
          </div>
        </Section>
      </Section>
    </Page>
  );
};
