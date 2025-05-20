import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Plans from '../components/Plans';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>OdontoMaster - Modern Dental Practice Management</title>
        <meta
          name="description"
          content="OdontoMaster is a comprehensive dental practice management solution that helps streamline operations and enhance patient care."
        />
      </Helmet>
      <Hero />
      <Plans />
    </>
  );
};

export default Home;
