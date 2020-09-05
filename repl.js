let s = "    moveToLine( startPos.line, startPos.character, endPos && endPos.line, endPos && endPos.character );"

let split = s.split(/[. , {}():\[\]]/)

split

let indexes = split.filter(v => /[a-zA-Z0-9$]/.test(v)).map((v, i, arr) => {

    v

    if(v) {
        if(i === 0) {
            return {a: 0, b: v.length}
        } else {
            let subIndex = s.indexOf(v, arr.slice(0, i).join(' '))
            subIndex
            subIndex + v.length
            return {a: subIndex, b: subIndex + v.length}
        }
    } else {
        return {}
    }

}).filter(v => Object.keys(v).length > 0)

indexes

indexes.forEach(e => {
    let a = s.substring(e.a, e.b)
    a
})
