export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className="bg-white bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
