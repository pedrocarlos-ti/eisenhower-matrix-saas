import React from 'react';
import { Github, Linkedin, Twitter, LayoutGrid } from 'lucide-react';

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
  social: [
    { name: 'Twitter', href: '#', icon: (props: any) => <Twitter {...props} /> },
    { name: 'GitHub', href: '#', icon: (props: any) => <Github {...props} /> },
    { name: 'LinkedIn', href: '#', icon: (props: any) => <Linkedin {...props} /> },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Eisenhower Matrix</span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              The simple, effective way to organize tasks, boost productivity, and focus on what truly matters.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
                <div>
                    <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                    <ul role="list" className="mt-6 space-y-4">
                    {navigation.legal.map((item) => (
                        <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                            {item.name}
                        </a>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-xs leading-5 text-gray-400">&copy; {new Date().getFullYear()} Eisenhower Matrix. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
                {navigation.social.map((item) => (
                    <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
