var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	qunit = require('gulp-qunit');

gulp.task('build', function() {
	gulp.src([
			'js/src/libs/jquery/jquery-2.1.0.js', 
			'js/src/libs/champion/champion.min.js', 
			'js/src/views/PriceView.js', 
			'js/src/presenters/PricePresenter.js', 
			'js/src/models/PriceModel.js',
			'js/src/services/PriceProvider.js',
			'js/src/app.js'
		])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('js/build'));

	gulp.src([
		'js/src/libs/jquery/jquery-2.1.0.js',
		'js/src/libs/bootstrap/bootstrap.min.js',
		'js/src/libs/champion/champion.min.js', 
		'js/src/views/PopupView.js',
		'js/src/views/PopupFooterView.js',
		'js/src/views/PopupAboutView.js',
		'js/src/views/PopupHeaderView.js',
		'js/src/presenters/PopupPresenter.js',
		'js/src/presenters/PopupFooterPresenter.js',
		'js/src/presenters/PopupAboutPresenter.js',
		'js/src/presenters/PopupHeaderPresenter.js',
		'js/src/models/PopupModel.js',
		'js/src/services/SettingsRepository.js',
		'js/src/services/ManifestProvider.js',
		'js/src/popup.js'
		])
		.pipe(concat('popup.js'))
		.pipe(gulp.dest('js/build/'));

	gulp.src('js/src/bootstrap.js').pipe(gulp.dest('js/build/'));
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