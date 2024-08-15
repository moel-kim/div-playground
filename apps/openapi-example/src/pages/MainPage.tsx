import { PetApiFactory } from '../api';
import { useSuspenseQuery } from '@tanstack/react-query';

const pet = PetApiFactory();

export const MainPage = () => {
  const {
    data: { data },
  } = useSuspenseQuery({
    queryKey: ['pet'],
    queryFn: () => pet.getPetById({ petId: 1 }),
  });

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          height: '200px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
        }}
      >
        <h1
          style={{
            color: 'white',
          }}
        >
          name: {data.name}
        </h1>
        <p>{data.status}</p>
      </div>
    </div>
  );
};
