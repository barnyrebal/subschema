"use strict";
import React from 'react';
import PropTypes from './PropTypes';
import Template from './Template.jsx';
import {listen} from './decorators';


var { FREEZE_ARR, noop, titlelize, isRegExp,isFunction,toArray,nullCheck}  = require('./tutils');


function initValidators(v) {
    //If it has a type init it
    if (v.type) {
        var validator = this.loadValidator(v.type);
        return validator(v);
    }
    //If it is a RegExp than init ReExp
    if (isRegExp(v)) {
        return this.loadValidator('regexp')({
            regexp: v
        });
    }
    //If its a function just return it.
    if (
        isFunction(v)) {
        return v;
    }
    //otherwise lets try initing it.
    return this.loadValidator(v)();
}


export default class Editor extends React.Component {
    static contextTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    }
    static defaultProps = {
        field: {
            type: 'Text'
        },
        onValidate: noop,
        template: 'EditorTemplate'
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            hasChanged: false,
            isValid: false
        };
        this.initValidators(props, context);
    }

    setValue(value) {
        this.refs.field.setValue(value);
    }

    componentWillReceiveProps(newProps, newContext) {
        this.initValidators(newProps, newContext);
    }

    initValidators(props, context) {
        var validators = props.field.validators;
        this.validators = validators ? toArray(validators).map(initValidators, context.loader) : FREEZE_ARR;
    }

    handleValidate(value, component, e) {
        this.state.hasValidated = true;
        this.validate();
    }

    @listen("value", ".", false)
    handleChange(newValue, oldValue, name) {
        var hasChanged = newValue != oldValue;
        if (!hasChanged) {
            return;
        }
        this.state.hasChanged = true;
        var errors = this.getErrorMessages(newValue);
        if (!this.state.hasValidated) {
            if (!errors || errors.length === 0) {
                this.state.hasValidated = true;
            }
        } else {
            this.validate(newValue, errors);
        }
    }

    getValue() {
        return this.context.valueManager.path(this.props.path);
    }

    /**
     * Runs validation and updates empty fields.
     *
     */
    validate(value, errors) {
        value = arguments.length === 0 ? this.getValue() : value;
        errors = errors || this.getErrorMessages(value);

        this.context.valueManager.updateErrors(this.props.path, errors, value);
        this.setState({
            hasValidated: true
        });
        return errors;
    }

    // @listen("error")
    _validate() {
        this.validate(this.getValue());
    }

    getErrorMessages(value) {
        var vm = this.context.valueManager;

        value = arguments.length === 0 ? this.getValue() : value;
        var msgs = this.validators.map((v)=> {
            return v(value, vm);
        }).filter(nullCheck);
        return msgs;
    }


    title() {
        var field = this.props.field || {};
        if (field.title === false) {
            return null;
        }
        if (field.title != null) {
            return field.title;
        }
        //Add spaces
        return titlelize(this.props.name);
    }

    handleValid(valid) {
        this.setState({valid})
    }

    render() {
        var {field, onValueChange, template, onValidate, propsfield, conditional, onValueChange, template, onValidate, ...props} = this.props;
        var pConditional = conditional;
        var {type,fieldClass, conditional, editorClass, errorClassName, ...rfield} = field;
        conditional = conditional || pConditional;
        //err = errors, //&& errors[path] && errors[path][0] && errors[path],
        var Component = this.context.loader.loadType(type),
            title = this.title(),
            handleValidate = this.handleValidate.bind(this),
            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
        var child;
        if (Component instanceof Promise) {
            var Lazy = this.context.loader.loadType('LazyType');
            child = <Lazy ref="field" {...props} {...field} field={rfield} editorClass={editorClass}

                          onValidate={handleValidate} promise={Component}/>
        }
        else {
            child = <Component ref="field" {...props} {...field} field={rfield} editorClass={editorClass}

                               onValidate={handleValidate}/>;
        }
        if (!title) {
            title = '';
        }
        var template = this.props.template
        if (template === false || field.template === false || type === 'Hidden') {
            template = null;
        } else if (field.template != null) {
            template = field.template;
        }

        return <Template template={template} conditional={conditional} field={rfield} {...props} fieldClass={fieldClass}
                         title={title}
                         errorClassName={errorClassName}
                         help={!this.state.valid && (props.help || rfield.help)}
                         onValidate={handleValidate}
        >
            {child}
        </Template>
    }
}

module.exports = Editor;