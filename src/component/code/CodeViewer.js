import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
// Import language modes
// @ts-ignore
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';


const CodeViewer = ({ code, language }) => {
    const getMode = (language) => {
        switch (language.toLowerCase()) {
            case 'react':
            case 'javascript':
                return 'javascript({ jsx: true })';
                // return 'javascript';
            case 'python':
                return 'python';
            case '.net':
            case 'csharp':
                return 'text/x-csharp';
            default:
                return '';
        }
    };

    return (
        <div style={{ width: "1000px" }}>
            <CodeMirror
                value={code}
                height="100px"
                options={{
                    mode: getMode(language),
                    theme: 'material',
                    lineNumbers: true,
                    lineWrapping: true,
                    readOnly: true,
                }}
            // onBeforeChange={(editor, data, value) => {}}
            />
        </div>
    );
};

export default CodeViewer;
