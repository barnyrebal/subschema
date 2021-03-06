"use strict";

import { PropTypes } from 'react';
import extend   from 'lodash/object/extend';
import find     from 'lodash/collection/find';
import map      from 'lodash/collection/map';

//we'll re-export these for convenience in the babel6 world.
const {string,bool,number,object,func, any, node,shape, arrayOf,instanceOf,oneOf, oneOfType} = PropTypes;

function customPropType(type, name) {
    function customPropType$return(...args) {
        return type.apply(api, args);
    }

    customPropType$return.isRequired = function customPropType$return$isRequired(...args) {
        return type.isRequired.apply(type, args);
    }
    if (name)
        customPropType$return.propTypeName = name;

    return customPropType$return;
}

function propTypeToName(propType) {
    const keys = Object.keys(api), l = keys.length;
    for (let i = 0; i < l; i++) {
        let key = keys[i], f = api[key];
        if (f.isRequired === propType) {
            return '*' + key;
        }
        if (f === propType) {
            return key;
        }
    }
}

function propTypesToNames(props) {
    let ret = {};
    map(props, function (v, k) {
        ret[k] = propTypeToName(v);
    });
    return ret;
}

const promise = shape({then: func});

const id = customPropType(string, 'id');

const fieldAttrs = customPropType(object, 'fieldAttrs');

const cssClass = customPropType(string, 'cssClass');

const event = customPropType(func, 'event');

const validator = customPropType(func, 'validator');

const path = customPropType(string, 'path');

const placeholder = customPropType(string, 'placeholder');

const arrayString = oneOfType([string, arrayOf(string)])


const listener = customPropType(any, 'listener');

/**
 * A valueEvent does not expect target.value
 */
const valueEvent = customPropType(func, 'valueEvent');

/**
 * A targetEvent expects the first arg to have target.value
 */
const targetEvent = customPropType(func, 'targetEvent');

/**
 * A errorEvent expects the first arg to be an error.
 */
const errorEvent = customPropType(func, 'errorEvent');

/**
 * Signify this is a blur Event Listener.
 */
const blurEvent = customPropType(func, 'blurEvent');

/**
 * Signify this is a onValid Event listener.
 */
const validEvent = customPropType(func, 'validEvent');

const dataType = customPropType(string, 'dataType');

const type = oneOfType([string, func]);

const typeDescription = shape({
    type: string.isRequired
});

/**
 * Signify this property can take an expression.  This
 * allows properties to be tied to the valueManager.  So
 * it will evaluate the property against the valueManager.
 *
 * It will add a listener for each of the corresponding
 * matching strings.
 *
 */
const expression = customPropType(string, 'expression');

const loader = shape({
    loadTemplate: func,
    loadType: func,
    loadSchema: func,
    loadValidator: func,
    loadProcessor: func,
    loadOperator: func
});

const valueManager = shape({
    addListener: func,

    addErrorListener: func,

    addValidateListener: func,

    addSubmitListener: func,

    addStateListener: func,
});

let contentShape = {
    className: cssClass,
    type: string,
    children: bool
};

let pContentShape = shape(contentShape);

let contentType = oneOfType([pContentShape, string, bool, arrayOf(oneOfType([string, pContentShape]))]);

contentShape.content = contentType;

const content = contentType;

const template = oneOfType([string, bool, shape({
    template: oneOfType([string, bool, func]),
    content: content,
    className: cssClass
}), func]);

const button = oneOfType([string, shape({
    onClick: event,
    buttonClass: cssClass,
    action: string,
    name: string,
    value: string,
    iconClass: cssClass
})]);

const buttons = oneOfType([
    button,
    arrayOf(button),
    shape({
        buttonsClass: cssClass,
        onButtonClick: event,
        buttons: oneOfType(arrayString, arrayOf(button)),
        buttonTemplate: template,
        buttonsTemplate: template
    })
]);


const fieldset = shape({
    fields: arrayString,
    legend: content,
    className: cssClass,
    buttons: buttons,
    template: template
});

const literal = oneOfType([string, bool, number, instanceOf(Date)])

const options = oneOfType([
    arrayString,
    arrayOf(shape({
        label: string,
        val: literal
    }))
]);

const optionsGroup = oneOfType([
    arrayString,
    arrayOf(shape({
        options: options,
        group: string,
        label: string,
        labelHTML: string,
        val: literal
    }))
])

const schema = oneOfType([string, shape({
    fields: arrayString,
    fieldsets: oneOfType([arrayString, fieldset, arrayOf(fieldset)]),
    schema: object,
})]);

const array = arrayOf(any);

const validators = oneOfType([arrayString, arrayOf(validators)]);

const operator = oneOfType([string, func, instanceOf(RegExp)]);

const events = {
    onValidate: event,
    onFocus: event,
    onBlur: event,
    onValid: event,
    onChange: oneOfType(targetEvent, valueEvent)
};

const field = oneOfType([string, shape({
    type: string.isRequired,
    title: string,
    name: string,
    placeholder: string,
    className: cssClass
})]);

const mixin = {
    events: events,
    field: extend({
        title: content,
        help: content,
        name: string,
        placeholder: placeholder,
        dataType: dataType,
        editorClass: cssClass,
        fieldClass: cssClass,
        field: {}
    }, events)
};

const contextTypes = Object.freeze({
    valueManager: valueManager,
    loader: loader
});


const processor = oneOfType([string, shape({
    fetch: func,
    value: func,
    format: func
})]);

const api = {
    promise,
    id,
    fieldAttrs,
    cssClass,
    event,
    validator,
    path,
    placeholder,
    arrayString,
    listener,
    valueEvent,
    targetEvent,
    blurEvent,
    validEvent,
    dataType,
    type,
    typeDescription,
    expression,
    loader,
    valueManager,
    content,
    template,
    button,
    buttons,
    fieldset,
    literal,
    options,
    optionsGroup,
    schema,
    validators,
    operator,
    events,
    field,
    mixin,
    contextTypes,
    processor,
    string, bool, number, object, func, any, node, shape, arrayOf, instanceOf, oneOfType,oneOf

};

export default
({
    propTypesToNames,
    propTypeToName,
    promise,
    id,
    fieldAttrs,
    cssClass,
    event,
    valueEvent,
    targetEvent,
    errorEvent,
    validator,
    path,
    placeholder,
    arrayString,
    listener,
    blurEvent,
    validEvent,
    dataType,
    type,
    typeDescription,
    expression,
    loader,
    valueManager,
    content,
    template,
    button,
    buttons,
    fieldset,
    literal,
    options,
    optionsGroup,
    schema,
    validators,
    operator,
    events,
    field,
    mixin,
    contextTypes,
    processor,
    array,
    string, bool, number, object, func, any, node, shape, arrayOf, instanceOf, oneOfType,oneOf
});