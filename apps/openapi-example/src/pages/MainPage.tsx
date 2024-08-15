import { PetApiFactory } from "../api";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { SimpleCard } from "../components/SimpleCard";
import { pulse } from "../keyframes/shim";
import { SmartSuspense } from "../components/SmartSuspense";
import { ErrorBoundary } from "react-error-boundary";

const pet = PetApiFactory();

const RenderPage = () => {
  const {
    data: { data },
  } = useSuspenseQuery({
    queryKey: ["pet"],
    queryFn: () => {
      return pet.getPetById({ petId: 1 });
    },
  });

  return (
    <SimpleCard.Make title={data.name} description={data.status ?? "unknown"} />
  );
};

export const MainPage = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <SimpleCard.Skeleton>
          There was an error!
          <button onClick={() => resetErrorBoundary()}>Try again</button>
        </SimpleCard.Skeleton>
      )}
    >
      <SmartSuspense
        fallbackMinDurationMs={2000}
        fallback={
          <SimpleCard.Skeleton
            css={{
              animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            }}
          >
            <div
              css={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                css={{
                  width: "100%",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              />
              <div
                css={{
                  width: "100%",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
          </SimpleCard.Skeleton>
        }
      >
        <RenderPage />
      </SmartSuspense>
    </ErrorBoundary>
  );
};
