import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BdMapClient from './BdMapClient';

export const metadata = {
  title: 'মানচিত্র | বাংলাদেশের ৬৪ জেলা - BCS Spark',
  description:
    'বাংলাদেশের ৬৪টি জেলার ভেক্টর মানচিত্র। যেকোনো জেলায় ক্লিক করে সেই জেলার ছবি ফিড দেখুন এবং নিজের ছবি যোগ করুন।',
};

export default function BdMapPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-6">
        <BdMapClient />
      </main>
      <Footer />
    </>
  );
}