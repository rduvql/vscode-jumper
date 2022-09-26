import * as vscode from "vscode";

interface Range {
    start: number;
    end: number;
}

export const jumperCommands = (() => {

    let context: vscode.ExtensionContext;

    function registerCommands(ctx: vscode.ExtensionContext) {
        context = ctx;

        const registerDisposableCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
            let disposable = vscode.commands.registerCommand(command, callback, thisArg);
            context.subscriptions.push(disposable);
        };

        registerDisposableCommand("ext.jumper.focusPrevious", () => {
            let prevNext = getNextAndPreviousLine(/^[a-zA-Z0-9]{2,}/);
            prevNext = prevNext.previous ? prevNext : getNextAndPreviousLine(/^.*[a-zA-Z0-9]{2,}.*/);
            prevNext.previous && moveToStartOfTextLine(prevNext.previous);
        });

        registerDisposableCommand("ext.jumper.focusNext", () => {
            let prevNext = getNextAndPreviousLine(/^[a-zA-Z0-9]{2,}/);
            prevNext = prevNext.next ? prevNext : getNextAndPreviousLine(/^.*[a-zA-Z0-9]{2,}.*/);
            prevNext.next && moveToStartOfTextLine(prevNext.next);
        });

        registerDisposableCommand("ext.jumper.focusPreviousError", () => {
            let prevNext = getNextAndPreviousError();
            prevNext.previous && moveToPosition(prevNext.previous.start, prevNext.previous.end);
        });

        registerDisposableCommand("ext.jumper.focusNextError", () => {
            let prevNext = getNextAndPreviousError();
            prevNext.next && moveToPosition(prevNext.next.start, prevNext.next.end);
        });

        registerDisposableCommand("ext.jumper.focusNextWordInLine", () => {
            let selection = getNextAndPreviousWordRange();
            selection?.next && moveToLine(selection.line, selection.next.start, selection.line, selection.next.end);
        });

        registerDisposableCommand("ext.jumper.focusPreviousWordInLine", () => {
            let selection = getNextAndPreviousWordRange();
            selection?.previous && moveToLine(selection.line, selection.previous.start, selection.line, selection.previous.end);
        });
    }

    return {
        registerCommands: registerCommands
    };
})();

function getNextAndPreviousLine(regexp: RegExp): { previous?: vscode.TextLine, next?: vscode.TextLine } {

    let editor = vscode.window.activeTextEditor;

    let previous: vscode.TextLine | undefined;
    let next: vscode.TextLine | undefined;

    if (editor) {
        let currLine = editor.selection.active.line;

        for (let i = currLine - 1; i >= 0; i--) {
            let line = editor.document.lineAt(i);
            if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
                previous = line;
                break;
            }
        }

        for (let i = currLine + 1; i < editor.document.lineCount; i++) {
            let line = editor.document.lineAt(i);
            if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
                next = line;
                break;
            }
        }
    }

    return {
        previous: previous,
        next: next
    };
}

function getNextAndPreviousError(): { previous?: vscode.Range, next?: vscode.Range } {

    let editor = vscode.window.activeTextEditor;

    let errorRanges: vscode.Range[] = vscode.languages.getDiagnostics()
        .filter(uriDiag => editor && uriDiag[0].path.toLowerCase() === editor.document.uri.path.toLowerCase())[0][1]
        // [0] => get first of array => current file
        // [1] => get diagnostics ([0] is uri)
        .filter(diag => [vscode.DiagnosticSeverity.Error, vscode.DiagnosticSeverity.Warning].includes(diag.severity))
        .map(diag => diag.range);

    let previous: vscode.Range | undefined;
    let next: vscode.Range | undefined;

    if (editor && errorRanges.length) {
        let currentLinePos: vscode.Position = editor.selection.active;

        errorRanges = errorRanges.sort((d1, d2) => d1.start.isBefore(d2.start) ? -1 : 1);
        for (let range of errorRanges) {
            if (range.start.isAfter(currentLinePos)) {
                next = range;
                break;
            }
        }

        errorRanges = errorRanges.sort((d1, d2) => d1.start.isBefore(d2.start) ? 1 : - 1);
        for (let range of errorRanges) {
            if (range.end.isBefore(currentLinePos)) {
                previous = range;
                break;
            }
        }
    }

    return {
        previous: previous,
        next: next
    };
}

function getNextAndPreviousWordRange(): { line: number, previous?: Range, next?: Range } | undefined {
    
    let editor = vscode.window.activeTextEditor;
    if(!editor)
        return
    
    let selection = editor.selection;
    let document = editor.document;
    let currLineNum = selection.active.line;
    let currentLine = document.lineAt(currLineNum);

    let indexes = getWordsRanges(currentLine.text.substring(currentLine.firstNonWhitespaceCharacterIndex));
    indexes = indexes.map(e => ({
        start: e.start + currentLine.firstNonWhitespaceCharacterIndex,
        end: e.end + currentLine.firstNonWhitespaceCharacterIndex
    }));

    let previousWords = indexes.filter(e => e.start <= selection.active.character).reverse().slice(1);
    let nextWords = indexes.filter(e => e.start > selection.active.character ?? false);

    return {
        line: currLineNum,
        previous: previousWords[0],
        next: nextWords[0]
    };
}

function getWordsRanges(textLine: string): Range[] {
    let indexes: Range[] = [];

    let letters = textLine.split("");

    let index = -1;
    let cpt = 0;
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        if (/[a-zA-Z0-9$]/.test(letter)) {
            if (index === -1) {
                index = i;
            }
            cpt++;
        } else {
            if (cpt !== 0) {
                indexes.push({ start: index, end: index + cpt });
                index = -1;
                cpt = 0;
            }
        }
    }

    return indexes;
}

function moveToStartOfTextLine(line: vscode.TextLine): void {
    moveToLine(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
}

function moveToPosition(startPos: vscode.Position, endPos?: vscode.Position): void {
    moveToLine(startPos.line, startPos.character, endPos && endPos.line, endPos && endPos.character);
}

function moveToLine(lineRangeStart: number, cRangeStart: number, lineRangeEnd?: number, cRangeEnd?: number): void {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        editor.selection = new vscode.Selection(
            new vscode.Position(lineRangeStart, cRangeStart),
            new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
        );

        // scroll when moving out of current range
        editor.revealRange(new vscode.Range(
            new vscode.Position(lineRangeStart, cRangeStart),
            new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
        ));
    }
}
