import React from 'react';
import ReactDOM from 'react-dom'
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { bind, memoize } from 'lodash-decorators';
import { ButtonBase, IconButton } from 'material-ui';
import { noop } from 'redux-saga/utils';
import withSCSS from 'withsass.macro';
import withDrop from './withDrop'

function getFileSize(value) {
  try {
    var size = (FileField.globalBlob[value] && FileField.globalBlob[value].size)
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


@withDrop()
class DropFileItem extends React.Component {
  render() {
    const {
      ItemRender, e, i, name, classes, defaultValues, onRemove,
      dropping, files,
      dragProps = {},
      error,
      ...props
    } = this.props
    return (
      <ButtonBase
        key={e} component="span" data-idx={i}
        focusRipple
        className={classes.previewitem}
        data-replace={dropping}
        {...props} {...dragProps}>
        <ItemRender index={i} name={name} rawvalue={e} className={classes.uploadimage} value={defaultValues[i]} />
        {
          onRemove && <ButtonBase className={classes.previewdelete} data-idx={i} onClick={onRemove}>
            <i className="material-icons">close</i>
          </ButtonBase>
        }
        {
          dropping && <span className={classes.previewdrop}> {e ? "Drop here to change image" : "Drop here to add images"}</span>
        }
        {
          error && !dropping && <span className={classes.error}>{error}</span>
        }
      </ButtonBase>
    )
  }
}


@withSCSS('./common.scss', './FileField.scss')
class FileField extends React.PureComponent {

  static globalBlob = {}
  static _blocking = false;

  static async uploadFile({ accept, multiple } = {}) {
    if (this._blocking)
      throw "Duplicated";
    this._blocking = true;
    var input = document.createElement('input')
    input.type = 'file';
    input.id = 'file';
    input.multiple = multiple;
    input.accept = accept;
    input.style.display = 'none';
    document.body.appendChild(input);

    return new Promise((resolve, reject) => {

      input.onchange = (e) => {
        resolve([...input.files])
      }
      setTimeout(() => {
        this._blocking = false;
        document.body.removeChild(input);
      }, 1000)

      input.click();

    })
  }

  state = { dropping: false }

  inputref = e => this.input = e

  @bind()
  onUploadClick(e) {
    e.preventDefault();
    FileField.uploadFile({
      accept: "jpg,jpeg,JPG,JPEG",
      multiple: this.props.multiple,
    }).then(files => {
      this.onChange(files)
    })
  }

  @bind()
  onChange(files, append) {
    var maxFile = this.props.multiple ? (this.props.maxFile || 10) : 1
    var keys = append
      ? this.props.value.split(',').filter(e => !!e)
      : []
    for (var file of files) {
      if (keys.length >= maxFile)
        break;
      var key = file.lastModified + '_' + file.name
      console.log({ key, file })
      this.constructor.globalBlob[key] = file;
      keys.push(key);

    }
    this.props.onChange({ target: { value: keys.join(',') } });
  }

  @bind()
  onAddItems(e) {
    e.preventDefault();
    FileField.uploadFile({
      accept: "jpg,jpeg,JPG,JPEG",
      multiple: this.props.multiple,
    }).then(files => {
      this.onChange(files, true);
    })
  }


  @bind()
  onRemove(e) {
    e.preventDefault();
    e.stopPropagation();
    const { currentTarget: { dataset: { idx } } } = e
    var files = [...(this.props.value || '').split(',')]
    files.splice(parseInt(idx) || 0, 1);
    this.props.onChange({
      target: {
        value: files.join(',')
      }
    });
  }

  @bind()
  onUpdateFile(file, idx) {
    if (!file)
      return;
    var files = (this.props.value || '').split(',')
    var filevalue = file.lastModified + '_' + file.name
    this.constructor.globalBlob[filevalue] = file;
    this.props.onChange({
      target: {
        value: files.map((e, i) => idx == i ? filevalue : e).join(',')
      }
    });
  }

  @bind()
  onChangeItem(e) {
    e.preventDefault();

    const { currentTarget: { dataset: { idx } } } = e
    // var files = (this.props.value || '').split(',')
    var index = parseInt(idx) || 0;
    FileField.uploadFile({
      accept: "jpg,jpeg,JPG,JPEG",
      multiple: false,
    }).then(([file]) => {
      this.onUpdateFile(file, index)
    })
  }

  @bind()
  @memoize()
  onDropInFile(idx) {
    return ([file]) => file && this.onUpdateFile(file, idx)
  }

  @bind()
  onDropInPlus(files) {
    this.onChange(files, true)
  }

  componentWillUnmount() {
    // this.props.onChange({ target: { value: "" } });
  }

  render() {
    const {
      label,
      className = '',
      value = '',
      defaultValue = '',
      name,
      helperText,
      error,
      required,
      multiple,
      accept = "jpg,jpeg,JPG,JPEG",
      buttons = [],
      classes = {},
      allowRemove,
      children,
      maxFile = 10,
      itemRender: ItemRender,
    } = this.props
    const maximum = multiple ? maxFile : 1;
    const values = (value || '').split(',').filter(e => e);
    const defaultValues = (defaultValue || '').split(',').filter(e => e);

    return <FormControl required error={error} className={className}>

      <FormLabel component="label" error={error} required={required}>{label}</FormLabel>

      {!ItemRender && <small className={classes.filename}>
        {(value || "").split('\\').pop() || ""}
        {FileField.globalBlob[value] && `  (${getFileSize(value)})`}
      </small>}

      <div>
        {
          ItemRender && values.map(
            (e, i, arr) => e && <DropFileItem key={e}
              {...{ e, i, arr, classes, defaultValues, ItemRender, name }}
              onRemove={this.onRemove}
              onDrop={this.onDropInFile(i)}
              onClick={this.onChangeItem}
              error={error && helperText instanceof Array && helperText[i]}
            />
          )
        }
        {
          (ItemRender && values.length < maximum) && <DropFileItem
            {...{ e: '', classes, defaultValues: {}, ItemRender }}
            onClick={this.onAddItems}
            onDrop={this.onDropInPlus}
            data-drop
          />
        }

        {
          // !!ItemRender || <Button data-drop={dropping} variant="flat" component="span" onClick={this.onChangeItem} >
          //   {value ? 'Change' : 'Uploads'}
          // </Button>
        }

        {allowRemove && !multiple && value && <Button variant="flat" onClick={onChange} >Remove</Button>}
        {buttons}
      </div>

      {helperText && !(helperText instanceof Array) && <FormHelperText> {helperText} </FormHelperText>}
    </FormControl>
  }
}


export default FileField