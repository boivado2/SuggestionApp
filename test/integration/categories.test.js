const mongoose = require('mongoose')
const supertest = require('supertest')
const {Category} = require('../../models/category')

let server
describe("/api/categories", () => {
  beforeEach(() => { server = require('../../index') })
  afterEach(async () => {
    await Category.deleteMany({})
    await server.close()
  })

  const url = '/api/categories/'

  describe(' GET/', () => {

    it("should return all categories", async () => {

      let categories = [
        { title: "bug" },
        {title: "ux"}
      ]

      await Category.insertMany(categories)
      const res = await supertest(server).get(url)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)

  
    })
   
  })


  describe(' POST/', () => {
    let title

    beforeEach(() => {
      title = 'ui'
    })

    const exec = async () => supertest(server).post(url).send({title})

    it("should return 400 if title value is not valid", async () => {

      title ='w'
      const res = await exec()

      expect(res.status).toBe(400)

  
    })

    it("should save the category if input is valid", async () => {

     await exec()
     const categories = await Category.find()
      expect(categories).not.toBeNull()
    })

    it("should return the save document", async () => {

     const res =  await exec()
      expect(res.body).toHaveProperty('title')
     })
    
   
  })


  describe(' PUT/:id', () => {
    let title
    let newTitle
    let categoryId

    beforeEach(() => {
      title = 'ui'
     const category =  new Category({
        title
     })
      category.save()
      categoryId = category._id
      newTitle = 'Enhancement'
    })

    const exec = async () => supertest(server).put(url + categoryId).send({title: newTitle})

    it("should return 400 if updated input is not valid", async () => {

      newTitle ='w'
      const res = await exec()

      expect(res.status).toBe(400)
  
    })

    it("should return 404 if categoryId is invalid", async () => {

      categoryId = '1'
      const res = await exec()

      expect(res.status).toBe(404)

  
    })

    
    it("should return 404 if categoryId is not found", async () => {

      categoryId = mongoose.Types.ObjectId()
      const res = await exec()

      expect(res.status).toBe(404)

  
    })

    it("should save the updated input if it is valid", async () => {

     await exec()
     const category = await Category.findById(categoryId)
      expect(category.title).toBe(newTitle)
    })

    it("should return the save document", async () => {

     const res =  await exec()
      expect(res.body).toHaveProperty('title')
      expect(res.status).toBe(200)
     })
    
   
  })

  describe('DELETE/:id', () => {


    let title
    let categoryId

    beforeEach(() => {
      title = 'ui'
     const category =  new Category({
        title
     })
      category.save()
      categoryId = category._id
    })

    const exec = async () => supertest(server).delete(url + categoryId)

    it("should return 404 if categoryId is invalid", async () => {
      categoryId = '12'
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it("should return 404 if categoryId is not found", async () => {
      categoryId = mongoose.Types.ObjectId()
      const res = await exec()
      expect(res.status).toBe(404)
    })

    
    it("should return 200 if doument is deleted", async () => {
      const res = await exec()
      expect(res.status).toBe(200)
    })

    

    
  })

  
})