const { src,dest,watch,series } = require('gulp');
const less = require('gulp-less')
const image = require('gulp-image')
const del = require('del')
const svgSprite = require('gulp-svg-sprites')
const cssmin = require('gulp-cssmin')
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 3 versions'] });

//compile styles
function styles(cb) {
    return src('./src/styles/main.less')
        .pipe(less({plugins: [autoprefix]}))
        .pipe(cssmin())
        .pipe(dest('./src/css'))
    cb();
}

//symobl's vector sprite
function svg(cb) {
    return src('./src/images/svg/*.svg')
    .pipe(svgSprite({
        mode: 'symbols',
        svg: {
            svgPath: "../svg/svg/%f"
        }
    }))
    .pipe(dest("./src/svg"));
    cb();
}

const clean = async () => {
    return del.sync(['./public/']);
}

const compressImages = async () => {
    return src(
            [
                './src/images/examples/**/*',
                './src/images/plugs/**/*',
                './src/images/*.jpg',
                './src/images/*.png',
                './src/images/*.jpeg'
            ],
            {base: './src/images'}
        )
        .pipe(image())
        .pipe(dest('./public/images'));
};

const copySVG = async () => {
    return src('./src/images/svg/**/*')
        .pipe(dest('./public/images/svg'));
}

const copyAll = async () => {
    return src(
        [
            './src/css/**/*',
            './src/scripts/**/*',
            './src/fonts/**/*',
            './src/svg/**/*',
            './src/popups/**/*',
            './src/*.html',
            './src/.htaccess',
        ],
        {base: './src'}
    )
    .pipe(dest('./public'));
}


exports.default = function() {
    watch('./src/styles/**/*.less', styles);
    watch('./src/images/svg/*.svg', svg);
};

const buildSeries = series(clean,compressImages,copySVG,copyAll)
exports.build = buildSeries;
