export function JsonApiTest(request, baseUrl, schema, data, updatedData) {
  var id

  it('should be able to create on POST ', done => {
    request.post(baseUrl + '')
      .send(data)
      .expect(200)
      .then((response) => {
        id = response.body.data.id
        done()
      })
  })

  it('should be able to retrieve on GET with an id', done => {
    request.get(baseUrl + '/1')
      .expect(200)
      .then(response => {
        expect(response.body).toMatchObject({data: {}})
        done()
      })
  })

  it('should be able to update on PATCH', done => {
    updatedData.data.id = id
    request.patch(baseUrl + '')
      .set('Content-Type', 'application/json')
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.data.attributes).toMatchObject(updatedData.data.attributes)
        done()
      })
  })

  it('should be able to list on GET', done => {
    request.get(baseUrl + '')
      .then(response => {
        expect(response.body).toHaveProperty('data')
        done()
      })
  })

  it('should be able to delete on DELETE', done => {
    request.delete(baseUrl + '/' + id)
      .expect(200, done)
  })

  it('should respond with 404 when an unknown ID is specified on retrieve', done => {
    request.get(baseUrl + '/9876')
      .expect(404, done)
  })

  it('should respond with 404 when an unknown ID is specified on update', done => {
    request.put(baseUrl + '')
      .set('Content-Type', 'application/json')
      .send(updatedData)
      .expect(404, done)
  })

  it('should respond with 404 when an unknown ID is specified on delete', done => {
    request.delete(baseUrl + '/9876')
      .expect(404, done)
  })
}