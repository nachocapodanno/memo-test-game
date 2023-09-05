import { CrossIcon } from "./CrossIcon";

type Props = {
  onClick: () => void;
};

export const CloseButton = ({ onClick }: Props) => {
  return (
    <button
      className='btn btn-square absolute top-5 right-5 m-4'
      onClick={onClick}
    >
      <CrossIcon />
    </button>
  );
};
