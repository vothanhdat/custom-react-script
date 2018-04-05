import React from 'react';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
    filename: {
        padding: "0.2em 0",
        fontStyle:"italic",
        fontSize:"0.8em"
    },
})



function getFileSize(formgetter, id) {
    try {
        var size = formgetter()[id].files[0].size
        if (size > 1024 * 1024)
            return `${(size / 1024 / 1024 * 100 | 0) / 100}MB`
        else if (size > 1024 * 10)
            return `${(size / 1024 * 10 | 0) / 10}KB`
        else
            return `${size}byte`
    } catch (error) {
        return 0
    }
}

@withStyles(styles)
class FileField extends React.PureComponent { 
    componentWillUnmount(){
        this.props.outsideInput || this.props.onChange({target : {value: ""}})
    }
    render(){
        const { label, className = '', value, onChange, name, helperText, classes, error, formgetter ,required, outsideInput, allowRemove =true, buttons=[] } = this.props
        
        console.log(helperText);

        return <FormControl required error={error} className={className}>
        
            <FormLabel component="label" error={error} required={required}>{label}</FormLabel>
            <div className={classes.filename}>
                {(value || "").split('\\').pop() || ""}
                {value && ` (${getFileSize(formgetter, name)})`}
            </div>
        
            <div>
                <label htmlFor={name}>
                    {!outsideInput && <input accept="jpg,jpeg,JPG,JPEG" id={name} name={name} multiple type="file" style={{ display: "none" }} value={value} onChange={onChange} />}
                    <Button raised component="span" data-button onClick={this.props.onClick}>
                        {value ? 'Change' : 'Upload'}
                    </Button>
                </label>
                {allowRemove && value && <Button raised onClick={onChange} >Remove</Button>}
                {buttons}
            </div>
        
            {helperText && <FormHelperText >{helperText}</FormHelperText>}
        </FormControl>
    }
}


export default FileField