"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconDownload,
} from "@tabler/icons-react";
import { ChevronDownIcon } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AquaData } from "@/type/aquaData";

const columns: ColumnDef<AquaData>[] = [
  {
    accessorKey: "id",
    header: () => <div className="ml-5">ID</div>,
    cell: ({ row }) => <div className="ml-5">{row.original.id}</div>,
    enableHiding: true, // Changed to true to allow hiding
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.terminaltime);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).format(date);
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.original.terminaltime);
      const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).format(date);
      return <span>{formattedTime}</span>;
    },
  },
  // {
  //   accessorKey: "groupname",
  //   header: () => <div className="text-center">Group Name</div>,
  //   cell: ({ row }) => <div className="text-center">{row.original.groupname}</div>,
  // },
  {
    accessorKey: "temperature",
    header: () => <div className="text-center">Temperature</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.temperature ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "Ozone",
    header: () => <div className="text-center">Ozone</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.ozone ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "ammonium",
    header: () => <div className="text-center">Ammonium</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.ammonium ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "oxygen",
    header: () => <div className="text-center">Oxygen</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.oxygen ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "conductivity",
    header: () => <div className="text-center">Conductivity</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conductivity ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "tds",
    header: () => <div className="text-center">TDS</div>,
    cell: ({ row }) => <div className="text-center">{row.original.tds ?? 0}</div>,
  },
];

export function DataTable({ data: initialData }: { data: AquaData[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date()); // Set default to today
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [isDownloadPopoverOpen, setIsDownloadPopoverOpen] = React.useState(false); // State for main download popover
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = React.useState(false); // State for start date picker popover
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = React.useState(false); // State for end date picker popover

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleDownload = () => {
    const headers = table
      .getAllColumns()
      .filter((column) => column.getIsVisible() && column.id !== "id") // Exclude 'id' column and hidden columns
      .map((column) => column.id);

    const filteredData = data.filter((row) => {
      const rowDate = new Date(row.terminaltime);
      const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

      if (start && end) {
        return rowDate >= start && rowDate <= end;
      } else if (start) {
        return rowDate >= start;
      } else if (end) {
        return rowDate <= end;
      }
      return true; // No date filter applied
    });

    const csv = [
      headers.join(","),
      ...filteredData.map((row) =>
        headers
          .map((header) => {
            let value = (row as any)[header]; // Use any to access properties dynamically
            if (header === "date" || header === "time") {
              const date = new Date(row.terminaltime);
              if (header === "date") {
                value = new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(date);
              } else {
                value = new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hour12: false,
                }).format(date);
              }
            } else if (
              header === "temperature" ||
              header === "ozone" ||
              header === "ammonium" ||
              header === "oxygen" ||
              header === "conductivity" ||
              header === "tds"
            ) {
              value = value ?? 0;
            }
            return `"${value}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "aqua_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      document.body.removeChild(link);
      link.click();
    }
  };

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-end px-4 lg:px-6 py-5">
        <div className="flex items-center gap-2">
          <Popover open={isDownloadPopoverOpen} onOpenChange={setIsDownloadPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <IconDownload />
                <span className="hidden lg:inline">Download Data</span>
                <span className="lg:hidden">Download</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto text-sm" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Download Data</h4>
                  <p className="text-muted-foreground text-sm">
                    Select a date range to download data.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date" className="px-1">Start Date</Label>
                    <Popover open={isStartDatePickerOpen} onOpenChange={setIsStartDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="start-date"
                          className="w-48 justify-between font-normal"
                        >
                          {startDate ? format(startDate, "PPP") : "Select start date"}
                          <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            setIsStartDatePickerOpen(false);
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date" className="px-1">End Date</Label>
                    <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="end-date"
                          className="w-48 justify-between font-normal"
                        >
                          {endDate ? format(endDate, "PPP") : "Select end date"}
                          <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            setIsEndDatePickerOpen(false);
                          }}
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button onClick={handleDownload} disabled={!startDate || !endDate}>
                  Download CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
