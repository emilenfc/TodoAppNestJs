import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service"
 import * as pactum from 'pactum'
import { AuthDto } from "src/auth/dto"
import { EditUserDto } from "src/user"

describe('App e2e', () => {
  let app: INestApplication;
  let prisma:PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    );
    await app.init();
    await app.listen(3333)
    prisma = app.get(PrismaService);
    await prisma.cleanDB()
pactum.request.setBaseUrl('http://localhost:3333')
  });
  afterAll(() => {
    app.close()
  })
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '1234'
    }
    describe('signUp', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody({ password: dto.password })
          .expectStatus(400)
      })
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody({ password: dto.email })
          .expectStatus(400)
      })
      it('should throw if all is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .expectStatus(400)
      })
      it('should signUp', () => {
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody(dto)
          .expectStatus(201)
      });

    })
    describe('signIn', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin',)
          .withBody({ password: dto.password })
          .expectStatus(400)
      })
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin',)
          .withBody({ password: dto.email })
          .expectStatus(400)
      })
      it('should throw if all is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin',)
          .expectStatus(400)
      })
      it('should signIn', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'acces_token')
      });

    });
  });
  describe('User', () => {
    describe('Get user', () => { 
      it('shild get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:'Bearer $S{userAt}',
          })
          .expectStatus(200)
      })
    })
    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: 'emile',
        email:'emile@gmail.com'
      }
      it('edit user',()=> {
        
        return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization:'Bearer $S{userAt}',
        })
        .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.email)
        .inspect()
      })
      
    })
   })
  describe('Bookmarks', () => { 
    describe('Get bookmarks', () => {
      it('should get empty bookmarks',()=> {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization:'Bearer $S{userAt}',
        })
          .expectStatus(200)
          
        .inspect()
      })
        })

    describe('create bookmarks',()=>{}) 
    describe('Get bookmarks',()=>{})
    describe('Edit bookmarks by id',()=>{})
    describe('Delete bookmarks by id',()=>{})

  })


})