const mongoose = require('mongoose')
const supertest = require('supertest')
const { Suggestion } = require('../../models/suggestion')
const { Category } = require('../../models/category')
const {User} = require("../../models/user")


let server

describe('/api/suggestions', () => {
  beforeEach(() => { server = require('../../index') })
  afterEach(async () => {
    await Suggestion.deleteMany({})
    await Category.deleteMany({})
    await server.close()
  })


  const url = '/api/suggestions/'

  describe("GET/", () => {
    it('should return all suggestion', async () => {
      const suggestions = [
        {
          title:"Ligth",
          description: "ligth mode helps to enhance comments on solutions ",
          upvotes: [],
          category: {
            _id: mongoose.Types.ObjectId(),
            title: "ux"
          }
    
        },
        {
          title: "Dark",
          description: "dark mode helps to enhance comments on solutions ",
          upvotes: [],
          category: {
            _id: mongoose.Types.ObjectId(),
            title: "ui"
          }    
        },
      ]
     await Suggestion.insertMany(suggestions)
      const res = await supertest(server).get(url)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
    })
  })

  describe("POST/", () => {
    let newSuggestion
    let category
    let title 
    let description
    let categoryId
    beforeEach(async() => {
     category=  new Category({
        title:"ux"
     })
      await category.save()
        title ="Ligth",
        description = "ligth mode helps to enhance comments on solutions ",
        categoryId = category._id
    })

    const exec = async () => supertest(server).post(url).send(newSuggestion)

    it('should return 400 if input is not valid', async () => {
      newSuggestion = {
        title: '',
        description,
        categoryId
     }

      const res = await exec()
      expect(res.status).toBe(400)
    })
    it("should return 400 if categoryId is not valid", async () => {
      newSuggestion = {
        title,
        description,
        categoryId: ""
      }
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it("should return 400 if given  categoryId is not valid ", async () => {
      newSuggestion = {
        title,
        description,
        categoryId: mongoose.Types.ObjectId()
      }
      const res = await exec()
      expect(res.status).toBe(400)
    })
    it("should return 200 if input is valid", async () => {
      newSuggestion = {
        title,
        description,
        categoryId
      }
      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("commentsLength")
      expect(res.body).toHaveProperty("description")

    })


    it("should save the suggestion if input is valid", async () => {
      newSuggestion = {
        title,
        description,
        categoryId
      }
       await exec()
      const suggestion = await Suggestion.find()
      expect(suggestion).not.toBeNull()
    })
  })

  describe("PUT/:ID", () => {
    let newSuggestion
    let category
    let suggestion
    let suggestionId
    let token
    beforeEach(async () => {
      token = new User().generateAuthToken()
     category=  new Category({
        title:"ux"
     })
      await category.save()
      suggestion = new Suggestion({
        title :"Ligth",
        description : "ligth mode helps to enhance comments on solutions ",
        upvotes : [],
        category: {
          _id: category._id,
          title: category.title
        }
      })
      await suggestion.save()
      suggestionId = suggestion._id


      newSuggestion = {
        title :"dark",
        description : "ligth mode helps to enhance comments on solutions ",
        upvotes : [mongoose.Types.ObjectId()],
        categoryId: category._id
      }
     
    })

    const exec = async () => supertest(server).put(url + suggestionId ).set('x-auth-token', token).send(newSuggestion)

    it('should return 401 if user is not logged in.', async () => {
      token = ""
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if input is not valid', async () => {
      newSuggestion.title = ""

      const res = await exec()
 
      expect(res.status).toBe(400)
    })
    
    it("should return 400 if categoryId is not valid", async () => {
    newSuggestion.categoryId = mongoose.Types.ObjectId()
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it("should return 404 if suggestionId is not a mongoose id", async () => {
      suggestionId = "90"
        const res = await exec()
        expect(res.status).toBe(404)
      })

    it("should return 404 if suggestionId given is not valid", async () => {
      suggestionId = mongoose.Types.ObjectId()
        const res = await exec()
        expect(res.status).toBe(404)
      })

    it("should return 200 if input is valid", async () => {

      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body).not.toBeNull()
      expect(res.body).toHaveProperty("description")
    })


    it("should save the suggestion if input is valid", async () => {

       await exec()
      const suggestion = await Suggestion.findById(suggestionId)
      expect(suggestion.upvotes).not.toBe(newSuggestion.upvotes)
    })
  })


  describe("GET/:ID", () => {
    let category
    let suggestion
    let suggestionId
    beforeEach(async() => {
     category=  new Category({
        title:"ux"
     })
      await category.save()
      suggestion = new Suggestion({
        title :"Ligth",
        description : "ligth mode helps to enhance comments on solutions ",
        category: {
          _id: category._id,
          title: category.title
        }
      })
      await suggestion.save()
      suggestionId = suggestion._id

     
    })

    const exec = async () => supertest(server).get(url + suggestionId )


    it("should return 404 if suggestionId is not a mongoose id", async () => {
      suggestionId = "90"
        const res = await exec()
        expect(res.status).toBe(404)
      })

    it("should return 404 if suggestionId given is not valid", async () => {
      suggestionId = mongoose.Types.ObjectId()
        const res = await exec()
        expect(res.status).toBe(404)
      })


    it("should return 200 valid suggestionId is given", async () => {

      const res = await exec()
      const suggestion = await Suggestion.findById(suggestionId)
      expect(res.status).toBe(200)
      expect(suggestion).toHaveProperty('upvotes')
    })
  })


  describe("DELETE/:ID", () => {
    let category
    let suggestion
    let suggestionId
    let token
    beforeEach(async () => {
      token = new User().generateAuthToken()
     category=  new Category({
        title:"ux"
     })
      await category.save()
      suggestion = new Suggestion({
        title :"Ligth",
        description : "ligth mode helps to enhance comments on solutions ",
        category: {
          _id: category._id,
          title: category.title
        }
      })
      await suggestion.save()
      suggestionId = suggestion._id

     
    })


    const exec = async () => supertest(server).delete(url + suggestionId ).set("x-auth-token", token)

    it("should return 401 if user is not logged in.", async () => {
      token = ""
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it("should return 404 if suggestionId is not a mongoose id", async () => {
      suggestionId = "90"
        const res = await exec()
        expect(res.status).toBe(404)
      })

    it("should return 404 if suggestionId given is not valid", async () => {
      suggestionId = mongoose.Types.ObjectId()
        const res = await exec()
        expect(res.status).toBe(404)
      })


    it("should return 200 suggestion was deleted", async () => {

      const res = await exec()
      expect(res.status).toBe(200)
    })
  })


})