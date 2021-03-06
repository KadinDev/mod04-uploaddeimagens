CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

/* o NOT NULL na frente dos nomes, significa que não pode mandar um dado vazio */

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int
);


/*
  na tabela produto existe uma chave estrangeira na categoria id
  e ela está referenciando a tabela de categorias no campo id
*/

/*
  alterando uma tabela, estou adicionando uma chave estrangeira na categoria id,
  e a referência dela é categories id 
*/
ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");



ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

