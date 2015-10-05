/**
 * HGV Depencency checker
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var assert = require( 'chai' ).assert,
	events = require( 'events' ),
	util = require( 'util' ),
	proxyquire = require( 'proxyquire' ).noCallThru();

/**
 * Set up mocks
 */
function Exec() {}
Exec.prototype = new events.EventEmitter;

// Vagrant return array
var returnArray = [];

var myExec = function( command, callback ) {
	var emitter = new Exec();

	switch( command ) {
		case 'no_such_version':
			callback.apply( null, [ true, undefined ] );
			break;
		case 'outdated_version':
			callback.apply( null, [ false, '1.0.0' ] );
			break;
		case 'valid_version':
			callback.apply( null, [ false, '2.0.0' ] );
			break;
		case 'vagrant plugin list':
			callback.apply( null, returnArray );
			break;
	}

	setTimeout( function() { emitter.emit( 'close' ); }, 10 );

	return emitter;
};

var Checker = proxyquire( '../lib/components/checker', {
	child_process: {
		exec: myExec
	}
} );

describe( 'Checker', function() {
	describe( 'CLI', function() {
		it( 'errors if no installation', function( done ) {
			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.cli( 'Git', '2.0.0', 'no_such_version' ).then( function() {

				// Verify
				assert.notEqual( '', message );
				assert.include( message, 'No installation of Git is detected!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} );
		} );

		it( 'errors on outdated installation', function( done ) {
			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.cli( 'Git', '2.0.0', 'outdated_version' ).then( function() {

				// Verify
				assert.notEqual( '', message );
				assert.include( message, 'Git' );
				assert.include( message, 'v1.0.0' );
				assert.include( message, 'is installed. You need at least' );
				assert.include( message, 'v2.0.0' );

				// Reset
				process.stdout.write = stdout;

				done();
			} );
		} );

		it( 'succeeds with proper install', function( done ) {
			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.cli( 'Git', '2.0.0', 'valid_version' ).then( function() {

				// Verify
				assert.notEqual( '', message );
				assert.include( message, 'Git' );
				assert.include( message, 'v2.0.0' );
				assert.include( message, 'looks good!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} );
		} );
	} );

	describe.skip( 'Vagrant', function() {
		it( 'errors if no Vagrant plugins', function( done ) {
			returnArray = [true, undefined];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost' ).then( function() {

				// Verify
				assert.notEqual( '', message );
				assert.include( message, 'Unable to detect any Vagrant plugins.' );

				// Reset
				process.stdout.write = stdout;

				done();
			} );
		} );

		it( 'errors if no plugin installation', function() {
			returnArray = [false, ''];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost' ).then( function() {

				// Verify
				assert.notEqual( '', message );
				assert.include( message, 'Vagrant Ghost' );
				assert.include( message, 'plugin (recommended) was not detected!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} );
		} );

		it( 'errors if outdated plugin installation', function() {
			returnArray = [false, 'vagrant-ghost (0.2.0)'];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost', function() { return '0.2.0'; } ).then( function() {

				// Verify
				assert.notEqual( '', message );
				assert.include( message, 'Vagrant Ghost' );
				assert.include( message, 'v0.2.0' );
				assert.include( message, 'is installed. You need at least' );
				assert.include( message, 'v0.2.1' );

				// Reset
				process.stdout.write = stdout;

				done();
			} );
		} );

		it( 'succeeds with proper plugin install', function() {
			returnArray = [false, 'vagrant-ghost (0.2.1)'];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost', function() { return '0.2.1'; } ).then( function() {

				// Verify
				assert.notEqual( '', message );
				assert.include( message, 'Vagrant Ghost' );
				assert.include( message, 'v0.2.1' );
				assert.include( message, 'looks good!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} );
		} );
	} );
} );