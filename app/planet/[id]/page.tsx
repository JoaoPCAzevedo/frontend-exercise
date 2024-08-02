"use client";

/**
 * Imports
 */
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Skeleton } from "@nextui-org/skeleton";
import { Link } from "@nextui-org/link";

import { fetcher } from "@/app/lib/fetcher";
import ErrorHandler from "@/components/error-handler";

/**
 * Definitions
 */
type Planet = {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  url: string;
  rotation_period: string;
};

/**
 * Component
 */
export default function Planet({ params }: { params: { id: string } }) {
  // Constants and hooks
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/planets/${params.id}`;
  const { data, error, mutate, isLoading } = useSWR<Planet>(endpoint, fetcher);

  // Error handling
  if (error) {
    return <ErrorHandler mutate={mutate} />;
  }

  // Loading content
  if (isLoading) {
    return (
      <div className="w-full justify-center">
        <div className="py-2">
          <Skeleton className="w-full rounded-lg">
            <div className="w-full h-28" />
          </Skeleton>
        </div>
      </div>
    );
  }

  // Render
  return (
    <Table
      aria-label="Plannet details"
      topContent={<Link href="/">List all planets</Link>}
    >
      <TableHeader>
        <TableColumn className="uppercase">name 🌍</TableColumn>
        <TableColumn className="uppercase">climate ☁️</TableColumn>
        <TableColumn className="uppercase">terrain 🏔️</TableColumn>
        <TableColumn className="uppercase">population 👨‍👩‍👧‍👦</TableColumn>
        <TableColumn className="uppercase">rotattion period 🌀</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{data?.name}</TableCell>
          <TableCell>{data?.climate}</TableCell>
          <TableCell>{data?.terrain}</TableCell>
          <TableCell>{data?.population}</TableCell>
          <TableCell>{data?.rotation_period}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
