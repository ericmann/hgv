/**
 * Script Utilities for WPEngine's HGV
 *
 * @author WPEngine
 */

'use strict';

/**
 * Dependencies
 */
var gulp = require( 'gulp' ),
	path = require( 'path' ),
	eslint = require( 'gulp-eslint' ),
	excludeGitignore = require( 'gulp-exclude-gitignore' ),
	mocha = require( 'gulp-mocha' ),
	istanbul = require( 'gulp-istanbul' ),
	gulpIgnore = require( 'gulp-ignore' ),
	nsp = require( 'gulp-nsp' ),
	plumber = require( 'gulp-plumber' );

/**
 * I'm lazy and don't want to run the gulpfile through eslint ...
 */
function excludeGulpfile() {
	var gulpFile = path.resolve( 'gulpfile.js' );

	return gulpIgnore.exclude( [gulpFile] );
}

gulp.task( 'static', function() {
	process.env.TEST = true;

	return gulp.src( 'script/**/*.js' )
		.pipe( excludeGitignore() )
		.pipe( excludeGulpfile() )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() );
} );

gulp.task( 'nsp', function( cb ) {
	nsp( 'package.json', cb );
} );

gulp.task( 'pre-test', function() {
	return gulp.src( 'script/lib/**/*.js' )
		.pipe( istanbul( {includeUntested: true} ) )
		.pipe( istanbul.hookRequire() );
} );

gulp.task( 'test', ['pre-test'], function( cb ) {
	var mochaErr;

	gulp.src( 'script/test/**/*.js' )
		.pipe( plumber() )
		.pipe( mocha( {reporter: 'spec'} ) )
		.on( 'error', function( err ) {
			mochaErr = err;
		} )
		.pipe( istanbul.writeReports() )
		.on( 'end', function() {
			cb( mochaErr );
		} );
} );

gulp.task( 'prepublish', ['nsp'] );
gulp.task( 'default', ['static', 'test'] );