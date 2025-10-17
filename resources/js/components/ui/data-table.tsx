import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  Table as TableType,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns,
  Download,
  EyeOff,
  MoreVertical,
  Search
} from 'lucide-react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { ScrollArea } from './scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Separator } from './separator'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  children?: ReactNode
  canFilter?: boolean
}

export function DataTableColumnHeader<TData, TValue>({ column, children, canFilter = true, className }: DataTableColumnHeaderProps<TData, TValue>) {
  const [filterValue, setFilterValue] = useState((column?.getFilterValue() as string) ?? '')
  let titleContent = children || column.id

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{titleContent}</div>
  }

  const applyFilter = () => {
    column?.setFilterValue(filterValue)
  }

  const highlighted = column.getIsFiltered() || column.getIsSorted()
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={highlighted ? 'secondary' : 'ghost'}
            size="sm"
            className="data-[state=open]:bg-accent group -ml-3 flex h-8 w-full justify-between"
          >
            <div className={highlighted ? 'font-bold' : ''}>{titleContent}</div>

            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : (
              <MoreVertical className="ml-2 size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="grid w-48 gap-1 p-2">
          {canFilter && (
            <>
              <div className="flex">
                <Input
                  placeholder={`Filter ${column.id}...`}
                  value={filterValue}
                  onChange={(event) => setFilterValue(event.target.value)}
                  className="rounded-r-none focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      applyFilter()
                    }
                  }}
                />
                <Button onClick={applyFilter} size="icon" className="rounded-l-none">
                  <Search className="size-4" />
                </Button>
              </div>
              <Separator />
            </>
          )}
          <Button
            size="sm"
            variant={column.getIsSorted() === false ? 'secondary' : 'ghost'}
            className="flex justify-start"
            onClick={() => column.clearSorting()}
          >
            <ArrowUpDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Default
          </Button>
          <Button
            size="sm"
            variant={column.getIsSorted() === 'asc' ? 'secondary' : 'ghost'}
            className="flex justify-start"
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Asc
          </Button>
          <Button
            size="sm"
            variant={column.getIsSorted() === 'desc' ? 'secondary' : 'ghost'}
            className="flex justify-start"
            onClick={() => column.toggleSorting(true)}
          >
            <ArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Desc
          </Button>
          <Separator />
          <Button size="sm" variant="ghost" className="flex justify-start" onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Hide
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterBy?: string
  noDataContent?: ReactNode
  calcTotals?: ReactNode
  headerContent?: ReactNode
  canExport?: boolean
  exportedFileName?: string
  initialColumnVisibility?: VisibilityState
  columnVisibilityValue?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  hideViewOptions?: boolean
  pageSize?: 10 | 25 | 50 | 100 | 'all'
  hidePagination?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  filterBy,
  noDataContent,
  calcTotals = true,
  headerContent,
  data,
  canExport = true,
  exportedFileName,
  initialColumnVisibility = {},
  columnVisibilityValue,
  hideViewOptions,
  pageSize,
  hidePagination,
  onColumnVisibilityChange
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility)

  const resetColumnVisibility = () => {
    if (onColumnVisibilityChange) onColumnVisibilityChange(initialColumnVisibility)
    else setColumnVisibility(initialColumnVisibility)
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: onColumnVisibilityChange || setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility: columnVisibilityValue || columnVisibility
    }
  })

  useEffect(() => {
    const length = table.getFilteredRowModel().rows.length
    if (length <= 100 && pageSize === undefined) table.setPageSize(length)
    if (pageSize === 'all' || hidePagination) table.setPageSize(length)
    else if (pageSize) table.setPageSize(pageSize)
  }, [data])

  return (
    <div className="flex w-full grow flex-col overflow-hidden p-1">
      <div className="@container/header-table flex flex-wrap items-center gap-2 pb-4">
        <DataTableFilter table={table} filterBy={filterBy} />
        {headerContent || <div className="sm:grow"></div>}
        {canExport && <DataTableExport table={table} exportedFileName={exportedFileName} />}
        {!hideViewOptions && <DataTableViewOptions table={table} resetColumnVisibility={resetColumnVisibility} />}
      </div>
      <div className="bg-card flex h-0.5 w-full grow rounded-md border">
        <Table className="w-full grow">
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="group">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className='hover:bg-background data-[state=selected]:bg-background'>
                <TableCell colSpan={columns.length} className="p-0 text-center">
                  {noDataContent || <div className="p-8">Sin datos.</div>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableHeader className="bg-card sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10 first:rounded-tl-md last:rounded-tr-md">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {calcTotals && table.getRowModel().rows?.length ? <DataTableTotal table={table} /> : null}
        </Table>
      </div>
      <div className="h-2"></div>
      {!hidePagination && <DataTablePagination table={table} />}
    </div>
  )
}

interface DataTableFilterProps<TData> {
  table: TableType<TData>
  filterBy?: string
}

function DataTableFilter<TData>({ table, filterBy }: DataTableFilterProps<TData>) {
  const column = filterBy ? table.getColumn(filterBy) : null
  const [filterValue, setFilterValue] = useState((column?.getFilterValue() as string) ?? '')

  const applyFilter = () => {
    column?.setFilterValue(filterValue)
  }

  if (!filterBy) return null

  return (
    <div className="mr-2 flex flex-grow">
      <Input
        placeholder={`Buscar por ${filterBy}`}
        value={filterValue}
        onChange={(event) => setFilterValue(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            applyFilter()
          }
        }}
        className="h-8 max-w-sm min-w-48 rounded-r-none focus-visible:ring-0"
      />
      <Button onClick={applyFilter} size="icon" className="h-8 rounded-l-none">
        <Search className="size-4" />
      </Button>
    </div>
  )
}

interface DataTableExportProps<TData> {
  table: TableType<TData>
  exportedFileName?: string
}

export function DataTableExport<TData>({ table, exportedFileName }: DataTableExportProps<TData>) {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      // Crear un nuevo workbook y una hoja
      const ExcelJS = await import('exceljs')
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet(exportedFileName || 'Export')

      // Obtener los nombres de las columnas
      const columnNames = table
        .getAllColumns()
        .filter((column) => column.getIsVisible() && column.id !== 'actions')
        .map((column) => {
          const meta = column.columnDef.meta as { title: string }
          return typeof meta?.title === 'string' ? meta?.title : column.id
        })

      // Agregar los nombres de las columnas como la primera fila
      const headerRow = worksheet.addRow(columnNames)

      // Estilizar la fila de encabezados
      headerRow.eachCell((cell) => {
        cell.font = { bold: true }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
      })
      worksheet.views = [{ state: 'frozen', ySplit: 1 }] // Fijar la primera fila

      // Obtener los datos de las filas filtradas y agregarlos al worksheet
      const data = table.getFilteredRowModel().rows.map((row) =>
        row
          .getVisibleCells()
          .filter((cell) => cell.column.id !== 'actions')
          .map((cell) => String(cell.getValue() || ''))
      )
      data.forEach((row) => worksheet.addRow(row))

      // Configurar estilos opcionales (opcional)
      worksheet.columns.forEach((column) => {
        column.width = 20 // Ajustar el ancho de las columnas
      })

      // Descargar el archivo
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${exportedFileName || 'export'} - ${new Date().toLocaleString()}.xlsx`
      link.click()
    } catch (error) {
      console.error('Error al exportar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" className="ml-auto" onClick={handleExport} disabled={isLoading}>
      {isLoading ? (
        'Exportando...'
      ) : (
        <>
          <Download className="size-4" />
          <span className="ml-2 hidden @lg:inline">Exportar</span>
        </>
      )}
    </Button>
  )
}

interface DataTablePaginationProps<TData> {
  table: TableType<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="@container/pagination flex flex-wrap items-center justify-between overflow-hidden">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 @lg:gap-x-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ArrowLeftToLine className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ArrowRightToLine className="h-4 w-4" />
          </Button>
          <p className="flex items-center justify-center text-sm font-medium">
            <span className="hidden pr-1 @lg:inline">Pág</span> {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium @lg:inline">Mostrar</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              if (value === 'Todas') table.setPageSize(table.getFilteredRowModel().rows.length)
              else table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100, 'Todas'].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">de {table.getFilteredRowModel().rows.length}</p>
        </div>
      </div>
      <div className="text-muted-foreground hidden flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
      </div>
    </div>
  )
}

interface DataTableViewOptionsProps<TData> {
  table: TableType<TData>
  resetColumnVisibility: () => void
}

export function DataTableViewOptions<TData>({ table, resetColumnVisibility }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Columns className="h-4 w-4" />
          <span className="ml-2 hidden @lg:inline">Columnas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Visibilidad</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[200px]">
          <DropdownMenuCheckboxItem onClick={resetColumnVisibility}>Por defecto</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={table.getAllColumns().every((column) => column.getIsVisible())}
            onCheckedChange={() => {
              table.getAllColumns().forEach((column) => column.toggleVisibility(true))
            }}
          >
            Todas
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DataTableTotalProps<TData> {
  table: TableType<TData>
}

export function DataTableTotal<TData>({ table }: DataTableTotalProps<TData>) {
  const totalRow = useMemo(() => {
    const totals: Record<string, number> = {}
    table.getRowModel().rows.forEach((row) => {
      row.getVisibleCells().forEach((cell) => {
        if (typeof cell.getValue() === 'number') {
          totals[cell.column.id] = (totals[cell.column.id] || 0) + Number(cell.getValue())
        }
      })
    })
    return totals
  }, [
    table.getRowModel().rows.length,
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
    table.getState().sorting,
    table.getIsSomeColumnsVisible(),
    table.getRowModel().rows
  ])
  return (
    <TableFooter className="bg-muted sticky bottom-0">
      <TableRow>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            if (column.getIsVisible() === false) return null
            return (
              <TableCell key={column.id} className="py-1 md:py-1.5 lg:py-2">
                {typeof totalRow[column.id] === 'number' ? totalRow[column.id] : null}
              </TableCell>
            )
          })}
      </TableRow>
    </TableFooter>
  )
}