
import React from 'react'
import { bind, memoize } from 'lodash-decorators'
import { isEqual } from 'lodash'


const isNativeProxy = (function () {
  var o = new Proxy({}, {
    get(target, key) {
      return true;
    }
  })
  return (o['111'] && o['222'] && o[Math.random()])
})()

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
      this.Component = props.Com
    }

    @bind()
    onUpdate() {
      var newOB = getObserProps(this.props, this.props.obskeys);
      var state = this.state
      if (this.props.obskeys.some(e => newOB[e] != state[e]))
        this.setState(newOB)
    }

    getCompnent() {
      return this.props.pure ? this.Component : this.props.Com
    }

    render() {
      const { obskeys, registerUpdate, Com, ...rest } = this.props
      const Component = this.getCompnent()
      return <Component {...rest} {...this.state} />
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



    updateArray = []

    registerUpdate = (e) => {
      this.updateArray.push(e)
      return () => {
        var idx = this.updateArray.findIndex(e)
        this.updateArray.splice(e, 1)
      }
    }

    componentDidUpdate(oldProps) {
      // console.time('updateArray')
      this.updateArray.forEach(e => e())
      // console.timeEnd('updateArray')
    }

    updateId = Math.random()

    _values = {}
    values = isNativeProxy
      ? new Proxy(
        Object.assign(SpecFun(() => this.props.values), this.props.values),
        {
          get: (target, key) => {
            return this._values[key]
              || (this._values[key] = SpecFun(() => this.props.values[key]))
          }
        }
      ) : Object.assign(SpecFun(() => this.props.values), this.props.values)

    preceddValues() {
      var update = false;
      for (var i in this.props.values) {
        if (!(i in this.values)) {
          let key = i;
          update || (update = true);
          this.values[i] = SpecFun(() => this.props.values[key]);
        }
      }
      if (update) this.updateId = Math.random()
    }

    _data = {}
    data = isNativeProxy
      ? new Proxy(
        Object.assign(SpecFun(() => this.props.data), this.props.data),
        {
          get: (target, key) => {
            return this._data[key]
              || (this._data[key] = SpecFun(() => this.props.data[key]))
          }
        }
      ) : Object.assign(SpecFun(() => this.props.data), this.props.data)

    preceddDatas() {
      var update = false;
      for (var i in this.props.data) {
        if (!(i in this.data)) {
          let key = i;
          update || (update = true);
          this.data[i] = SpecFun(() => this.props.data[key])
        }
      }
      if (update) this.updateId = Math.random()
    }

    render() {
      if (!isNativeProxy) {
        console.time('Preceed')
        this.preceddValues();
        this.preceddDatas();
        console.timeEnd('Preceed')
      }

      return <Context.Provider value={this.registerUpdate}>
        <Component
          {...this.props}
          formfield={this.formfield}
          values={this.values}
          data={this.data}
          Field={ChildRender}
          Obser={SpecFun}
          updateId={this.updateId}
        />
      </Context.Provider>
    }
  }

}
