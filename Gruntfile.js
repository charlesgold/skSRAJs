module.exports = function(grunt) {

  var cfg = {
    
  }



  // Load the plugins
  //load-grunt-tasks instead of grunt.loadNpmTasks('grunt-contrib-concat');
  //https://www.npmjs.com/package/load-grunt-tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    
    ,replace: {
      dist: {
        src: ['dist/app.htm']
        ,dest: 'dist/app.htm'
        ,replacements: [{
          from: '{{ appjs }}'
          ,to: 'app-packaged-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMMss") %>.js'
        }]
      }
    }
    ,copy: {
      dist: {
          files: [
              {
                expand: true
                ,cwd: 'app/'
                ,src: ['app.htm']
                ,dest: 'dist/'
                ,flatten: true
                ,filter: 'isFile'
              }
          ]
      }
    }
    ,concat: {
      options: {
          separator: ';'
          ,banner: '/* <%=pkg.name %> - <%=pkg.version %> */'
      }
      ,standAlone: {
          src: [
            'app/js/*.js'
          ]
          ,dest: 'shopify/<%= pkg.name %>-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMMss") %>.js'
      }
      ,dist: {
          src: [
            'vendor/jquery/dist/jquery.js'
            ,'app/js/*.js'

          ]
          ,dest: 'dist/app-packaged-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMMss") %>.js'
      }      
    }//Concat
    ,sass: {
      shopify: {        
        options: {
          style: 'compressed'
          ,lineNumbers: true
        } 
        ,files: {
          'shopify/app-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMMss") %>.css' : 'app/sass/skShippingRulesApp.scss'
        }       
      },
      dist: {
        options: {
          //style: 'compressed'
        } 
        ,files: {
          'dist/app-min.<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMMss") %>.css' : 'app/sass/skShippingRulesApp.scss'
        }         
      }
         
    }
    ,uglify: {
      
        options: {
          mangle: true
          //,compress: true
          ,footer: ''
        }
        ,shopify : {
          files : {
            'shopify/<%= pkg.name %>-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMMss") %>-min.js' : ['shopify/<%= pkg.name %>-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMMss") %>.js']
          }
        }
      
    }    
    ,clean: {
      dist: ['dist']
      ,shopify: ['shopify']
    }     

    
  }); //end of initConfig


  // Default task(s).
  grunt.registerTask('dist', ['clean:dist','copy:dist','replace:dist','concat:dist', "sass:dist"]);

  grunt.registerTask('shopify', ['clean:shopify','concat:standAlone','sass:shopify','uglify:shopify']);

};