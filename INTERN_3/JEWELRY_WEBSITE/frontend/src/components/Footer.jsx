import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-gold-text">Gleamora Jewels</h3>
            <p className="text-gray-400">
              Your destination for exquisite jewelry pieces that tell your story.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><span className="transition">Home</span></li>
              <li><span className="transition">Products</span></li>
              <li><span className="transition">Login</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: parasgoyal299@gmail.com</li>
              <li>Phone: 7973115446</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-gray-400">
              <span className="transition">📘</span>
              <span className="transition">📷</span>
              <span className="transition">🐦</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 Gleamora Jewels by Harshita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
