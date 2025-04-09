import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white/20 backdrop-blur-sm border-t border-gray-100/20 mt-4">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">About Us</h3>
            <p className="text-xs text-text">
              Story Teller AI is a magical platform that helps children create their own stories
              with the help of friendly characters and exciting adventures. Our mission is to
              inspire creativity and imagination in young minds.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Quick Links</h3>
            <ul className="space-y-0.5">
              <li>
                <Link to="/about" className="text-xs text-text hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-text hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-xs text-text hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-xs text-text hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Get in Touch</h3>
            <ul className="space-y-0.5 text-xs text-text">
              <li>📧 support@storyteller.ai</li>
              <li>📱 (555) 123-4567</li>
              <li>📍 123 Story Street, Imagination City</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100/20 text-center text-xs text-text">
          <p>© {new Date().getFullYear()} Story Teller AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 