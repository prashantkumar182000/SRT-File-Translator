// src/components/DataDictionaryTable.tsx
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography 
} from '@mui/material';
import { DataDictionaryEntry, Language } from '../types';

interface DataDictionaryTableProps {
  entries: DataDictionaryEntry[];
  selectedLanguages: Language[];
}

const DataDictionaryTable: React.FC<DataDictionaryTableProps> = ({ 
  entries,
  selectedLanguages 
}) => {
  if (entries.length === 0) return null;

  return (
    <Paper elevation={2} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Dictionary Entries ({entries.length})
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Term</TableCell>
              {selectedLanguages.map(lang => (
                <TableCell key={lang}>{lang.toUpperCase()}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.term}</TableCell>
                {selectedLanguages.map(lang => (
                  <TableCell key={lang}>
                    {entry.translations[lang] || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataDictionaryTable;