"use client";

/**
 * Imports
 */
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

import ErrorHandler from "@/components/error-handler";
import { usePlanet } from "@/app/hooks/usePlanet";

/**
 * Component
 */
export default function Planet({ params }: { params: { id: string } }) {
  // Constants and hooks
  const { planet, isLoading, isError, mutate } = usePlanet(params.id);

  // Error handling
  if (isError) {
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
          <TableCell>{planet?.name}</TableCell>
          <TableCell>{planet?.climate}</TableCell>
          <TableCell>{planet?.terrain}</TableCell>
          <TableCell>{planet?.population}</TableCell>
          <TableCell>{planet?.rotation_period}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
