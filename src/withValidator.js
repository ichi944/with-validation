import React, { Component } from 'react';
import Validator from 'validatorjs';

const withValidator = (options) => {
  return (WrappedComponent) => {
    return class ValidatorForm extends Component {
      constructor(props) {
        super(props);
        this.rules = options.rules;
        this.setData = options.setData;
        this.setData = this.setData.bind(this);
        this.makeValidator = this.makeValidator.bind(this);
        this.makeAllDirty = this.makeAllDirty.bind(this);
        const dirty = {};
        Object.keys(this.setData(props)).forEach((key) => {
          dirty[key] = false;
        });
        const validation = this.makeValidator();
        validation.check();
        this.state = {
          dirty,
          errors: validation.errors,
        };
      }
      componentDidUpdate(prevProps) {
        const dirty = { ...this.state.dirty };
        const prevData = this.setData(prevProps);
        const data = this.setData(this.props);

        let differentNum = 0;
        Object.keys(data).forEach((key) => {
          if (prevData[key] !== data[key]) {
            differentNum += 1;
          }
        });
        if (differentNum === 0) {
          return;
        }
        Object.keys(data).forEach((key) => {
          dirty[key] = dirty[key] || prevData[key] !== data[key];
        });
        const validation = new Validator(data, this.rules);
        validation.check();
        this.setState({
          dirty,
          errors: validation.errors,
        });
      }
      makeValidator() {
        return new Validator(this.setData(this.props), this.rules);
      }
      makeAllDirty() {
        const dirty = {};
        Object.keys(this.setData(this.props)).forEach((key) => {
          dirty[key] = true;
        });
        this.setState({ dirty });
      }
      render() {
        const props = {
          ...this.props,
          dirty: this.state.dirty,
          errors: this.state.errors,
          makeValidator: this.makeValidator,
          makeAllDirty: this.makeAllDirty,
        };
        return <WrappedComponent {...props} />;
      }
    };
  };
};

export default withValidator;
