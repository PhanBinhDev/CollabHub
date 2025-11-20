import Translate from '@/components/shared/translate';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <Image
                src="/logo.png"
                alt="CollabHub"
                width={32}
                height={32}
                className="rounded-md"
              />
              <Translate value="app.name" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              <Translate value="footer.description" />
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              <Button variant="ghost" size="icon-sm" asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" asChild>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" asChild>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" asChild>
                <a href="mailto:contact@collabhub.com">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">
              <Translate value="footer.product" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.features" />
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.pricing" />
                </Link>
              </li>
              <li>
                <Link
                  href="/apps"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.apps" />
                </Link>
              </li>
              <li>
                <Link
                  href="/updates"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.updates" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">
              <Translate value="footer.company" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.about" />
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.blog" />
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.careers" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.contact" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">
              <Translate value="footer.legal" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.privacy" />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.terms" />
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.cookies" />
                </Link>
              </li>
              <li>
                <Link
                  href="/licenses"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Translate value="footer.licenses" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} <Translate value="app.name" />.{' '}
              <Translate value="footer.rights" />
            </p>
            <div className="flex gap-6">
              <Link
                href="/sitemap"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Translate value="footer.sitemap" />
              </Link>
              <Link
                href="/status"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Translate value="footer.status" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
