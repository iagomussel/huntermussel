
import { Helmet } from 'react-helmet-async';
import Newsletter from '../components/Newsletter';

const NewsletterPage = () => {
  return (
    <>
      <Helmet>
        <title>Newsletter - Hunter Mussel</title>
        <meta name="description" content="Subscribe to Hunter Mussel's newsletter for technical insights, company updates, and industry trends." />
      </Helmet>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Newsletter />
        </div>
      </main>
    </>
  );
};

export default NewsletterPage;
