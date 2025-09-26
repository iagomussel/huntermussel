
import { Helmet } from 'react-helmet-async';
import ReferralProgram from '../components/ReferralProgram';

const Referrals = () => {
  return (
    <>
      <Helmet>
        <title>Referral Program - Hunter Mussel</title>
        <meta name="description" content="Join our referral program and earn rewards for referring new clients to Hunter Mussel. Get 10% commission on successful referrals." />
      </Helmet>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ReferralProgram />
        </div>
      </main>
    </>
  );
};

export default Referrals;
