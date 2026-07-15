// @ts-nocheck
import { For, Loading, Reveal } from 'solid-js';

const ProfileDetails = (props) => <h1>{props.user?.name}</h1>;

const ProfileTimeline = (props) => (
  <ul>
    <For each={props.posts}>{(post) => <li>{post.text}</li>}</For>
  </ul>
);

const ProfileTrivia = (props) => (
  <>
    <h2>Fun Facts</h2>
    <ul>
      <For each={props.trivia}>{(fact) => <li>{fact.text}</li>}</For>
    </ul>
  </>
);

const ProfilePage = (props) => (
  <Reveal order="sequential" collapsed>
    <ProfileDetails user={props.user} />
    <Loading fallback={<h2>Loading posts...</h2>}>
      <ProfileTimeline posts={props.posts} />
    </Loading>
    <Loading fallback={<h2>Loading fun facts...</h2>}>
      <ProfileTrivia trivia={props.trivia} />
    </Loading>
  </Reveal>
);

export default ProfilePage;
