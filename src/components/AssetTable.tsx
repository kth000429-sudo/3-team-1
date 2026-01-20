import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Asset {
    id: string;
    image_url: string;
    metadata: any;
    created_at: string;
    status: string;
}

const columnHelper = createColumnHelper<Asset>();

const AssetTable: React.FC<{ data: Asset[] }> = ({ data }) => {
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: info => info.getValue().split('-')[0],
        }),
        columnHelper.accessor('image_url', {
            header: 'Thumbnail',
            cell: info => (
                <div className="w-16 h-10 bg-muted rounded overflow-hidden">
                    <img
                        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/banners/${info.getValue()}`}
                        alt="Thumbnail"
                        className="object-cover w-full h-full"
                    />
                </div>
            ),
        }),
        columnHelper.accessor('metadata', {
            header: 'Metadata',
            cell: info => {
                const metadata = info.getValue();
                return (
                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex gap-1">
                            {metadata?.colors?.map((c: string) => (
                                <div key={c} className="w-3 h-3 rounded-full border" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                        <span>{metadata?.font}</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('created_at', {
            header: 'Date',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => (
                <Badge variant={info.getValue() === 'approved' ? 'default' : 'secondary'}>
                    {info.getValue()}
                </Badge>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: info => {
                const asset = info.row.original;
                const handleDownload = async () => {
                    try {
                        const { data: fileData, error } = await supabase.storage
                            .from('banners')
                            .download(asset.image_url);

                        if (error) throw error;

                        const url = URL.createObjectURL(fileData);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `banner-${asset.id.split('-')[0]}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    } catch (error) {
                        console.error('Download failed:', error);
                        alert('Failed to download image.');
                    }
                };

                return (
                    <Button variant="ghost" size="sm" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                );
            },
        }),
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No approved assets found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AssetTable;
