'use strict';

const dbConfig = require('../../knexfile'),
  knex = require('knex')(dbConfig[process.env.NODE_ENV]),
  Model = require('objection').Model;

let afterDone;

beforeEach((done) => {
  knex.transaction(function (newtrx) {
    Model.knex(newtrx);
    done();
  }).catch(function () {
    // call afterEach's done
    afterDone();
  });
});

afterEach((done) => {
  afterDone = done;
  Model.knex().rollback();
  done()
});

afterAll((done) => {
  return knex.destroy().then(() => {
    done()
  })
})