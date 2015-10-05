/**
 * HGV Requirements Scanner
 *
 * @author WPEngine
 */

'use strict';

/**
 * Module dependencies
 */
var os = require( 'os' ),
	chalk = require( 'chalk' ),
	checker = require( './checker' ),
	filters = require( './filters' ),
	Promise = require( 'promise' );

/**
 * Module variables
 */
var messages = [''];

/**
 * Hyper-V users don't necessarily need VirtualBox, so let's make sure we let them know that.
 */
function windowsTest() {
	if ( /^win/.test( process.platform ) ) {
		messages.push( chalk.gray( 'You appear to be on Windows. If Hyper-V is enabled, you\'re good to go.' ) );
	}
}

/**
 * Let the user know that preflight is complete.
 */
function complete() {
	var message = [
		'',
		'HGV is finished scanning your local environment!',
		'',
		'For any further help with your environment, please view the HGV wiki',
		'on GitHub: ' + chalk.green( '<https://github.com/wpengine/hgv/wiki>' ),
		'',
		''
	].join( os.EOL );

	process.stdout.write( message );

	process.exit( 0 );
}

var init_message = [
	'',
	'HGV is scanning your local environment ...',
	''
].join( os.EOL );

/**
 * Actually run the preflight scan
 */
function run() {
	process.stdout.write( init_message );

	/**
	 * Check system compatibility
	 */
	Promise.all(
		[
			checker.cli( 'Vagrant',    '1.7.4',  'vagrant -v',           filters.vagrant ),
			checker.cli( 'VirtualBox', '4.3.20', 'VBoxManage --version', function( raw ) { return raw.trim(); }, windowsTest ),
			checker.cli( 'Node',       '0.12.7', 'node -v' ),
			checker.cli( 'Git',        '1.9.3',  'git --version',        filters.git ),
			checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost', filters.vagrant_plugin )
		] )
		.then( complete );
}

if ( undefined === process.env.TEST || ! process.env.TEST ) {
	run();
}