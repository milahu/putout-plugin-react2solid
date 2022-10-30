// based on node_modules/@putout/plugin-convert-array-copy-to-slice

'use strict';

const {types, operator} = require('putout');

const {
    isIdentifier,
    isCallExpression,
} = types;
const {compare} = operator;

// https://github.com/coderaiser/putout#replacer

module.exports.rules = ({
    'solid-add-imports': (
        /* based on
        https://github.com/coderaiser/putout/blob/master/packages/plugin-react-hooks/lib/declare/index.js
        */
        operator.declare((() => {
            const declarations = {};
            const names = {
                'solid-js': [
                    'createSignal',
                    'createEffect',
                    'on',
                    'batch',
                ],
                'solid-js/store': [
                    'createStore',
                ],
                // TODO more
            }
            for (const pkg in names) {
                for (const name of names[pkg]) {
                    declarations[name] = `import { ${name} } from "${pkg}"`
                }
            }
            return declarations
        })())
    ),
    'react-usestate-to-solid-createsignal': {
        report: () => `react useState should be solid createSignal`,
        match: () => ({
            'React.useState': (vars, path) => {
                //return isCallExpression(path.parentPath)
                return true
            },
            'useState': (vars, path) => {
                // TODO? check if useState is React.useState
                /*
                import { useState } from "React"
                useState(0)
                */
                //console.dir({ path, }, { depth: 5 })
                return true
            },
        }),
        replace: () => ({
            'React.useState': () => {
                return 'createSignal'
            },
            'useState': () => {
                return 'createSignal'
            },
        }),
    },
    'react-import-to-solid-import': {
        report: () => `react import should be solid import`,
        match: () => ({
            'import __a from "React"': (vars, path) => {
                //console.dir({ vars, path, }, { depth: 2 })
                return true
            },
        }),
        replace: () => ({
            'import { __a } from "React"': (vars, path) => {
                //console.dir(args, { depth: 1 })
                // all the imports ... TODO better
                // TODO https://github.com/coderaiser/putout/tree/master/packages/plugin-react-hooks/lib/declare
                return 'import {createSignal, createEffect, createStore, on, batch} from "solid-js"'
            },
            'import React, { __a } from "React"': (vars, path) => {
                //console.dir(args, { depth: 1 })
                // all the imports ... TODO better
                // TODO https://github.com/coderaiser/putout/tree/master/packages/plugin-react-hooks/lib/declare
                return 'import {createSignal, createEffect, createStore, on, batch} from "solid-js"'
            },
        }),
    },
    'jsx-classname-to-class': {
        /* based on
        https://github.com/coderaiser/putout/blob/master/packages/plugin-react-router/lib/convert-switch-to-routes/index.js
        https://github.com/coderaiser/putout/blob/master/packages/plugin-react-hooks/lib/apply-short-fragment/index.js
        */
        report: () => `Use class instead of className attribute`,
        include: () => [
            'JSXOpeningElement',
        ],
        fix: (path) => {
            const attr = path.node.attributes.find(attr => attr.name.name == "className")
            attr.name.name = "class"
            // TODO handle collisions: class attribute can exist already
        },
        filter: (path) => {
            //console.dir(path.node.attributes)
            return !!path.node.attributes.find(attr => attr.name.name == "className")
        },
    },
})
