const http  = require('http')
const path  = require('path')
const fs    = require('fs')

/**
 * The port to start server on
 */
const PORT = 1234

/**
 * Sets proper Content-Type for file extensions
 */
const extensions = {
    '.manifest' : 'text/cache-manifest',
    '.html'     : 'text/html',
    '.css'      : 'text/css',

    '.png'      : 'image/png',
    '.jpg'      : 'image/jpg',
    '.svg'      : 'image/svg+xml',

    '.js'       : 'application/x-javascript',
    '.xml'      : 'application/xml',
    '.json'     : 'application/json'
}

/**
 * Returns the suitable Content-Type
 * for the given URL
 */
function mapExtension(url) {
    return extensions[path.extname(url)] || 'text/html' // 'application/octet-stream'
}

/**
 * Analyzes different forms of urls to
 * provide a propper file
 */
function mapUrl(url) {
    if (url == '/')
        return 'index.html'
    return url
}

// initialize a server
const server = http.createServer((request, response) => {
    const url = mapUrl(request.url)
    const file = path.join(__dirname, url)

    console.log('<== ' + request.url + ` ==> ${url}`)

    try {
        const stat = fs.statSync(file)

        response.writeHead(200, {
            'Content-Type': mapExtension(url),
            'Content-Length': stat.size
        })

        const stream = fs.createReadStream(file)
            .on('error', error => {
                console.log('> Dismissed')
                response.end('This is not a file!')
            })
            .pipe(response)
    }

    // file not found
    catch (e) {
        console.log('> Dismissed')
        response.end('Sory (')
    }
})

// start a server
server.listen(PORT, error => {
    if (error)
        return console.log('> Something bad happened', error)

    console.log(`> Server is listening on ${PORT}`)
})