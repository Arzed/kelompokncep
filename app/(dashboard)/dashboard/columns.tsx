'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTableColumnHeader from '@/components/data-table-column-header';
import { Foods } from '@prisma/client';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { changeStock, deleteProductAction } from '@/app/_actions/food';
import { catchError } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// This type is used to define the shape of our data.
// export type Product = {
//   id: string;
//   thumbnail: string;
//   name: string;
//   type: string;
//   sku: string;
//   qty: number;
//   status: string;
//   description: string;
//   price: number;
// };

export const columns: ColumnDef<Foods>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ml-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'gambar',
    header: 'Gambar',
    cell: ({ row }) => {
      const gambar: string = row.getValue('gambar');

      return (
        <div className="flex items-center">
          {gambar ?
            <Image
              className="w-10 h-10 rounded-full object-cover"
              src={gambar}
              width={40}
              height={40}
              alt="Product thumbnail"
            />
            :
            <Image
             className='w-10 h-10 rounded-full'
             src={'/noodle.jpg'}
             alt=''
             width={40}
             height={40}
            />
          }
        </div>
      );
    },
  },
  {
    accessorKey: 'namaMakanan',
    header: 'Nama',
    cell: ({row}) => {
      const nama: string = row.getValue('namaMakanan')
      return (
        <div className='capitalize'>{nama}</div>
      )
    }
  },
  // {
  //   accessorKey: 'type',
  //   header: 'Type',
  // },
  // {
  //   accessorKey: 'sku',
  //   header: 'SKU',
  // },
  // {
  //   accessorKey: 'qty',
  //   header: 'Quantity',
  // },
  {
    accessorKey: 'isAvailable',
    header: 'Stok',
    cell: ({ row }) => {
      const isAvailable = row.getValue('isAvailable');
      return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-center text-xs font-medium ${
                    isAvailable === true
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isAvailable ? "Tersedia" : "Habis"}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className='w-30'>
              <Switch id="airplane-mode" 
                checked={row.original.isAvailable}
                onCheckedChange={() => {
                  row.toggleSelected(false)

                  toast.promise(
                    changeStock({id: row.original.id, isAvailable: row.original.isAvailable}),
                    {
                      loading: "Changing...",
                      success: () => "Berhasil di ubah.",
                      error: (err: unknown) => catchError(err),
                    }
                  )
                }}
              />
            </HoverCardContent>
          </HoverCard>
      );
    },
  },
  {
    accessorKey: 'deskripsi',
    // header: 'Short Description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short Description" />
    ),
  },
  {
    accessorKey: 'harga',
    //header: () => <div className="text-right">Price</div>,
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end"
        column={column}
        title="harga"
      />
    ),
    cell: ({ row }) => {
      const harga = parseFloat(row.getValue('harga'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(harga);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const food = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <Link href={`/dashboard/menu/edit/${row.original.id}`} >
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              </Link>
            <DropdownMenuItem
             className="cursor-pointer"
             onClick={() => {
                row.toggleSelected(false)

                toast.promise(
                  deleteProductAction({
                    id: row.original.id,
                  }),
                  {
                    loading: "Deleting...",
                    success: () => "Berhasil di hapus.",
                    error: (err: unknown) => catchError(err),
                  }
                )
            }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(food.id)}
            >
              Copy Product ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
