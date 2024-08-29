import useSWR from "swr";

import { Planet } from "@/app/utils/definitions";
import { fetcher } from "@/app/lib/fetcher";

export function usePlanet(id: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/planets/${id}`;
  const { data, error, mutate, isLoading } = useSWR<Planet>(endpoint, fetcher);

  return {
    planet: data,
    isLoading,
    isError: error,
    mutate,
  };
}
