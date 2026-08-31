export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  behance?: string;
}

export interface UpdateSettingsDTO {
  socialLinks?: SocialLinks;
  footerTitle?: string;
  footerDescription?: string;
  footerMessage?: string;
  logo?: string;
  footerLogo?: string;
}
