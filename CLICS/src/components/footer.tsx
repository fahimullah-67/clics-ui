import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Github, Instagram, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/fahimullah-fu67/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:clicsumw.pk.67@gmail.com", label: "Email" },
    { icon: Github, href: "https://github.com/Fahimullah-67", label: "GitHub" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-t border-slate-700">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <img
                  src="/clicslogo.png"
                  alt="CLICS Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                CLICS
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t(
                "footer.description",
                "Centralized Loan Information & Comparison System - Your trusted source for comparing loans from Pakistani banks."
              )}
            </p>
            <div className="flex gap-2 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white border-l-3 border-blue-500 pl-3">
              {t("footer.quickLinks", "Quick Links")}
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/schemes", label: "footer.browseLoans", default: "Browse Loans" },
                { to: "/compare", label: "footer.compare", default: "Compare" },
                { to: "/banks", label: "footer.banks", default: "Banks" },
                { to: "/currency", label: "footer.currencyConverter", default: "Currency Converter" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-slate-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t(link.label, link.default)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white border-l-3 border-blue-500 pl-3">
              {t("footer.resources", "Resources")}
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "footer.aboutUs", default: "About Us" },
                { to: "/contact", label: "footer.contact", default: "Contact" },
                { to: "/help", label: "footer.help", default: "Help" },
                { to: "/loan-checker", label: "footer.loanCheck", default: "Loan Check" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-slate-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t(link.label, link.default)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white border-l-3 border-blue-500 pl-3">
              {t("footer.connect", "Connect")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:clicsumw.pk.67@gmail.com" className="text-sm hover:text-white transition-colors">
                  clicsumw.pk.67@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Mianwali, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-12 pt-6 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            {t(
              "footer.copyright",
              "© 2025 CLICS. All rights reserved. | University of Mianwali Final Year Project"
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}