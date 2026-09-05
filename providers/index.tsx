import QueryProvider from "./query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
    </>
  );
};
