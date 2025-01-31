## Описание

Есть некоторый API с псевдо данными (справочник НДС)

Реализованы методы:

1. Получение статического токена, всегда один и тот же; /token
2. Получение всех элементов; GET api/nds
3. Получение конкретного элемента; GET api/nds/{id}
4. Создание элемента; POST api/nds
5. Изменение элемента; PUT /api/nds
6. Удаление элемента(жесткое). DELETE/api/nds

Требуется реализовать простой UI в виде таблицы , представление справочника с UI реализацией всех методов.

Создание, Редактирование , Мягкое удаление, Восстановление, Жесткое удаление, Обновление списка элементов.

Кроме жесткого удаления - сделать удаление\восстановление элемента через PUT. Удаленные элементы лучше как-то выделить, можно сделать клиентский фильтр ‘удаленные\неудаленные’ (серверного нет)

Метод авторизации может быть представлен в виде обычного текстбокса с jwt-токеном, кнопки авторизоваться с сохранением в LocalStorage (можно так же hardcode).

Форму реализовать на React\TS. Вся компонентная база на усмотрение кандидата.

Желательно сделать настройку указания базового адреса API.

Обрабатывать ошибки 401 и 404.

Спецификация: http://195.133.39.82:8080/swagger/index.html

Хост API: http://195.133.39.82:8080

```sh
git clone https://github.com/zebpaa/Spargo.git
cd Spargo/
code .
```

## Screenshots

![Screenshot_1](https://github.com/user-attachments/assets/e3ec202c-dc33-4713-8c71-d228b027328f)
![Screenshot_7](https://github.com/user-attachments/assets/7ac9ca27-697f-442f-a435-42eb8a31cfc5)
![Screenshot_2](https://github.com/user-attachments/assets/2436b33b-8908-436b-814c-5ed24aa40a73)
![Screenshot_3](https://github.com/user-attachments/assets/4fb3f9b9-dc79-4d54-8170-b5099d2deca6)
![Screenshot_4](https://github.com/user-attachments/assets/eec31c8c-bbe8-4eb0-bb7c-c4849cd87fe2)
![Screenshot_5](https://github.com/user-attachments/assets/76177124-4123-4330-af9b-c6f9661a98cc)
![Screenshot_6](https://github.com/user-attachments/assets/7be5b755-9f36-481a-9c65-bd2e310a7e4a)

## Development command

```sh
npm install
npm run dev
```
