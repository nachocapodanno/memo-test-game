import { Back } from './components/Back';
import { Front } from './components/Front';
import { useSpring } from 'react-spring';

export const Card = ({
  isFlipped,
  onClick,
  number,
  imageUrl,
}: {
  isFlipped: boolean;
  onClick: () => void;
  number: number;
  imageUrl: string;
}) => {
  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${isFlipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <div
      className='w-48 h-64 relative cursor-pointer rounded-lg overflow-hidden'
      onClick={onClick}
    >
      <Front transform={transform} imageUrl={imageUrl} opacity={opacity} />
      <Back transform={transform} number={number} opacity={opacity} />
    </div>
  );
};
