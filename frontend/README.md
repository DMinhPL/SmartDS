
# GUIDELINE - Frontend

  

Guideline này để đảm bảo tiêu chuẩn SEO, tăng điểm Google Pagespeed Insights(https://developers.google.com/speed/pagespeed/insights) và validate W3C(https://validator.w3.org)

  

### SEO

  

Tối ưu hoá công cụ tìm kiếm của google

  
  

#### Trong thẻ BODY

  

Tag h1~ h6

  

* Trong một page bắt buộc phải có thẻ: H1, H2, H3. *Lưu ý: Trong 1 page chỉ được sử dụng duy nhất 1 tag H1*

* Sử dụng tag h1 cho phần heading lớn (word quan trọng nhất) của page.

* Sắp xếp tag hn theo thứ tự cấu trúc cú pháp thông thường.

  

Tag image

  

* Thẻ img phải có thuộc tính alt

* Thuộc tính alt được miêu tả bằng text có ý nghĩa

* Trong trường hợp không có miêu tả thì alt rỗng alt=""

  

Tag link (a)

  

* Bắt buộc phải có href (nếu không xác định được thì để #)

* Bắt buộc có thẻ title

  

### Google Pagespeed Insights

  

Tăng tăng điểm công cụ check speed của google

  

#### Image

* Favicon: https://www.favicon-generator.org/
* Convert Font chữ: [https://transfonter.org/](https://transfonter.org/)
* Apply sử dụng lazyload

* Tối ưu hình ảnh bằng công cụ https://tinypng.com/

* Mức độ Ưu tiên để hiển thị Icon: SVG, tiếp đến là FontIcon, cuối cùng là PNG

  

### Fonts

* Sử dụng Google font nếu như bản design có sử dụng

* Sử dụng Font Face https://www.web-font-generator.com/ nếu như bản thiết kế không có google font

  

## Lưu ý chung

  

* HTML phải được check và validate trên trang https://validator.w3.org/ trước khi bàn giao cho dev backend

* Thư mục hình template src/private/images/

* Thư mục hình dữ liệu (banner, news, avatar, project ....) để trong thư mục src/images/

  

## Commands

  

* ### Instalation

```
npm install
```

  

* ### Document

```
yarn start:doc
```

  

* ### Watch for development

```
yarn start
```

* ### Build project

```
yarn build
```

  

## Thay đổi trong Version 2

  

Để nâng cao hiệu suất load trang chủ: thêm `ishomepage = true` trong *.pug (Homepage)

```

block setting

- title = "3Forcom"

- ishomepage = true

```

### JS

Library: 
- Sử dụng extention(đuôi) `*.main.js` cho toàn trang và `*.home.main.js` cho trang chủ.
- Ngoài ra các thư viện như `jquery.js`, `moment.js`,... sẽ được nạp trước, cấu hình trong file `gulpfile.js`

Custom:

- `dist/assets/js/main.js` dành cho trang chủ
    * `src/js/common.js` dùng chung cho cả `home` và các trang khác.
    * `src/js/main.js` 

- `dist/assets/js/pages.js` dùng chung cho các trang con.
    * `src/js/common.js`
    * `src/js/pages.js` 
    * `name-abc.js` dùng cho các trang con viết riêng cho từng trang dễ debug (nếu muốn)

  

### CSS sử dụng

- `styles_homepage.scss` cho trang chủ (loại bỏ commponent ko cần thiết)

- `styles.scss` cho các trang khác như bình thường

### Fix lỗi ENOSPC trên Ubuntu Linux 
```
echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### CHANGELOGS
06/10/2019
- Bổ sung `purgecss` để loại bỏ CSS ko dùng tới (SEO Google Page Speed - saved 45%)
- Điều chỉnh lại README.md

09/2019
- Chỉnh lại `pug` task để build file nhanh hơn khi chỉnh sửa chỉ 1 file duy nhất
