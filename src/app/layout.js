export const metadata = {
  title: 'Orhuç Tekstil & Şapka Mağazası',
  description: 'En kaliteli özel tasarım şapka modelleri',
  icons: {
    icon: '/orhuc.png',
    shortcut: '/orhuc.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50 text-gray-900 m-0 p-0 font-sans">
        {children}
      </body>
    </html>
  );
}