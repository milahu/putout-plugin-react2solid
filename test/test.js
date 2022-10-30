/*
import putout from "putout"

import putout_plugin_react2solid from "./putout-plugin-react2solid/lib/react2solid.js"
*/

const putout = require("putout")

const putout_plugin_react2solid = require("..")

const source = `
// import missing: useState
useState(0)

const div = (
    <div className="asdf"></div>
)

`;

/*
// simple
import * as React from "React"
React.useState(0)

import React, { useState } from "React"
useState(0)

import { useState } from "React"
useState(0)

const hello: string = 'world';
const hi = 'there';
console.log(hello);
*/

// putout CLI: use only one plugin https://github.com/coderaiser/putout/issues/10

const res = putout(source, {
    isTS: true,
    isJSX: true,
    //isFlow: true,
    //parser: 'babel',
    //sourceFileName: 'input.tsx',
    //sourceMapName: 'input.tsx.map',
    processors: [
        //'typescript', // @putout/processor-typescript type checking for typescript files
    ],
    plugins: [
        //'typescript', // @putout/plugin-typescript transform TypeScript code. Enabled by default for ts and tsx files.
        //'remove-unused-variables',
        // use local plugin https://github.com/coderaiser/putout/issues/62
        ['react2solid', putout_plugin_react2solid],

        //"babel/transform-react-jsx", // transform jsx with @babel/plugin-transform-react-jsx

    ],
    /*
    rules: [
        ['jsx-classname-to-class', 'on'],
    ],
    */
    rules: {
        // default: all rules on
        //'react2solid/jsx-classname-to-class': 'on',
    },
});

console.log(res.code);
