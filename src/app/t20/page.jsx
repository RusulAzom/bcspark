import Navbar from '@/components/Navbar';
// adds 
import AdBanner728 from '@/components/add/adstra/AdBanner728';

import Footer from '@/components/Footer';
import QuickPracticeSetup from '@/components/QuickPracticeSetup';

export default function T20HomePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 py-10">
                {/* %%%%%%%%%ADS728%%%%%%%%% */}
                <AdBanner728 />
                <QuickPracticeSetup />
            </main>

            <Footer />
        </>
    );
}