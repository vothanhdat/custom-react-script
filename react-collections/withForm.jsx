
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import wrapDisplayName from 'recompose/wrapDisplayName';
import { isEqual } from 'lodash'
import { debounce, bind, memoize } from 'lodash-decorators'
import * as ReactIs from 'react-is'

const withForm = (validate = {}, inputMasking = {}) => (BaseComponent) => {

  class WithForm extends Component {

    state = { ...this.props.data || {} }

    getError(e) {
      if (ReactIs.isElement(e))
        return e;
      else if (e instanceof Array)
        return e.map(e => ReactIs.isElement(e) ? e : (e && new String(e)));
      else
        return new String(e);
    }

    @bind()
    @memoize()
    handleChange(name) {
      return (event, checked) => {
        var error = undefined;
        var helpText = ""
        var value = checked !== undefined ? checked : event.target.value
        var newState = { ...this.state, [name]: value }
        try {
          if (inputMasking[name])
            value = inputMasking[name](value)
          if (validate[name])
            validate[name](value, newState, this.props);
        } catch (e) {
          error = true;
          helpText = this.getError(e);


          if (!this.state[name + ':error'])
            this.setState({
              [name + ':error']: true,
              [name + ':helptext']: helpText,
            })
        }

        this.setState({
          [name]: value,
          [name + ':error']: error,
          [name + ':helptext']: helpText,
        });

        this.onChangeState()
      }
    }

    @bind()
    @memoize()
    handleBlur(name) {
      return () => this.handleChange(name)({ target: { value: this.state[name] } })
    }

    @bind()
    @debounce(500)
    onChangeState() {
      const constChangeState = {}
      for (var i in this.state) {
        if (i.indexOf(':') == -1) {
          constChangeState[i] = this.state[i];
        }
      }
      this.props.onChange && this.props.onChange(constChangeState)
    }

    @bind()
    handleError({ code, field, message } = {}) {
      this.setState({
        [field + ':error']: true,
        [field + ':helptext']: this.getError(message),
      });
      try {
        findDOMNode(this)
          .querySelector(`[name="${i}"]`)
          .focus();
      } catch { }
    }

    @bind()
    @memoize((name, value) => name + ':toggle:' + value)
    handleToggle(name, value = undefined) {
      return () => {
        value === undefined
          ? this.setState({ [name]: !this.state[name] })
          : this.setState({ [name]: value })
      }
    }

    @bind()
    field(name, options = {}) {
      const { compact = false, required = false } = options
      return {
        required, name,
        value: this.state[name] || "",
        onChange: this.handleChange(name),
        onBlur: this.handleBlur(name),
        ...compact ? {} : {
          error: this.state[`${name}:error`] || false,
          helperText: this.state[`${name}:helptext`] || "",
        }
      }
    }

    @bind()
    validate() {
      try {
        for (var i in validate)
          if (!i.includes(':') && validate[i])
            validate[i](this.state[i], this.state, this.props)
      } catch (e) {
        this.handleError({
          field: i,
          message: e,
        })
        throw e;
      }
    }

    @bind()
    submit() {
      this.validate()
      this.props.onSubmit && this.props.onSubmit()
    }

    @bind()
    reset() {
      var newState = {}
      for (var i in this.state)
        newState[i] = null;
      this.setState(newState)
    }

    @bind()
    getCleanValues() {
      var cleanState = {}
      for (var i in this.state)
        if (!i.includes(':'))
          cleanState[i] = this.state[i];
      return cleanState;
    }

    componentDidUpdate({ data }) {
      if (!isEqual(this.props.data, data))
        this.setState(this.props.data, () => this.validate())
    }

    render() {
      return <BaseComponent
        {...this.props}
        formfield={this.field}
        values={this.state}
        submit={this.submit}
        reset={this.reset}
        validate={this.validate}
        handleError={this.handleError}
        handleToggle={this.handleToggle}
        getCleanValues={this.getCleanValues}
      />
    }

  }

  if (process.env.NODE_ENV !== 'production') {
    WithForm.displayName = wrapDisplayName(BaseComponent, 'withForm');
  }

  return WithForm;
}

export default withForm;
