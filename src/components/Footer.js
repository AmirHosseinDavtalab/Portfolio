import React from "react";
import {
  FaTwitter,
  FaGithub,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";

// Accept smoother and isSmootherInitialized as props
const Footer = ({ smoother, isSmootherInitialized }) => {
  const scrollToSection = (sectionId) => {
    // Check if smoother is initialized and available
    if (isSmootherInitialized && smoother && smoother.current) {
      console.log(`Footer: Scrolling to #${sectionId} with ScrollSmoother`);
      smoother.current.scrollTo(`#${sectionId}`, { smooth: true, speed: 0.8 });
    } else {
      // Fallback to native scroll if smoother is not ready
      console.warn(`Footer: ScrollSmoother not ready, falling back to native scroll for #${sectionId}`);
      const element = document.getElementById(sectionId);
      if (element) {
        // Native smooth scroll with offset calculation might still be tricky
        // For simplicity, direct scrollIntoView is used as fallback
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <footer className="w-full bg-[#0f172a] text-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Amir Davtalab
            </span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Creating innovative solutions and building amazing digital
              experiences. Let's connect and create something extraordinary
              together.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-400 hover:text-blue-400 transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-400 hover:text-blue-400 transition-colors text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-gray-400 hover:text-blue-400 transition-colors text-left"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-400 hover:text-blue-400 transition-colors text-left"
              >
                Contact
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-white">Contact Info</h3>
            <div className="flex flex-col gap-2 text-gray-400">
              <p>Email: amirhossindavtalab@gmail.com</p>
              <p>Location: Mashhad, Iran</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://github.com/AmirHosseinDavtalab" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"><FaGithub /></a>
          <a href="https://www.instagram.com/amirhossein_davtalab/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"><FaInstagram /></a>
          <a href="https://t.me/coda2001" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"><FaTelegram /></a>
        </div>
        <div className="text-center text-gray-400 text-sm border-t border-gray-800 pt-8">
          <p>© {new Date().getFullYear()} Amir Davtalab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
