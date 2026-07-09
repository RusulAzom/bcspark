import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickPracticeSetup from '@/components/QuickPracticeSetup';

export default function T20HomePage() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 py-10">
                <QuickPracticeSetup />
            </main>

            <Footer />
        </>
    );
}