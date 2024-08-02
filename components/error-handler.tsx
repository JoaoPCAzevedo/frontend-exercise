/**
 * Imports
 */
import { Button } from "@nextui-org/button";
import { Snippet } from "@nextui-org/snippet";

/**
 * Definitions
 */
interface ErrorHandleProps {
  mutate: () => void;
}

/**
 * Component
 */
export default function ErrorHandler({ mutate }: ErrorHandleProps) {
  // Render
  return (
    <Snippet hideCopyButton hideSymbol variant="bordered">
      <span>
        Failed to load
        <Button className="ml-2" color="primary" onClick={() => mutate()}>
          Retry
        </Button>
      </span>
    </Snippet>
  );
}
