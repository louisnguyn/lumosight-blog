export default function Footer() {
  return (
    <footer className="w-full bg-blue-600 text-white dark:bg-gray-900 py-4 px-6 text-center mt-8">
      &copy; {new Date().getFullYear()} Lumosight. All rights reserved.
    </footer>
  );
}