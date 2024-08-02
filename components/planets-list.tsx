"use client";

/**
 * Imports
 */
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { Input } from "@nextui-org/input";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

import ErrorHandler from "./error-handler";

import { fetcher } from "@/app/lib/fetcher";

/**
 * Definitions
 */
type Planet = {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  url: string;
};

type FetchPlanets = {
  count: number;
  results: Planet[];
};

/**
 * Helpers
 */
export function extractIdFromUrl(url: string) {
  // Extract ID from the planet URL, assuming the URL is in the format: https://swapi.dev/api/planets/{id}/
  const match = url.match(/\/(\d+)\/$/);
  const id = match ? match[1] : null;

  return id;
}
/**
 * Component
 */
export default function PlanetsList() {
  // Constants and hooks
  const rowsPerPage = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [pages, setPages] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/planets/?${
    searchTerm ? `search=${searchTerm}` : `page=${currentPage}`
  }`;
  const { data, error, mutate } = useSWR<FetchPlanets>(endpoint, fetcher, {
    onSuccess: (data) => {
      setPages(Math.ceil(data.count / rowsPerPage));
    },
  });
  const handleSearch = useDebouncedCallback((planetName: string) => {
    setSearchTerm(planetName);
    router.replace(planetName === "" ? "/?page=1" : `/?search=${planetName}`);
    setCurrentPage(1);
    mutate(); // Refetch data with the new search term
  }, 500);

  // Error handling
  if (error) {
    return <ErrorHandler mutate={mutate} />;
  }

  // Loading content
  const loading = () => {
    const content = [];

    for (let i = 0; i < rowsPerPage; i++) {
      content.push(
        <div key={i} className="py-2">
          <Skeleton className="w-full rounded-lg">
            <div className="w-full h-5" />
          </Skeleton>
        </div>
      );
    }

    return <div className="w-full justify-center">{content}</div>;
  };

  // Pagination
  const handlePagination = (pageNumber: number) => {
    router.replace("/?page=" + pageNumber.toString());
    setCurrentPage(pageNumber);
  };

  // Render
  return (
    <>
      <Input
        isClearable
        className="w-full sm:max-w-screen-sm"
        defaultValue={searchTerm}
        placeholder="Search by planet name..."
        startContent={<span>🔍</span>}
        onClear={() => handleSearch("")}
        onValueChange={(value) => handleSearch(value)}
      />
      <Table
        aria-label="Plannets list"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={currentPage}
              total={pages}
              onChange={(page) => handlePagination(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn className="uppercase">name 🌍</TableColumn>
          <TableColumn className="uppercase">climate ☁️</TableColumn>
          <TableColumn className="uppercase">terrain 🏔️</TableColumn>
          <TableColumn className="uppercase">population 👨‍👩‍👧‍👦</TableColumn>
          <TableColumn className="uppercase"> </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            data?.results?.length === 0 ? <p>No results found</p> : loading()
          }
        >
          {data?.results?.map((planet) => (
            <TableRow key={planet.name}>
              <TableCell>{planet.name}</TableCell>
              <TableCell>{planet.climate}</TableCell>
              <TableCell>{planet.terrain}</TableCell>
              <TableCell>{planet.population}</TableCell>
              <TableCell>
                <Link href={`/planet/${extractIdFromUrl(planet.url)}`}>👁️</Link>
              </TableCell>
            </TableRow>
          )) ?? []}
        </TableBody>
      </Table>
    </>
  );
}
