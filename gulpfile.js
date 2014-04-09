var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	beautify = require('gulp-beautify'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	qunit = require('gulp-qunit');

gulp.task('build', function() {
	gulp.src([
		'js/src/libs/jquery/jquery-2.1.0.js', 
		'js/src/libs/champion/champion.min.js', 
		'js/src/views/PriceView.js', 
		'js/src/presenters/PricePresenter.js', 
		'js/src/models/PriceModel.js',
		'js/src/services/PriceProvider.js',
		'js/src/contentScript.js'
	])
	.pipe(concat('contentScript.js'))
	.pipe(gulp.dest('js/build'));

	gulp.src([
		'js/src/libs/jquery/jquery-2.1.0.js',
		'js/src/libs/bootstrap/bootstrap.min.js',
		'js/src/libs/champion/champion.min.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('js/build/'));

	gulp.src([
		'js/src/partials/popup.intro.js',

		'js/src/views/PopupMainView.js',
		'js/src/views/PopupFooterView.js',
		'js/src/views/PopupAboutView.js',
		'js/src/views/PopupHeaderView.js',

		'js/src/presenters/PopupMainPresenter.js',
		'js/src/presenters/PopupFooterPresenter.js',
		'js/src/presenters/PopupAboutPresenter.js',
		'js/src/presenters/PopupHeaderPresenter.js',

		'js/src/models/PopupModel.js',
		'js/src/models/PopupHeaderModel.js',

		'js/src/services/RepositoryBase.js',
		'js/src/services/SettingsRepository.js',

		'js/src/services/ManifestProvider.js',

		'js/src/services/CommandBus.js',
    'js/src/commands/UpdatePricesCommand.js',
    'js/src/commands/NotifyCSCommand.js',
		'js/src/commands/NotifyBackgroundCommand.js',

    'js/src/commandHandlers/UpdatePricesCommandHandler.js',
    'js/src/commandHandlers/NotifyCSCommandHandler.js',
		'js/src/commandHandlers/NotifyBackgroundCommandHandler.js',

		'js/src/bootstrappers/popup.bootstrap.js',
		'js/src/popup.js',

		'js/src/partials/popup.outro.js'
	])
	.pipe(concat('popup.js', { newLine: '\n\r\n\r' }))
	.pipe(beautify({ indentChar: '\t', indentSize: 1 }))
	.pipe(gulp.dest('js/build/'))
	.pipe(uglify({ mangle: false }))
	.pipe(rename('popup.min.js'))
	.pipe(gulp.dest('js/build/'));

	gulp.src([
    'js/src/libs/jquery/jquery-2.1.0.js',
    'js/src/libs/champion/champion.min.js',

    'js/src/partials/background.intro.js',

		'js/src/services/RepositoryBase.js',
		'js/src/services/SettingsRepository.js',

    'js/src/services/CommandBus.js',
    'js/src/commands/UpdatePricesCommand.js',
    'js/src/commands/NotifyCSCommand.js',
    'js/src/commands/NotifyBackgroundCommand.js',

    'js/src/commandHandlers/UpdatePricesCommandHandler.js',
    'js/src/commandHandlers/NotifyCSCommandHandler.js',
    'js/src/commandHandlers/NotifyBackgroundCommandHandler.js',

    'js/src/bootstrappers/background.bootstrap.js',
		'js/src/background.js',

    'js/src/partials/background.outro.js'
	])
	.pipe(concat('background.js', { newLine: '\n\r\n\r' }))
  .pipe(beautify({ indentChar: '\t', indentSize: 1 }))
	.pipe(gulp.dest('js/build/'));
});

gulp.task('test', function() {
	gulp.src('test/_SpecRunner.html')
		.pipe(qunit());
});

gulp.task('dev', function() {
	var watcher = gulp.watch('**/*.js', ['test']);

	watcher.on('change', function(e) {
		gutil.log('File changed ' + gutil.colors.magenta(e.path));
	});
});