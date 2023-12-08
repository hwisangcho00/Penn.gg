import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function DropDown({ options, label, onSelect }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedOption}
        onChange={handleChange}
        label={label}
        sx={{ backgroundColor: 'white' }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DropDown;