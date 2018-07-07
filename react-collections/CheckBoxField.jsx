
import React from 'react';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';




const CheckBoxField = ({ label, className, value, onChange, name, helperText, choose, error,required = true }) => <FormControl error={error} required={required} className={className}>
    <FormControlLabel
        control={<Checkbox onChange={onChange} value={value+''} id={name} />}
        label={label}
    />
    {helperText && <FormHelperText >{helperText}</FormHelperText>}
</FormControl>

export default CheckBoxField