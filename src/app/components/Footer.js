import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-2 md:py-4">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 flex-wrap">
          {/* Left Section */}
          <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-4 min-w-[150px]">
            {/* Support the Dev */}
            <div className="mb-2 md:mb-0 text-sm md:text-base">
              <strong>Support the Dev</strong>
            </div>
            {/* Buy Me a Coffee Button */}
            <div>
              <a
                href="https://www.buymeacoffee.com/bordercanvas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                  alt="Buy Me A Coffee"
                  className="h-10 md:h-12"
                />
              </a>
            </div>
          </div>

          {/* Center Section */}
          <div className="my-4 md:my-0 text-center md:text-left text-sm md:text-base min-w-[200px]">
            {/* Contact the Dev */}
            <div>
              <strong>Contact the Dev</strong>
            </div>
            <div className="mt-2">
            <p>
                <a
                  href="https://github.com/davidcornett"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-400"
                >
                  GitHub
                </a>
              </p>
              <p>davidgcornett at gmail.com</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-center md:text-right text-sm md:text-base min-w-[150px]">
            <p>© 2024 BorderCanvas. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
