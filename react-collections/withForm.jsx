
import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import Recapcha from './Recapcha'
import { isEqual } from 'lodash'


const withForm = (validate = {}, defaultValues = {}, inputMasking = {}) => (BaseComponent) => {

  class WithForm extends Component {

    constructor(props) {
      super(props)
      this.state = { ...defaultValues, ...this.props.data || {} }
      this.cacheData = {}
    }

    cache = (name, func) => this.cacheData[name] || (this.cacheData[name] = func)

    handleChange = (name, option) => this.cache(name, (event, checked) => {
      var error = undefined;
      var helpText = ""
      var value = checked !== undefined ? checked : event.target.value
      var newState = { ...this.state, [name]: value }

      try {

        if (inputMasking[name]) {
          value = inputMasking[name](value)
        }

        if (validate[name])
          validate[name](newState, this.form, this.props);

        if (option.trigger) {
          for (var trig of option.trigger) {
            console.log(trig)
            if (validate[trig])
              validate[trig](newState, this.form, this.props);

            if (this.state[trig + ':error'])
              this.setState({
                [trig + ':error']: false,
                [trig + ':helptext']: "",
              })
          }
        }


      } catch (e) {
        error = true;
        helpText = e;
        if (!this.state[trig + ':error'])
          this.setState({
            [trig + ':error']: true,
            [trig + ':helptext']: helpText,
          })
      }



      if (name == "password") {
        this.setState({
          ["repassword"]: "",
          ["repassword" + ':error']: false,
          ["repassword" + ':helptext']: "",
        });
      }


      this.setState({
        [name]: value,
        [name + ':error']: error,
        [name + ':helptext']: helpText,
      });

      clearTimeout(this.onChangeStateTimeout);

      this.onChangeStateTimeout = setTimeout(this.onChangeState, 500);
    })


    onChangeState = () => {
      const constChangeState = {}
      for (var i in this.state) {
        if (i.indexOf(':') == -1) {
          constChangeState[i] = this.state[i];
        }
      }
      this.props.onChange && this.props.onChange(constChangeState)
    }


    handleError = ({ code, field, message } = {}) => {

      this.setState({
        [field + ':error']: true,
        [field + ':helptext']: message,
      });
    }


    handleToggle = (name, value = undefined) => this.cache(name + ':toggle:' + value, () => {
      value === undefined
        ? this.setState({ [name]: !this.state[name] })
        : this.setState({ [name]: value })

    })

    updateWhoteState = (state) => this.setState(state)

    field = (name, options = {}) => {
      const { compact = false, required = true } = options
      return {
        required: required,
        name: name,
        value: this.state[name] || "",
        onChange: this.handleChange(name, options),
        ...compact ? {} : {
          error: this.state[`${name}:error`] || false,
          helperText: this.state[`${name}:helptext`] || "",
        }
      }
    }

    formref = (e) => this.form = e

    formgetter = () => this.form

    validate = () => {
      // console.log(this.state, this.form)
      try {
        for (var i in validate) {
          if (!i.includes(':')) {
            console.log(i)
            if (validate[i])
              validate[i](this.state, this.form, this.props)
          }
        }
        // this.props.onSubmit(this.state,this.form)
      } catch (e) {
        this.setState({
          [i + ':error']: true,
          [i + ':helptext']: e,
        });
        try {
          this.form.querySelector(`[name="${i}"]`).focus()
        } catch (error) { }
        throw e
      }

    }

    submit = () => {
      this.validate()
      this.props.onSubmit && this.props.onSubmit()
    }

    getrecapcha = () => {

      return (new Promise((resolve, reject) => {
        if (this.state.checkRecapcha) {
          this.setState({
            checkRecapcha: false,
          });

          setTimeout(e => {
            this.setState({
              checkRecapcha: true,
            })
            this.capcharesolve = resolve
            this.capchareject = reject
          }, 500)

        } else {
          this.setState({
            checkRecapcha: true,
          })
          this.capcharesolve = resolve
          this.capchareject = reject
        }
      }).then(e => {
        // this.setState({checkRecapcha : false})
        return e;
      }).catch(e => {
        this.setState({ checkRecapcha: false })
        throw e;
      })
      )
    }
    reset = () => {
      var newState = {}
      for (var i in this.state)
        newState[i] = null;
      this.setState(newState)
    }

    render() {
      return <BaseComponent
        {...this.props}
        formfield={this.field}
        values={this.state}
        formref={this.formref}
        formgetter={this.formgetter}
        submit={this.submit}
        reset={this.reset}
        validate={this.validate}
        getrecapcha={this.getrecapcha}
        invisibleCapcha={
          this.state.checkRecapcha && <Recapcha
            key="invisiblecapcha"
            {...this.field("capcha")}
            delay={0}
            onExpireCapcha={this.onCapchaRemoved}
            onNewCapcha={this.onCapchaResolved}
            invisible />
        }
        handleError={this.handleError}
        handleToggle={this.handleToggle}
        updateWhoteState={this.updateWhoteState}
      />
    }

    onCapchaResolved = (e) => {
      this.capcharesolve && this.capcharesolve(e)
    }
    onCapchaRemoved = (e) => {
      this.capchareject && this.capchareject(e)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    WithForm.displayName = wrapDisplayName(BaseComponent, 'withForm');
  }

  return WithForm;
}

export default withForm;
