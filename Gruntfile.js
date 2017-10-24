module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify:{
            build:{
                src:"public/javascript/*.js",
                dest:"public/build/profile.min.js"
            }
        },
        cssmin:{
            target:{
                src:"public/css/*.css",
                dest:"public/build/styles.min.css"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default",['uglify','cssmin']);
};