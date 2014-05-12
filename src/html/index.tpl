<!DOCTYPE html>
<html ng-app="humbleplayer-app">
    <head>
        <title>HumblePlayer</title>

        <link rel="stylesheet" href="dist/main.min.css">
    </head>
    <body>
        <div class="container" ng-view>
            Initializing...
        </div>

        <!-- js libraries -->
        <!-- inject:js -->
        <!-- js library files will be injected here -->
        <!-- endinject -->
        <!-- manually inster howler since it doesn't have proper bower.json file -->
        <script src="libs/howler/howler.min.js"></script>

        <!-- main app script -->
        <script src="dist/app.min.js"></script>
    </body>
</html>
