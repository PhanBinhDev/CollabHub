import Header from '@/components/shared/header';

const PublicLayout = ({ children }: IChildren) => {
  return (
    <main className="min-h-screen overflow-x-hidden hide-scrollbar relative">
      <Header />

      <div className="pt-[66px] md:pt-[86px] w-full bg-transparent min-h-screen">
        {children}
      </div>
    </main>
  );
};

export default PublicLayout;
