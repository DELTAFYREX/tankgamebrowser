import { lstatSync, existsSync, createReadStream } from 'fs';
import { join } from 'path';

let publicRoot = join(__dirname, "./public"),
    mimeSet = {
        "js": "application/javascript",
        "json": "application/json",
        "css": "text/css",
        "html": "text/html",
        "md": "text/markdown",
        "png": "image/png",
        "ico": "image/x-icon",
        "ttf": "font/ttf"
    },
    defaultFile = 'index.html',
    port = 8080,

toDefaultIfFileDoesNotExist = (fileToGet, root) => {
    if (!existsSync(fileToGet)) {
        fileToGet += '.html';
        if (!existsSync(fileToGet)) {
            fileToGet = join(publicRoot, defaultFile);
        }
    } else if (!lstatSync(fileToGet).isFile()) {
        fileToGet = join(publicRoot, defaultFile);
    }
    return fileToGet;
};


let server = require('http').createServer((req, res) => {
    let fileToGet = join(publicRoot, req.url);

    //if this file does not exist, return the default;
    fileToGet = toDefaultIfFileDoesNotExist(fileToGet);

    res.writeHead(200, {
        // If we have no idea what the mine type is of that, just assume it is a html file.
        'Content-Type': mimeSet[ fileToGet.split('.').pop() ] || 'text/html'
    });
    return createReadStream(fileToGet).pipe(res);
});

server.listen(port, () => console.log("Server listening on port", port));