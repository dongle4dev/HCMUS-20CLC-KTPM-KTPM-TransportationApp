import { Test, TestingModule } from '@nestjs/testing';
import { TutorialService } from './tutorial.service';
import { Model } from 'mongoose';
import { Tutorial } from './schemas/tutorial.schema';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';


// File này dùng để test cho service

describe('TutorialService', () => {

  // khai báo các service cùa mình để test
  let tutorialService: TutorialService;

  // khai báo model (lấy dữ liệu mongoDb) nằm trong service
  let tutorialModel: Model<Tutorial>;

  // Khai báo các hàm của MongoDB để giả sử dụng
  const mockTutorialService = {
    findById: jest.fn(),
  };

  // Khái báo dữ liệu mẫu giả
  const tutorialMock = {
    _id: '64abe3f639c6f4212c66b02b',
    title: 'NestJS Tutorial',
    author: 'Chi Hien',
    tag: 'Node JS',
    view: 7,
    createdAt: '2023-07-10T10:56:54.209Z',
    updatedAt: '2023-07-10T10:56:54.209Z',
    __v: 0,
  };

  // set up các biến trên
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialService,
        {
          provide: getModelToken(Tutorial.name),
          useValue: mockTutorialService,
        },
      ],
    }).compile();


    tutorialService = module.get<TutorialService>(TutorialService);
    tutorialModel = module.get<Model<Tutorial>>(getModelToken(Tutorial.name));
  });

  // it('should be defined', () => {
  //   expect(tutorialService).toBeDefined();
  // });

  // Test cho hàm findById của service
  describe('findById', () => {

    // Test case 1: nên trả về tutorial khi nhập đúng id
    it('should find and return tutorial by id', async () => {

      //Giả lập khiến cho hàm findById của model (nằm trong service) phải trả về giá trị tutorialMock 
      // ! Lưu ý phân biệt hai hàm findById của service và model nằm trong service
      jest.spyOn(tutorialModel, 'findById').mockResolvedValue(tutorialMock);

      // Gọi hàm findById của service để test với id
      const data = await tutorialService.findById(tutorialMock._id);

      //Kiểm tra xem hàm findById của model (nằm trong service) CÓ được GỌI không
      expect(tutorialModel.findById).toHaveBeenCalledWith(tutorialMock._id);

      //Kiểm tra xem giá trị trả về của findById của service có đúng kết quả mong muốn
      expect(data).toEqual(tutorialMock);
    });

    // Test case 2: nên trả về NotFound (404) khi không tìm thấy id trong db
    it('should return NotFound if tutorial not found with id', async () => {

      //Giả lập khiến cho hàm findById của model (nằm trong service) phải trả về giá trị null (vì mình muốn không tìm thấy) 
      jest.spyOn(tutorialModel, 'findById').mockResolvedValue(null);

      // Kiểm tra xem findById có throw NotFoundException khi không tìm thấy
      await expect(tutorialService.findById(tutorialMock._id)).rejects.toThrow(
        NotFoundException,
      );

      //Kiểm tra xem hàm findById của model (nằm trong service) CÓ được GỌI không
      expect(tutorialModel.findById).toHaveBeenCalledWith(tutorialMock._id);
    });
  });
});
