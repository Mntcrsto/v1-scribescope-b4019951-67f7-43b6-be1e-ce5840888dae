import React from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink } from 'lucide-react';
import { ImageResult } from '@/types';
interface ResultsTableProps {
  results: ImageResult[];
  onNoteChange: (id: string, note: string) => void;
  onReset: () => void;
}
export function ResultsTable({ results, onNoteChange, onReset }: ResultsTableProps) {
  const handleExport = () => {
    const csvData = Papa.unparse(results.map(r => ({
      ...r,
      otherUrls: r.otherUrls.join(', '),
    })));
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'scribescope_results.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-3xl font-display">Search Results</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={onReset} variant="outline">Start New Search</Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Thumbnail</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Main Source</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <img
                        src={result.thumbnailUrl}
                        alt={result.fileName}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{result.fileName}</TableCell>
                    <TableCell>
                      {result.mainSourceUrl ? (
                        <a
                          href={result.mainSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline inline-flex items-center gap-1 transition-colors"
                        >
                          View Source <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not Found</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{result.domain || 'N/A'}</TableCell>
                    <TableCell>
                      <Input
                        value={result.notes}
                        onChange={(e) => onNoteChange(result.id, e.target.value)}
                        placeholder="Add notes..."
                        className="min-w-[200px]"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}