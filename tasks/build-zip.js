const gulp = require('gulp'),
	fs = require('fs'),
	plugins = require('gulp-load-plugins')(),
	theme = 'anima'

// -----------------------------------------------------------------------------
// Create the theme installer archive and delete the build folder
// -----------------------------------------------------------------------------
function makeZip() {
	// get theme version from the stylesheet
	const contents = fs.readFileSync('./style.css', 'utf8')

	// split it by lines
	const lines = contents.split(/[\r\n]/)

	function checkIfVersionLine(value, index, ar) {
		const myRegEx = /^[\s\*]*[Vv]ersion:/
		if (myRegEx.test(value)) {
			return true;
		}
		return false;
	}

	// apply the filter
	const versionLine = lines.filter(checkIfVersionLine)

	let versionString = versionLine[0].replace(/^[\s\*]*[Vv]ersion:/, '').trim();
	versionString = '-' + versionString.replace(/\./g, '-');

	return gulp.src('./')
	           .pipe( plugins.exec('cd ./../; rm -rf ' + theme[0].toUpperCase() + theme.slice(1) + '*.zip; cd ./build/; zip -r -X ./../' + theme[0].toUpperCase() + theme.slice(1) + versionString + '.zip ./; cd ./../; rm -rf build'));
}
makeZip.description = 'Create the theme installer archive and delete the build folder';
gulp.task( 'build:zip', makeZip );
