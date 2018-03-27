// process.env.NODE_ENV = 'test';

// import * as mocha from 'mocha';
// import * as chai from 'chai';
// import app from '../../src/App';

// let reRequire = function (module) {
//   delete require.cache[require.resolve(module)]
//   return require(module)
// }
// let should = reRequire('chai').should() // actually call the function
// let expect = reRequire('chai').expect
// let path = require('path')

// // const knex = require('../../src/db/connection');

// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);

// describe('********* routes : api root *********', () => {

//   beforeEach(() => {

//   });

//   afterEach(() => {

//   });
// 	it('responds to /', function (done) {
//     chai.request(app)
//     .get('/')
//     .end(function(res){
//     	done()
//     })

//   })

//   it('responds to /generate_qr/ and qr image is actually generated', function (done) {
//     reRequire('fs').accessSync(path.join(__dirname, '/../../qr'), reRequire('fs').W_OK, function (err) {
//       should.not.exist(err)
//     })

//     let filename = +new Date()
//     chai.request(app)
//       .get('/generate_qr/' + filename)
//       .end(function (res) {
//         should.exist(res.headers.location)
//         reRequire('fs').accessSync(path.join(__dirname, '/../..'), reRequire('fs').W_OK, function (err) {
//           should.not.exist(err)
//         })
//       })
//   })

//   it('404 everything else', function (done) {
//     chai.request(app)
//     .get('/foo/bar')
//     .end(function(res){ done() })
//   })

//   it('404 everything else', function (done) {
//     chai.request(app)
//       .get('/foobar')
//       .end(function(res){done()})
//   })
// });


// //   it('responds to /', function (done) {
// //     request(server)
// //             .get('/')
// //             .expect('Cashier-BTC reporting for duty')
// //             .expect(200, done)
// //   })

// //   it('responds to /generate_qr/ and qr image is actually generated', function (done) {
// //     reRequire('fs').accessSync(path.join(__dirname, '/../../qr'), reRequire('fs').W_OK, function (err) {
// //       should.not.exist(err)
// //     })

// //     let filename = +new Date()
// //     request(server)
// //       .get('/generate_qr/' + filename)
// //       .expect(function (res) {
// //         should.exist(res.headers.location)
// //         reRequire('fs').accessSync(path.join(__dirname, '/../..'), reRequire('fs').W_OK, function (err) {
// //           should.not.exist(err)
// //         })
// //       })
// //       .expect(301, done)
// //   })

// //   it('404 everything else', function (done) {
// //     request(server)
// //             .get('/foo/bar')
// //             .expect(404, done)
// //   })

// //   it('404 everything else', function (done) {
// //     request(server)
// //             .get('/foobar')
// //             .expect(404, done)
// //   })
// // })
