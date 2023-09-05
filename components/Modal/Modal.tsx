import { ReactNode } from 'react';

type Props = {
  title: string;
  body: ReactNode;
  button: ReactNode;
};

export const Modal = ({ title, body, button }: Props) => {
  return (
    <div className='fixed z-10 inset-0 overflow-y-auto' role='dialog'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          aria-hidden='true'
        ></div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-neutral rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
          <div className='flex justify-center items-center'>
            <div className='text-center mt-2'>
              <h1 className='text-lg leading-8 text-3xl' id='modal-title'>
                {title}
              </h1>
              <div className='mt-6'>{body}</div>
            </div>
          </div>
          <div className='mt-8'>{button}</div>
        </div>
      </div>
    </div>
  );
};
