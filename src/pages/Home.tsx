import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Services from '../components/Plans';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>HunterMussel - Professional Software Development</title>
        <meta
          name="description"
          content="HunterMussel is a premier software house delivering innovative, high-quality software solutions for businesses across various industries."
        />
      </Helmet>
      <Hero />
      <Services />
    </>
  );
};

export default Home;
