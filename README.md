# jumper Extention for vscode

## Feature Overview

Jumper provides fast cursor movement to non-empty lines of code

![alt](https://raw.githubusercontent.com/rduvql/vscode-jumper/master/images/demo_focus.gif)

It also gives the ability to move the cursor directly to errors in document

![alt](https://raw.githubusercontent.com/rduvql/vscode-jumper/master/images/demo_focus_error.gif)

Also, a new way of navigating between words in current line that ignore most of the punctuation, improving overall navigation speed
(does not depends on `editor.wordSeparators`, because modifying this alters too many vscode feature)

Before:
![alt](https://raw.githubusercontent.com/rduvql/vscode-jumper/master/images/demo_focus_word_native.gif)

After:
![alt](https://raw.githubusercontent.com/rduvql/vscode-jumper/master/images/demo_focus_word_ext.gif)

## Commands

This extension contributes the following commands:

* `ext.jumper.focusPrevious`: jup to the previous (above cursor) non-empty line
* `ext.jumper.focusNext`: jump to the next (below cursor) non-empty line
* `ext.jumper.focusPreviousError`: jump to the previous (above cursor) error in current document
* `ext.jumper.focusNextError`: jump to the next (below cursor) error in current document
* `ext.jumper.focusNextWordInLine`: jump to the previous (before cursor) word in current line
* `ext.jumper.focusPreviousWordInLine`: jump to the next (after cursor) word in current line

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
    },
    {
        "key": "ctrl+left",
        "command": "ext.jumper.focusPreviousWordInLine",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+right",
        "command": "ext.jumper.focusNextWordInLine",
        "when": "editorTextFocus"
    }
```

## Known Issues

~~Navigating across lines in markup languages not supported yet.~~

=> A new fallback regexp was added in an attempt to solve this, can behave weirdly if document is weirdly formatted.

## Sources

https://github.com/rduvql/vscode-jumper

## Release Notes

### 1.2.0

New commands:
- `ext.jumper.focusNextWordInLine` : select previous word in current line
- `ext.jumper.focusNextWordInLine` : select next word in current line

Changes:
- `ext.jumper.focusPreviousError` and `ext.jump.focusNextError` now focus only `DiagnosticSeverity.Warning` and `DiagnosticSeverity.Error`
(previously all diagnostics where taken into accounts, slowing down navigation)
- `ext.jumper.focusPrevious` and `ext.jumper.focusNext` improvements for markdown style document

### 1.1.1

Fix focusPreviousError / focusNextError when document index !== 0

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
