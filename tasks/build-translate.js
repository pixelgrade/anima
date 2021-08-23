const gulp = require( 'gulp' );

const wpPot = require('gulp-wp-pot');
const sort = require('gulp-sort');
const notify = require('gulp-notify');

const watchPhp = './**/*.php';
const textDomain = '__theme_txtd';
const translationDestination = './languages';
const theme = 'anima';
const translationFile = 'anima.pot'

// -----------------------------------------------------------------------------
// Generate POT file from the build folder.
// -----------------------------------------------------------------------------
function translate() {
	return gulp
	.src(watchPhp)
	.pipe(sort())
	.pipe(
		wpPot({
			domain: textDomain,
			package: theme,
			headers: false
		})
	)
	.pipe(gulp.dest(translationDestination + '/' + translationFile))
	.pipe(
			notify({
				message: '\n\n✅ build:translate — completed!\n',
				onLast: true
			})
		);
}

translate.description = 'Generate POT File and move it to languages folder';
gulp.task( 'build:translate', translate );
