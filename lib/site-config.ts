export const siteConfig = {
  name: process.env.NEXT_PUBLIC_CLIENT_NAME || "Monotosh Sardar",
  firstName: process.env.NEXT_PUBLIC_CLIENT_FIRST_NAME || "Monotosh",
  phone: process.env.NEXT_PUBLIC_CLIENT_PHONE || "98364 72260",
  email: process.env.NEXT_PUBLIC_CLIENT_EMAIL || "moni22rick@gmail.com",
  address: process.env.NEXT_PUBLIC_CLIENT_ADDRESS || "Budge Budge, Kolkata, West Bengal, India",
  logo: process.env.NEXT_PUBLIC_CLIENT_LOGO || "/monotosh_logo_1.1.png",
};

export function formatWhatsAppNumber(phone?: string): string {
  const targetPhone = phone || siteConfig.phone;
  const cleanPhone = targetPhone.replace(/\s/g, '');
  return cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
}

export function getWhatsAppUrl(message?: string, phone?: string): string {
  const number = formatWhatsAppNumber(phone);
  if (!message) {
    return `https://wa.me/${number}`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
