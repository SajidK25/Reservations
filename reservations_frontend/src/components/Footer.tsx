export default function Footer() {
  return (
    <footer className="text-center text-gray-400 text-sm py-2 mt-3 border-t border-gray-700">
      <p>
        © {new Date().getFullYear()} —{" "}
        <a
          href="https://github.com/goran010/Registration-API"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit GitHub repository"
          className="hover:underline text-blue-400"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
