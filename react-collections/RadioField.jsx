
import React from 'react';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';



const RadioInput = ({ label, className, value, onChange, name, helperText, choose, error }) => <FormControl error={error} required>
    <FormLabel component="legend">{label}</FormLabel>
    <RadioGroup
        name={name}
        value={value}
        onChange={onChange}  >
        {
            choose.map((e) => <FormControlLabel
                key={e.value}
                control={<Radio />}
                {...e}
            />)
        }
    </RadioGroup>
</FormControl>

export default RadioInput