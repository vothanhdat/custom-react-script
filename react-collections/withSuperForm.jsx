
import React from 'react'
import { bind, memoize } from 'lodash-decorators'
import { isEqual, memoize as Memorize } from 'lodash'


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

    constructor(props) {
      super(props);

      let { values = {}, data = {}, formfield } = props

      this.updateProps = (newProps) => {
        values = newProps.values || {};
        data = newProps.data || {};
        formfield = newProps.formfield;
      }

      this.formfield = Memorize(
        (fieldname) => {
          var { required, name, onChange, onBlur } = formfield(fieldname);
          return {
            required, name, onChange, onBlur,
            value: SpecFun(() => values[name] || ""),
            error: SpecFun(() => values[`${name}:error`] || false),
            helperText: SpecFun(() => values[`${name}:helptext`] || ""),
          }
        }
      )

      let _values = {}
      this.values = isNativeProxy
        ? new Proxy(
          Object.assign(SpecFun(() => values), values),
          { get: (_, key) => _values[key] || (_values[key] = SpecFun(() => values[key])) }
        ) : Object.assign(SpecFun(() => values), values)


      let _data = {}
      this.data = isNativeProxy
        ? new Proxy(
          Object.assign(SpecFun(() => data), data),
          { get: (_, key) => _data[key] || (_data[key] = SpecFun(() => data[key])) }
        ) : Object.assign(SpecFun(() => data), data)


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
      console.time('update')
      this.updateProps(this.props);
      this.updateArray.forEach(e => e());
      console.timeEnd('update')
      
    }

    updateId = Math.random()

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
