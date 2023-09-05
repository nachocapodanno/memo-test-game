import { ReactNode } from 'react';

interface MemoCardProps {
  title: string;
  body: ReactNode;
  onStartSession: () => void;
  onContinueSession: () => void;
  showContinueButton?: boolean;
}
export const MemoTestCard = ({
  title,
  body,
  onStartSession,
  onContinueSession,
  showContinueButton = false,
}: MemoCardProps) => {

  return (
    <div className='card w-96 bg-primary text-primary-content'>
      <div className='card-body'>
        <h2 className='card-title subpixel-antialiased text-2xl'>{title}</h2>
        <div className='stat p-0'>{body}</div>
        <div className='card-actions justify-end mt-4'>
          <button onClick={onStartSession} className='btn btn-success'>
            Start
          </button>
          {showContinueButton && (
            <button
              onClick={onContinueSession}
              className='btn btn-success'
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
