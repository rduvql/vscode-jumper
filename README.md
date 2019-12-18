# jumper Extention for vscode

## Feature Overview

Jumper provides fast cursor movement to non-empty lines of code

It also gives the ability to move the cursor direcly to errors in document

![alt](https://raw.githubusercontent.com/rduvql/vscode-jumper/master/images/demo.gif)

## Commands

This extension contributes the following commands:

* `ext.jumper.focusPrevious`: jup to the previous (above cursor) non-empty line
* `ext.jumper.focusNext`: jump to the next (below cursor) non-empty line
* `ext.jumper.focusPreviousError`: jump to the previous (above cursor) error in current document
* `ext.jumper.focusNextError`: jump to the next (below cursor) error in current document

Configuration example (Keyboard Shortcuts):
```json
    {
        "key": "ctrl+up",
        "command": "ext.jumper.focusPrevious",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+down",
        "command": "ext.jumper.focusNext",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+up",
        "command": "ext.jumper.focusPreviousError",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+down",
        "command": "ext.jumper.focusNextError",
        "when": "editorTextFocus"
    }
```

## Known Issues

Does not work with html, xml or any markup language

## Sources

https://github.com/rduvql/vscode-jumper

## Release Notes

### 1.1.1

fix focusPreviousEror / focusNextEror when document index !== 0

### 1.1.0

New feature: can now focus next / previous error in current document

- jumper: focus previous error : ext.jumper.focusPreviousError
- jumper: focus next error : ext.jumper.focusNextError

### 1.0.1

fix error that prevented going to the first line

### 1.0.0

Initial release of jumper

## Contributors

[@md2perpe](https://github.com/md2perpe)
