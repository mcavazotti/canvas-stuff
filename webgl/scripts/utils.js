//copied from https://stackoverflow.com/a/14446538
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var text = null;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                text = rawFile.responseText; 
            }
        }
    }
    rawFile.send(null);
    return text;
}