"use client";

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: string[];
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchPlaceholder = "Buscar...",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const filterableColumns = columns.filter(
    (col) => col.filterable && col.filterOptions,
  );

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchLower);
        }),
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((row) => row[key as keyof T] === value);
      }
    });

    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === bVal) return 0;

        let comparison = 0;
        if (typeof aVal === "number" && typeof bVal === "number") {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return sortDirection === "desc" ? -comparison : comparison;
      });
    }

    return result;
  }, [data, search, filters, sortKey, sortDirection, columns]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="w-4 h-4 text-muted-foreground/50" />;
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="w-4 h-4" />;
    }
    return <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {filterableColumns.map((col) => (
          <Select
            key={String(col.key)}
            value={filters[String(col.key)] || "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, [String(col.key)]: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={col.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos - {col.label}</SelectItem>
              {col.filterOptions?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {filteredAndSortedData.length} de {data.length} resultados
      </p>

      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={col.className}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  style={col.sortable ? { cursor: "pointer" } : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
