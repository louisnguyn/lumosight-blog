import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto py-12 px-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10 mb-10">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-white">Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
          <li>Email address, full name, and profile information when you sign up.</li>
          <li>Usage data such as views, likes, and posts you create.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-white">How Is Your Data Used</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
        <li>Your data is used only to provide you access to the site and its features.</li>
        <li>We do not sell, share, or use your data for advertising.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-white">How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
          <li>To provide and improve our services.</li>
          <li>To personalize your experience.</li>
          <li>To communicate important updates.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-white">How We Protect Your Information</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
          <li>Your data is stored securely using Supabase authentication and database services.</li>
          <li>We may use cookies for login sessions.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-white">Your Rights</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
          <li>You can update profile information at any time.</li>
          <li>You can request deletion of your account and data at any time by contacting me or Tan Loc Nguyen.</li>
        </ul>
        <p className="mt-8 text-gray-600 dark:text-gray-400">
          If you have questions about this policy, please contact us at <strong>louis.nguyn@gmail.com</strong>.
        </p>
      </main>
      <Footer />
    </div>
  );
}