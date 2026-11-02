export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  behance?: string;
  twitter?: string;
}

export interface LocalizedString {
  en?: string;
  ar?: string;
}

export interface UpdateSettingsDTO {
  socialLinks?: SocialLinks;
  footerTitle?: LocalizedString | string;
  footerDescription?: LocalizedString | string;
  footerMessage?: LocalizedString | string;
  logo?: LocalizedString | string;
  footerLogo?: LocalizedString | string;
  whatsapp?: string;
}
