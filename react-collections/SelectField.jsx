
import { FormControl, FormHelperText, InputLabel, Select } from '@material-ui/core';
import React from 'react';

const SelectField =
    ({ label, className = '', native, value, onChange, name, helperText, classes = {}, error, options = [], fullWidth }) =>
        <FormControl className={classes.formControl} error={error} fullWidth={fullWidth}>
            <InputLabel htmlFor={name} >{label}</InputLabel>
            <Select
                native
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
                name={name}
                id={name}>
                <option value="" />
                {options
                    .map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>

export default SelectField