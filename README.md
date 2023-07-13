<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Hướng dẫn chạy server
- Mở cmd, vào thư mục server:
```
cd server
```
- Tải tất cả dependencies:
```
npm i
```
- Chạy server (chế độ dev):
```
npm run start:dev
```
- Khi xuất hiện dòng bên dưới thì coi như thành công
```
server is ready at http://localhost:3000
```
### Kết nối csdl Mongo
- Sửa file `.env.example` thành `.env`
- Thêm các biến môi trường do leader chia sẻ
### Module Mẫu:
- Tham khảo một module mẫu là **tutorial**, đã có comment chi tiết, đầy đủ ở từng file
- Module này cung cấp RESTful API cơ bản
### Quy tắc
- **Không sửa** các file như ***main.ts***, ***app.module.ts***, ***app.controller.ts***,... có nhu cầu config thì nói với leader
- Mỗi người sẽ chỉ làm trên mỗi module (folder) của mình
- Project đã cấu hình quá trình **CI** (Continuous Integration) với Circle CI, yêu cầu mỗi người làm việc trên brach riêng trước khi merge vào brach main
### Hướng dẫn làm việc với Circle CI, Github:
- Tạo và đổi branch làm việc của mình (khác với main)
```
git checkout -b my_branch
```
- Code theo công việc, module được giao, **nên** tìm hiểu về [**Unit Test trong Nest JS**](https://www.tomray.dev/nestjs-unit-testing) và viết vài unit test, thực hiện test local trước khi commit
- Sau khi xong thì thực hiện commit và push
```
git add .
git commit -m "..."
git push -u origin my_branch
```
- Mở **Github**, vào project (repository) vừa mới push, sẽ hiện thông báo dạng `my_branch` vừa push, thì nhấn vào nút **Compare & pull request**
- Tại đây thêm title, comment cho dễ hiểu rồi **Create pull request**
- Sau khi tạo pull request, sẽ thấy quá trình tự động set up, test này nọ của **Circle CI** bên dưới, **chỉ merge được** vào branch ***main*** khi đã pass hết test của Circle CI
### Commit github semantics: 
- [Link](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
## Tham khảo tài liệu :
- [Nest JS Document](https://docs.nestjs.com/)
- [Nest JS Basic with MongoDB](https://dev.to/carlomigueldy/building-a-restful-api-with-nestjs-and-mongodb-mongoose-2165)
- [Status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Nest JS Testing](https://www.tomray.dev/nestjs-unit-testing)

