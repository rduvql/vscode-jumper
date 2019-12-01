# jumper Extention for vscode

## Feature Overview

jumper provide fast cursor movement to non-empty lines of code

![alt](https://raw.githubusercontent.com/rduvql/vscode-jumper/master/images/demo.gif)

## Commands

This extension contributes the following commands:

* `ext.jumper.next`: jump to the next non-empty line (below) cursor
* `ext.jumper.previous`: jup to the previous non-empty line (above) cursor

Configuration example (Keyboard Shortcuts):
```json
    {
        "key": "ctrl+up",
        "command": "ext.jumper.previous",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+down",
        "command": "ext.jumper.next",
        "when": "editorTextFocus"
    },
```

## Known Issues

Does not work with html, xml or any markup language

## Sources

https://github.com/rduvql/vscode-jumper

## Release Notes

### 1.0.1

fix error that prevented going to the first line

### 1.0.0

Initial release of jumper

## Contributors

[@md2perpe](https://github.com/md2perpe)
