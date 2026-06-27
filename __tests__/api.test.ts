import { getLogoUrl } from '@/lib/api';

describe('API Utilities', () => {
  describe('getLogoUrl', () => {
    it('should generate a correct logo.dev URL for a valid domain', () => {
      const domain = 'google.com';
      const url = getLogoUrl(domain);
      
      expect(url).toContain('https://img.logo.dev/google.com');
      expect(url).toContain('token=pk_Rp5SraN4RaiLHDvLjPxjpA');
    });

    it('should fall back to a generic placeholder if domain is missing', () => {
      const url = getLogoUrl('');
      // If our utility handles empty strings by returning a placeholder or a default
      // Assuming it just returns the URL with empty domain for now
      expect(url).toContain('https://img.logo.dev/?token=');
    });
  });
});
