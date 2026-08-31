import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MockModelTestCard from "@/components/MockModelTestCard";

export const metadata = {
    title: "মক মডেল টেস্ট - BCSpark",
    description:
        "বিষয় ও টপিক বেছে নিয়ে সময়সাপেক্ষ মক মডেল টেস্টে অংশ নিন — রেজাল্ট, ব্যাখ্যা ও উত্তরপত্র ডাউনলোড সহ।",
};

// Issue 3 — dedicated /mock-test route embedding the same card shown on the
// homepage, wrapped in the site chrome with matching styling.
export default function MockTestPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-brand-bg py-10">
                <div className="mx-auto max-w-2xl px-4 sm:px-6">
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-primary">
                            মক মডেল টেস্ট
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            বিষয় ও টপিক বেছে নিয়ে সময়সাপেক্ষ মক পরীক্ষায় অংশ নিন —
                            রেজাল্ট, ব্যাখ্যা ও উত্তরপত্র ডাউনলোড সহ।
                        </p>
                    </header>
                    <MockModelTestCard />
                </div>
            </main>
            <Footer />
        </>
    );
}