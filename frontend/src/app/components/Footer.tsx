import { Trophy, Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Youtube, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';
import { appPaths } from '../data/paths';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#333333] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img
                        src="/assets/telyuuu.png"
                        alt="logo"
                        className="w-full h-full object-cover"
                    />
                    </div>
              <span className="text-lg font-bold">
                Telkom-In-<span className="text-[#C8102E]">Competition</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering students to compete, innovate, and excel through national and international competitions.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href={appPaths.home} className="text-gray-400 hover:text-[#C8102E] transition-colors">Home</a></li>
              <li><a href={appPaths.explore} className="text-gray-400 hover:text-[#C8102E] transition-colors">Explore Competitions</a></li>
              <li><a href={appPaths.myCompetitions} className="text-gray-400 hover:text-[#C8102E] transition-colors">My Competitions</a></li>
              <li><a href={appPaths.bookmarks} className="text-gray-400 hover:text-[#C8102E] transition-colors">Bookmarks</a></li>
              <li>
                <button 
                  onClick={() => navigate(appPaths.adminLogin)}
                  className="text-gray-400 hover:text-[#C8102E] transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Telkom University<br />Bandung, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>competition@telkomuniversity.ac.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+62 22 7564108</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-[#C8102E] rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-[#C8102E] rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-[#C8102E] rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-[#C8102E] rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2026 Telkom University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
