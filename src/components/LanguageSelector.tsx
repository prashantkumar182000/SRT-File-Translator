// src/components/LanguageSelector.tsx
import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Box,
  SelectChangeEvent 
} from '@mui/material';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguages: Language[];
  setSelectedLanguages: (languages: Language[]) => void;
}

const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguages, 
  setSelectedLanguages 
}) => {
  const handleChange = (event: SelectChangeEvent<Language[]>) => {
    const value = event.target.value;
    setSelectedLanguages(typeof value === 'string' ? [value as Language] : value as Language[]);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Target Languages</InputLabel>
      <Select
        multiple
        value={selectedLanguages}
        label="Target Languages"
        onChange={handleChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip 
                key={value} 
                label={LANGUAGES.find(l => l.code === value)?.name} 
                size="small"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        )}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;