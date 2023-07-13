import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';


// Lớp này giúp đảm bảo kiểm tra đầu vào trước khi insert vào db
// - ApiProperty: chỉ dùng cho mục dích miêu tả rỏ rảng trong api document (swagger), không bắt buộc nhưng có để team dễ dàng hiểu api cần gì
// các decorator khác từ class validator dùng để kiểm tra đầu vào, nếu thất bại tự trả về BadRequest (400) cho client mà mình không cần viết hàm kiểm tra
export class CreateTutorialDto {
  @ApiProperty({ example: 'NestJS Tutorial', description: 'Tutorial title' })
  @IsNotEmpty() // thuộc tính bắt buộc phải có khi muốn tạo dữ liệu vào db
  @IsString()   // thuộc tính này phải là dạng String
  readonly title: string;

  @ApiProperty({ example: 'Chi Hien', description: 'Tutorial author' })
  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @ApiProperty({ example: 'Node JS', description: 'Tutorial tag' })
  @IsString()
  @IsOptional() // thuộc tính không bắt buộc có, NHƯNG nếu có thì kiểm tra IsString ở trên
  readonly tag: string;

  @ApiProperty({ example: 7, description: 'Tutorial view' })
  @IsPositive() // thuộc tính là số lớn hơn 0
  @IsInt( ) // thuộc tính là số nguyên
  readonly view: number;
}
