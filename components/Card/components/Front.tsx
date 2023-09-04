import Image from 'next/image';
import { useSpring, animated, SpringValue } from 'react-spring';
export const Front = ({transform, imageUrl, opacity}: {transform: SpringValue<string>, imageUrl: string, opacity: SpringValue<number>}) => {
    return (
        <animated.div
        className='w-full h-full bg-blue-500 shadow-md absolute inset-0 flex justify-center items-center p-8 dark:bg-gray-800 rounded-lg'
        style={{
          opacity,
          transform: transform.interpolate((t) => `${t} rotateY(180deg)`),
        }}
      >
        <Image
          width={1000}
          height={100}
          src={imageUrl}
          alt='Back'
          className='w-full h-full object-contain'
        />
      </animated.div>
    )
}