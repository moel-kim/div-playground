import { forwardRef } from 'react';

type DivElement = React.ElementRef<'div'>;
type DivProps = React.ComponentPropsWithoutRef<'div'>;

const Skeleton = forwardRef<DivElement, DivProps>(
  ({ children, ...rest }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          height: '200px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export type SimpleCardProps = DivProps & {
  title: string;
  description: string;
};

const Make = forwardRef<DivElement, SimpleCardProps>(
  ({ title, description, ...skeletonProps }, forwardedRef) => {
    return (
      <Skeleton ref={forwardedRef} {...skeletonProps}>
        <h2>{title}</h2>
        <p>{description}</p>
      </Skeleton>
    );
  }
);

export const SimpleCard = {
  Make,
  Skeleton,
};
