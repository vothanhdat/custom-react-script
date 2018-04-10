
import React from 'react'
import { bind, memoize } from 'lodash-decorators'
import { isEqual } from 'lodash'

export default function withHiPerfomanceForm(Component) {

  const SpecSym = Symbol('update')

  const SpecFun = function (func) {
    func[SpecSym] = true
    return func
  }

  const Context = React.createContext({})

  const getObserKeys = function (props) {
    var keys = []
    for (var i in props) {
      var z = props[i];
      if (z && z[SpecSym])
        keys.push(i)
    }
    return keys;
  }

  const getObserProps = function (props, obserKeys) {
    var ob = {}
    for (var i in obserKeys) {
      var e = obserKeys[i];
      ob[e] = props[e]();
    }
    return ob;
  }

  class ChildRender extends React.PureComponent {

    render() {
      const obserKeys = getObserKeys(this.props)
      return <Context.Consumer>
        {(registerUpdate) => {
          return <ChildShalowUpdate {...this.props} registerUpdate={registerUpdate} obskeys={obserKeys} />
        }}
      </Context.Consumer>
    }
  }

  class ChildShalowUpdate extends React.Component {

    componentDidMount() {
      this._sub = this.props.registerUpdate(this.onUpdate)
    }

    componentWillUnmount() {
      this._sub();
    }

    constructor(props) {
      super(props)
      this.state = getObserProps(props, props.obskeys)
    }

    @bind()
    onUpdate() {
      var newOB = getObserProps(this.props, this.props.obskeys);
      var state = this.state
      if (this.props.obskeys.some(e => newOB[e] != state[e]))
        this.setState(newOB)
    }

    render() {
      const { obskeys, registerUpdate, Com, ...rest } = this.props
      return <Com {...rest} {...this.state} />
    }
  }


  return class extends React.Component {
    static defaultProps = {
      data: {},
      values: {},
    }

    @bind()
    @memoize()
    formfield(fieldname) {
      var { required, name, onChange, onBlur } = this.props.formfield(fieldname);

      return {
        required, name, onChange, onBlur,
        value: SpecFun(() => this.props.values[name] || ""),
        error: SpecFun(() => this.props.values[`${name}:error`] || false),
        helperText: SpecFun(() => this.props.values[`${name}:helptext`] || ""),
      }
    }

    values = new Proxy(
      Object.assign(SpecFun(() => this.props.values), this.props.values),
      { get: (target, key) => { return SpecFun(() => this.props.values[key]) } }
    )


    data = new Proxy(
      Object.assign(SpecFun(() => this.props.data), this.props.data),
      { get: (target, key) => { return SpecFun(() => (this.props.data || {})[key]) } }
    )

    updateArray = []

    registerUpdate = (e) => {
      this.updateArray.push(e)
      return () => {
        var idx = this.updateArray.findIndex(e)
        this.updateArray.splice(e, 1)
      }
    }

    componentDidUpdate(oldProps) {
      console.time('depthCheck')
      console.log(isEqual(oldProps.values, this.props.values))
      console.timeEnd('depthCheck')
      console.time('updateArray')
      this.updateArray.forEach(e => e())
      console.timeEnd('updateArray')

    }

    render() {
      return <Context.Provider value={this.registerUpdate}>
        <Component
          {...this.props}
          formfield={this.formfield}
          values={this.values}
          data={this.data}
          Field={ChildRender}
          Obser={SpecFun}
        />
      </Context.Provider>
    }
  }

}
