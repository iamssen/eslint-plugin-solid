// @ts-nocheck
import { render } from '@solidjs/web';
import { Loading } from 'solid-js';

import fetchProfileData from './mock-api';
import ProfilePage from './profile';

const App = () => {
  const { user, posts, trivia } = fetchProfileData();
  return (
    <Loading fallback={<h1>Loading...</h1>}>
      <ProfilePage user={user()} posts={posts()} trivia={trivia()} />
    </Loading>
  );
};

render(App, document.getElementById('app'));
