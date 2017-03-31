process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import app from '../../src/App';

const should = chai.should();
const environment = "test";
const config = require('../../knexfile.js')[environment];
export var knex = require('knex')(config);

var util = require('util');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('********* routes : group *********', function(){
  
  this.timeout(30000);
  before(() => {

    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  after(() => {
    return knex.migrate.rollback();
  });
  //Depends on seed: User sunil, group_id 3, group : private:1
  //Should get group_id:1 (private:0) without token.
  // describe('GET /groups/{group_id}', () => {
  //   var token = "";
  //   it('should return success login with sunil and /groups/3', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'sunil@actodo.co',
  //       password: 'letmein'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       token = response.body.token;
  //       chai.request(app)
  //       .get('/api/v1/groups/3')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.success.should.eql(1);
  //         res.body.should.have.property('group');
  //         token = response.body.token;
  //         done();
  //       });
  //     });
  //   });
  //   it('should return 401 with wrong token', (done) => {
  //     chai.request(app)
  //     .get('/api/v1/groups/3')
  //     .set('authorization', 'Bearer ' + "wrong token")
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(401);
  //       res.type.should.eql('application/json');
  //       res.body.success.should.eql(0);
  //       done();
  //     });
  //   });

  //   it('GET /groups/1 should return success without token ', (done) => {
  //     chai.request(app)
  //     .get('/api/v1/groups/1')
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       res.status.should.eql(200);
  //       res.type.should.eql('application/json');
  //       res.body.should.have.property('group');
  //       res.body.success.should.eql(1);
  //       done();
  //     });
  //   });
  // });
  // describe('GET /groups/{group_id}/actions', () => {
  //   var token = "";
  //   it('should return success login with jasonh and /groups/1/actions', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'jasonh@actodo.co',
  //       password: 'letmein'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       token = response.body.token;
  //       chai.request(app)
  //       .get('/api/v1/groups/1/actions')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.success.should.eql(1);
  //         res.body.should.have.property('actions');
  //         done();
  //       });
  //     });
  //   });
  //   it('should return No permission /groups/2/actions; 2 is private group', (done) => {
  //     chai.request(app)
  //     .get('/api/v1/groups/2/actions')
  //     .set('authorization', 'Bearer ' + token)
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(403);
  //       res.type.should.eql('application/json');
  //       res.body.success.should.eql(0);
  //       done();
  //     });
  //   });

  //   it('should return Not Found /groups/226/actions; 6 is non-exist', (done) => {
  //     chai.request(app)
  //     .get('/api/v1/groups/6/actions')
  //     .set('authorization', 'Bearer ' + token)
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(404);
  //       res.type.should.eql('application/json');
  //       res.body.success.should.eql(0);
  //       done();
  //     });
  //   });

  //   it('should return success log in with erwin and /groups/2/actions', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'erwin@actodo.co',
  //       password: 'letmein'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       token = response.body.token;
  //       chai.request(app)
  //       .get('/api/v1/groups/2/actions')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.success.should.eql(1);
  //         res.body.should.have.property('actions');
  //         done();
  //       });
  //     });
  //   });
	// });
	// describe('POST /groups/{group_id}/actions', () => {
	// 	var token = "";
	// 	it('should return success login with jasonh and fails without action_type_id', (done) => {
	// 		chai.request(app)
	// 		.post('/api/v1/auth/login')
	// 		.send({
	// 			email: 'jasonh@actodo.co',
	// 			password: 'letmein'
	// 		})
	// 		.end((error, response) => {
	// 			should.not.exist(error);
	// 			token = response.body.token;
	// 			chai.request(app)
	// 			.post('/api/v1/groups/1/actions')
	// 			.set('authorization', 'Bearer ' + response.body.token)
	// 			.send({
	// 				title: "New Title",
	// 				subtitle: "SubTitle",
	// 				description: "Description",
	// 				thanks_msg: "Thanks",
	// 				start_at: "2017-03-03 11:49:23",
	// 				param1: "Value"
	// 			})
	// 			.end((err, res) => {
	// 				should.exist(err);
	// 				res.status.should.eql(400);
	// 				res.type.should.eql('application/json');
	// 				res.body.success.should.eql(0);
	// 				done();
	// 			});
	// 		});
	// 	});

	// 	it('should return No permission /groups/2/actions; json is not member of group2', (done) => {
	// 		chai.request(app)
	// 		.post('/api/v1/groups/2/actions')
	// 		.set('authorization', 'Bearer ' + token)
	// 		.send({
	// 			title: "New Title",
	// 			subtitle: "SubTitle",
	// 			description: "Description",
	// 			thanks_msg: "Thanks",
	// 			start_at: "2017-03-03 11:49:23",
	// 			action_type_id: 1,
	// 			param1: "Value"
	// 		})
	// 		.end((err, res) => {
	// 			should.exist(err);
	// 			res.status.should.eql(403);
	// 			res.type.should.eql('application/json');
	// 			res.body.success.should.eql(0);
	// 			done();
	// 		});
	// 	});

	// 	it('should return error on /groups/1/actions;with action_type_id 100:non exist ', (done) => {
	// 		chai.request(app)
	// 		.post('/api/v1/groups/2/actions')
	// 		.set('authorization', 'Bearer ' + token)
	// 		.send({
	// 			title: "New Title",
	// 			subtitle: "SubTitle",
	// 			description: "Description",
	// 			thanks_msg: "Thanks",
	// 			start_at: "2017-03-03 11:49:23",
	// 			action_type_id: 100,
	// 			param1: "Value"
	// 		})
	// 		.end((err, res) => {
	// 			should.exist(err);
	// 			res.status.should.eql(404);
	// 			res.type.should.eql('application/json');
	// 			res.body.success.should.eql(0);
	// 			done();
	// 		});
	// 	});

	// 	it('should return Not Found /groups/100/actions; 100 is non-exist', (done) => {
	// 		chai.request(app)
	// 		.post('/api/v1/groups/100/actions')
	// 		.set('authorization', 'Bearer ' + token)
	// 		.send({
	// 			title: "New Title",
	// 			subtitle: "SubTitle",
	// 			description: "Description",
	// 			thanks_msg: "Thanks",
	// 			start_at: "2017-03-03 11:49:23",
	// 			action_type_id: 1,
	// 			param1: "Value"
	// 		})
	// 		.end((err, res) => {
	// 			should.exist(err);
	// 			res.status.should.eql(404);
	// 			res.type.should.eql('application/json');
	// 			res.body.success.should.eql(0);
	// 			done();
	// 		});
	// 	});

	// 	it('should return success log in with erwin and /groups/2/actions', (done) => {
	// 		chai.request(app)
	// 		.post('/api/v1/auth/login')
	// 		.send({
	// 			email: 'erwin@actodo.co',
	// 			password: 'letmein'
	// 		})
	// 		.end((error, response) => {
	// 			should.not.exist(error);
	// 			token = response.body.token;
	// 			chai.request(app)
	// 			.get('/api/v1/groups/2/actions')
	// 			.set('authorization', 'Bearer ' + response.body.token)
	// 			.end((err, res) => {
	// 				should.not.exist(err);
	// 				res.status.should.eql(200);
	// 				res.type.should.eql('application/json');
	// 				res.body.success.should.eql(1);
	// 				res.body.should.have.property('actions');
	// 				done();
	// 			});
	// 		});
	// 	});
	// });

  // describe('PUT /api/v1/groups', () => {
  //   let token = "";
  //   it('should login with erwin and update group_id 2', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'erwi n@actodo.co',
  //       password: 'letmein'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .put('/api/v1/groups/2')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({
  //         name: 'TEST CREATE GROUP',
  //         private: 0,
  //         description: 'TEST CREATE GROUP DESCRIPTION',
  //         welcome: 'WELCOME TO THE TEST CREATE GROUP',
  //         latitude: '51.5032520',
  //         longitude: '-0.1278990'
  //       })
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.success.should.eql(1);
  //         res.body.should.have.property('group');
  //         res.body.group.should.have.property('name');
  //         res.body.group.name.should.equal('TEST CREATE GROUP');
  //         token = response.body.token;
  //         done();
  //       });
  //     });
  //   });
  //   it('should update group_id 2 setting :allow_member_action and member_action_level', (done) => {
  //     chai.request(app)
  //     .put('/api/v1/groups/2')
  //     .set('authorization', 'Bearer ' + token)
  //     .send({
  //       name: 'TEST CREATE GROUP',
  //       private: 0,
  //       description: 'TEST CREATE GROUP DESCRIPTION',
  //       welcome: 'WELCOME TO THE TEST CREATE GROUP',
  //       latitude: '51.5032520',
  //       longitude: '-0.1278990',
  //       member_action_level: 4444,
  //       allow_memeber_action: true
  //     })
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       res.status.should.eql(200);
  //       res.type.should.eql('application/json');
  //       res.body.success.should.eql(1);
  //       res.body.should.have.property('group');
  //       res.body.group.should.have.property('name');
  //       res.body.group.name.should.equal('TEST CREATE GROUP');
  //       done();
  //     });
  //   });

  //   it('should return 401 with jasonh and update group_id 2', (done) => {
  //     chai.request(app)
  //     .post('/api/v1/auth/login')
  //     .send({
  //       email: 'jasonh@actodo.co',
  //       password: 'letmein'
  //     })
  //     .end((error, response) => {
  //       should.not.exist(error);
  //       chai.request(app)
  //       .put('/api/v1/groups/2')
  //       .set('authorization', 'Bearer ' + response.body.token)
  //       .send({
  //         name: 'TEST CREATE GROUP',
  //         private: 0,
  //         description: 'TEST CREATE GROUP DESCRIPTION',
  //         welcome: 'WELCOME TO THE TEST CREATE GROUP',
  //         latitude: '51.5032520',
  //         longitude: '-0.1278990'
  //       })
  //       .end((err, res) => {
  //         should.exist(err);
  //         res.status.should.eql(500);
  //         res.type.should.eql('application/json');
  //         res.body.success.should.eql(0);
  //         done();
  //       });
  //     });
  //   });
  //   it('return 401 unauthorized PUT /groups/2 without token', (done) => {
  //     chai.request(app)
  //     .put('/api/v1/groups/2')
  //     .send({
  //       created_by_user_id: 1,
  //       name: 'TEST CREATE GROUP',
  //       private: 0,
  //       description: 'TEST CREATE GROUP DESCRIPTION',
  //       welcome: 'WELCOME TO THE TEST CREATE GROUP',
  //       banner_image_url: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png',
  //       latitude: '51.5032520',
  //       longitude: '-0.1278990'
  //     })
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.status.should.eql(400);
  //       done();
  //     });
  //   });
  // });
//   describe('GET /api/v1/groups', () => {
//     it('should return success', (done) => {
//       chai.request(app)
//       .get('/api/v1/groups')
//       .end((err, res) => {
//         should.not.exist(err);
//         res.status.should.eql(200);
//         res.type.should.eql('application/json');
//         res.body.success.should.eql(1);
//         done();
//       });
//     });

//     it('should return array of groups and groups have settings, tags, creator', (done) => {
//       chai.request(app)
//       .get('/api/v1/groups')
//       .end((err, res) => {
//         should.not.exist(err);
//         res.status.should.eql(200);
//         res.type.should.eql('application/json');
//         res.body.should.have.property('groups');
//         //res.body.groups.should.include.keys('settings','tags','creator');
//         done();
//       });
//     });

//     it('should return a group with name searchquery=\'act\'', (done) => {
//       chai.request(app)
//       .get('/api/v1/groups')
//       .send({name: 'act'})
//       .end((err, res) => {
//         should.not.exist(err);
//         res.status.should.eql(200);
//         res.type.should.eql('application/json');
//         res.body.should.have.property('groups');
//         done();
//       });
//     });

//     it('should login with jasonh and return groups', (done) => {
//       chai.request(app)
//       .post('/api/v1/auth/login')
//       .send({
//         email: 'jasonh@actodo.co',
//         password: 'letmein'
//       })
//       .end((error, response) => {
//         should.not.exist(error);
//         chai.request(app)
//         .get('/api/v1/groups')
//         .set('authorization', 'Bearer ' + response.body.token)
//         .send({
//           name: 'act',
//           distance: 1000,
//           latitude: '51.5032520',
//           longitude: '-0.1278990'
//         })
//         .end((err, res) => {
//           should.not.exist(err);
//           res.status.should.eql(200);
//           res.type.should.eql('application/json');
//           res.body.success.should.eql(1);
//           done();
//         });
//       });
//     });
//   });

//   describe('GET /api/v1/groups/:group_id/members', () => {
//     it('should return error without login', (done) => {
//       chai.request(app)
//       .get('/api/v1/groups/1/members')
//       .end((err, res) => {
//         should.exist(err);
//         res.status.should.eql(401);
//         res.type.should.eql('application/json');
//         res.body.success.should.eql(0);
//         done();
//       });
//     });

//     it('should login with jasonh and return groups', (done) => {
//       chai.request(app)
//       .post('/api/v1/auth/login')
//       .send({
//         email: 'jasonh@actodo.co',
//         password: 'letmein'
//       })
//       .end((error, response) => {
//         should.not.exist(error);
//         chai.request(app)
//         .get('/api/v1/groups/1/members')
//         .set('authorization', 'Bearer ' + response.body.token)
//         .end((err, res) => {
//           should.not.exist(err);
//           res.status.should.eql(200);
//           res.type.should.eql('application/json');
//           res.body.success.should.eql(1);
//           done();
//         });
//       });
//     });


//     it('should login with jasonh and return error on wrong group_id', (done) => {
//       chai.request(app)
//       .post('/api/v1/auth/login')
//       .send({
//         email: 'jasonh@actodo.co',
//         password: 'letmein'
//       })
//       .end((error, response) => {
//         should.not.exist(error);
//         chai.request(app)
//         .get('/api/v1/groups/122/members')
//         .set('authorization', 'Bearer ' + response.body.token)
//         .end((err, res) => {
//           should.exist(err);
//           res.status.should.eql(404);
//           res.type.should.eql('application/json');
//           res.body.success.should.eql(0);
//           done();
//         });
//       });
//     });
    
//     it('should login with jasonh and return error on group_id:2 (jason is not member of group2)', (done) => {
//       chai.request(app)
//       .post('/api/v1/auth/login')
//       .send({
//         email: 'jasonh@actodo.co',
//         password: 'letmein'
//       })
//       .end((error, response) => {
//         should.not.exist(error);
//         chai.request(app)
//         .get('/api/v1/groups/2/members')
//         .set('authorization', 'Bearer ' + response.body.token)
//         .end((err, res) => {
//           should.exist(err);
//           res.status.should.eql(403);
//           res.type.should.eql('application/json');
//           res.body.success.should.eql(0);
//           done();
//         });
//       });
//     });
//  });

  describe('DELETE /api/v1/groups/:group_id', () => {
    it('should return error without login', (done) => {
      chai.request(app)
      .del('/api/v1/groups/1')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.success.should.eql(0);
        done();
      });
    });

    it('should return error DELETE /groups/:group_id 999 non-exist', (done) => {
      chai.request(app)
      .del('/api/v1/groups/999')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.success.should.eql(0);
        done();
      });
    });

    it('should login with jasonh and return 401 for group_id 2 :without admin_settings', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .del('/api/v1/groups/2')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(500);
          res.type.should.eql('application/json');
          res.body.success.should.eql(0);
          done();
        });
      });
    });

    it('should login with erwin and return success', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'erwin@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .del('/api/v1/groups/2')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(204);
          done();
        });
      });
    });
  });

  describe('POST /api/v1/groups', () => {

    it('should return error without login', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .post('/api/v1/groups')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(400);
          res.type.should.eql('application/json');
          res.body.success.should.eql(0);
          done();
        });
      });
    });

    it('should create a new group', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jasonh@actodo.co',
        password: 'letmein'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(app)
        .post('/api/v1/groups')
        .set('authorization', 'Bearer ' + response.body.token)
        .send({
          name: 'TEST CREATE GROUP',
          private: 0,
          description: 'TEST CREATE GROUP DESCRIPTION',
          welcome: 'WELCOME TO THE TEST CREATE GROUP',
          latitude: '51.5032520',
          longitude: '-0.1278990'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(201);
          res.type.should.eql('application/json');
          res.body.success.should.eql(1);
          res.body.should.have.property('group');
          res.body.group.should.have.property('name');
          res.body.group.name.should.equal('TEST CREATE GROUP');
          res.body.group.created_by_user_id.should.equal(1);
          done();
        });
      });
    });


    it('return 401 unauthorized', (done) => {
      chai.request(app)
      .post('/api/v1/groups')
      .send({
        name: 'TEST CREATE GROUP',
        private: 0,
        description: 'TEST CREATE GROUP DESCRIPTION',
        welcome: 'WELCOME TO THE TEST CREATE GROUP',
        latitude: '51.5032520',
        longitude: '-0.1278990'
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(401);
        done();
      });
    });
  });

//   describe('GET /api/v1/groups', () => {
//     it('should return a success', (done) => {
//       chai.request(app)
//       .get('/api/v1/groups')
//       .end((err, res) => {
//         should.not.exist(err);
//         res.status.should.eql(200);
//         res.type.should.eql('application/json');
//         res.body.success.should.eql(1);
//         done();
//       });
//     });

//     it('should return array of groups and groups have settings, tags, creator', (done) => {
//       chai.request(app)
//       .get('/api/v1/groups')
//       .end((err, res) => {
//         should.not.exist(err);
//         res.status.should.eql(200);
//         res.type.should.eql('application/json');
//         res.body.should.have.property('groups');
//         res.body.groups.should.include.keys('settings','tags','creator');
//         done();
//       });
//     });
    
//   });

// //   describe('GET /api/v1/groups/3', () => {
// //     it('should return expected group', (done) => {
// //       chai.request(app)
// //       .get('/api/v1/groups/3')
// //       .end((err, res) => {
// //         should.not.exist(err);
// //         res.status.should.eql(200);
// //         res.type.should.eql('application/json');
// //         res.body.should.have.property('group');
// //         res.body.group.should.have.property('group_id');
// //         res.body.group.group_id.should.equal(3);
// //         done();
// //       });
// //     });
// //   });


// //   describe('PUT /api/v1/groups/1', () => {
// //     it('should update group info and return updated group', (done) => {
// //       chai.request(app)
// //       .post('/api/v1/auth/login')
// //       .send({
// //         email: 'seed1@test.net',
// //         password: 'password'
// //       })
// //       .end((error, response) => {
// //         should.not.exist(error);
// //         chai.request(app)
// //         .put('/api/v1/groups/1')
// //         .set('authorization', 'Bearer ' + response.body.token)
// //         .send({'name':'NEWLY UPDATED NAME','private':1})
// //         .end((err, resp) => {
// //           should.not.exist(err);
// //           resp.status.should.eql(200);
// //           resp.should.be.json;
// //           resp.body.should.be.a('object');
// //           resp.body.should.have.property('group');
// //           resp.body.group.should.have.property('group_id');
// //           resp.body.group.group_id.should.equal(1);
// //           resp.body.group.name.should.equal('NEWLY UPDATED NAME');
// //           resp.body.group.name.should.not.equal('Test Group 1');
// //           resp.body.group.private.should.equal(1);
// //           done();
// //         });
// //       });
// //     });
// //     it('should return an error when not logged in', (done) => {
// //       chai.request(app)
// //       .put('/api/v1/groups/1')
// //       .send({'name':'NEW','private':1})
// //       .end((err, res) => {
// //         should.exist(err);
// //         res.status.should.eql(401);
// //         done();
// //       });
// //     });
// //   });

// //   describe('POST /api/v1/groups/4/members', () => {
// //     it('should add user to the group', (done) => {
// //       chai.request(app)
// //       .post('/api/v1/auth/login')
// //       .send({
// //         email: 'seed1@test.net',
// //         password: 'password'
// //       })
// //       .end((error, response) => {
// //         should.not.exist(error);
// //         chai.request(app)
// //         .post('/api/v1/groups/4/members')
// //         .set('authorization', 'Bearer ' + response.body.token)
// //         .end((err, res) => {
// //           should.not.exist(err);
// //           res.status.should.eql(200);
// //           done();
// //         });
// //       });
// //     });
// //   });

// //   describe('GET /api/v1/groups/1/members', () => {
// //     it('should return list of group members', (done) => {
// //       chai.request(app)
// //       .post('/api/v1/auth/login')
// //       .send({
// //         email: 'seed1@test.net',
// //         password: 'password'
// //       })
// //       .end((error, response) => {
// //         should.not.exist(error);
// //         chai.request(app)
// //         .get('/api/v1/groups/1/members')
// //         .set('authorization', 'Bearer ' + response.body.token)
// //         .end((err, res) => {
// //           should.not.exist(err);
// //           res.status.should.eql(200);
// //           res.should.be.json;
// //           res.body.should.be.a('object');
// //           res.body.should.have.property('members');
// //           res.body.members[0].username.should.equal('seeder1');
// //           done();
// //         });
// //       });
// //     });
// //   });

// //   describe('PUT /api/v1/groups/1/members/2', () => {
// //     it('should update the specified member\'s group permissions ', (done) => {
// //       chai.request(app)
// //       .post('/api/v1/auth/login')
// //       .send({
// //         email: 'seed1@test.net',
// //         password: 'password'
// //       })
// //       .end((error, response) => {
// //         should.not.exist(error);
// //         chai.request(app)
// //         .put('/api/v1/groups/1/members/2')
// //         .set('authorization', 'Bearer ' + response.body.token)
// //         .send({'mod_actions':1,'submit_action':1})
// //         .end((err, res) => {
// //           should.not.exist(err);
// //           res.status.should.eql(200);
// //           res.should.be.json;
// //           res.body.should.be.a('object');
// //           res.body.should.have.property('members');
// //           res.body.members[1].username.should.eql('seeder2');
// //           res.body.members[1].mod_actions.should.eql(1);
// //           res.body.members[1].submit_action.should.eql(1);
// //           res.body.members[1].admin_settings.should.eql(0);
// //           done();
// //         });
// //       });
// //     });
// //   });

// //   describe('PUT /api/v1/groups/1/members/2', () => {
// //     it('should return 401 unauthorized', (done) => {
// //       chai.request(app)
// //       .post('/api/v1/auth/login')
// //       .send({
// //         email: 'seed2@test.net',
// //         password: 'password'
// //       })
// //       .end((error, response) => {
// //         should.not.exist(error);
// //         chai.request(app)
// //         .put('/api/v1/groups/1/members/1')
// //         .set('authorization', 'Bearer ' + response.body.token)
// //         .send({'mod_actions':0,'submit_action':0})
// //         .end((err, res) => {
// //           should.exist(err);
// //           res.status.should.eql(401);
// //           done();
// //         });
// //       });
// //     });
// //   });

});
