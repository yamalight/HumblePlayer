HumblePlayer
============

HumblePlayer - music player for your HumbleBundle albums

## Tech

HumblePlayer is built using [node-webkit](https://github.com/rogerwang/node-webkit). So, you can run it on pretty much any OS (sorry, no linux binaries at the moment, please compile yourself).  
I've used [Angular](http://angularjs.org/) and [Bootstrap](http://getbootstrap.com/) for UI part as they allow for simple and rapid prototyping (and this is pretty much a prototype at the moment).

## How to build

To build the whole thing, you'll need to have node.js and npm installed. If you do have them, you'll need to install npm modules gulp (used for compilation of js, css) and grunt (used for packaging app into binaries).  
Once you have all that stuff, do following:

1. Run `gulp` to compile app js, css and templates
2. Run `node-webkit app/` and make sure everything's working
3. (optional) Make sure your target are properly set in gruntfile
4. Run `grunt` to make binaries for win and mac

## How to contribute

Open issues, leave feedback, fork, clone, do pull requests - all ways are good!
