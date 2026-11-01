import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Database, Server, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#232F3E] text-slate-300 text-xs mt-12 select-none border-t border-[#1b2430]">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475A] hover:bg-[#485769] text-white text-xs font-semibold text-center transition"
      >
        Back to top
      </button>

      {/* Main Links Container */}
      <div className="max-w-[1440px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#careers" className="hover:underline">Careers at Prime</a></li>
            <li><a href="#about" className="hover:underline">About Amazon Retail</a></li>
            <li><a href="#sustainability" className="hover:underline">Sustainability & Climate Pledge</a></li>
            <li><a href="#press" className="hover:underline">Press Center</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('seller_hub')} className="hover:underline text-left">
                Sell products on Amazon
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('logistics_hub')} className="hover:underline text-left">
                Fulfillment by Amazon (FBA)
              </button>
            </li>
            <li><a href="#affiliate" className="hover:underline">Become an Affiliate</a></li>
            <li><a href="#advertise" className="hover:underline">Advertise Your Products</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Enterprise Architecture</h4>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spring Boot REST Backend</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>MySQL Relational Database</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF9900]" />
              <span>AES-256 Encrypted Vault</span>
            </li>
            <li>
              <button onClick={() => setActiveTab('security_hub')} className="hover:underline text-left text-emerald-400">
                View Automated Backups & Sync
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('customer_hub')} className="hover:underline text-left">
                Your Account & Past Orders
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('customer_hub')} className="hover:underline text-left">
                Shipping Rates & Policies
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('customer_hub')} className="hover:underline text-left">
                Returns & Replacements
              </button>
            </li>
            <li><a href="#security" className="hover:underline">Amazon A-to-z Guarantee</a></li>
          </ul>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="bg-[#131921] py-6 px-4 text-center border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-base">
          <span>amazon</span><span className="text-[#FF9900]">prime</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Conditions of Use · Privacy Notice · Consumer Health Data Privacy Disclosure · Your Ads Privacy Choices
        </div>
        <div className="text-[11px] text-slate-500">
          © 1996-2026, Amazon.com, Inc. or its affiliates. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
