import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function OurStoryPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <Header />
            <main className="flex-1 max-w-4xl mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 dark:text-white">Our Story</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                        Welcome to Lumosight, where we illuminate the path to technological innovation and digital transformation.
                    </p>
                    <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Mission</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        We believe in the power of technology to solve real-world problems and create meaningful change. Our mission is to share insights, experiences, and knowledge that help others navigate the ever-evolving digital landscape.
                    </p>
                    <h2 className="text-2xl font-semibold mb-4 dark:text-white">What We Do</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        From cutting-edge development techniques to innovative project showcases, we cover a wide range of topics that matter to developers, entrepreneurs, and tech enthusiasts alike.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}