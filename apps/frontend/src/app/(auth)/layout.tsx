import Image from 'next/image';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center sm:w-[480px] shadow'>
        <div className='flex flex-col items-center justify-center bg-[#353688] text-white rounded-t-2xl py-3 space-y-2 shadow'>
          <h1 className='text-xl font-medium'>HRIS</h1>
          <Image src='/logo.png' alt='logo' width={100} height={32} />
        </div>
        {children}
      </div>
    </div>
  );
}
