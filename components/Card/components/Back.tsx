import { useSpring, animated, SpringValue } from 'react-spring';

export const Back = ({transform, number, opacity}: {transform: SpringValue<string>, number: number, opacity: SpringValue<number>}) => {
  return (
    <animated.div
    className='w-full h-full shadow-md absolute inset-0 flex justify-center items-center text-4xl font-bold rounded-lg bg-blue-500 dark:bg-gray-800'
    style={{
      opacity: opacity.interpolate((o) => 1 - o),
      transform,
    }}
  >
    {number}
  </animated.div>
  );
};
